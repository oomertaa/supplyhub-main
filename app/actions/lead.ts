"use server";

import { Resend } from "resend";
import { getServiceClient } from "@/lib/supabase";

export type LeadState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "message" | "consent", string>>;
};

export const initialLeadState: LeadState = { status: "idle" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

function str(form: FormData, key: string): string {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export async function submitLead(_prev: LeadState, form: FormData): Promise<LeadState> {
  // Honeypot: campurile completate de boti sunt aruncate fara feedback.
  if (str(form, "website_url")) return { status: "success" };

  const name = str(form, "name");
  const company = str(form, "company");
  const email = str(form, "email");
  const phone = str(form, "phone");
  const message = str(form, "message");
  const consent = form.get("consent") === "on";
  const sourcePage = str(form, "source_page");
  const supplierIdRaw = str(form, "supplier_id");
  const supplierId = supplierIdRaw ? Number(supplierIdRaw) : null;
  const supplierName = str(form, "supplier_name");
  const supplierEmail = str(form, "supplier_email");

  const errors: LeadState["errors"] = {};
  if (name.length < 2) errors.name = "Scrie numele tău.";
  if (!EMAIL_RE.test(email)) errors.email = "Scrie o adresă de email validă.";
  if (message.length < 10) errors.message = "Descrie pe scurt ce echipamente cauți.";
  if (!consent) errors.consent = "Avem nevoie de acordul tău pentru a transmite cererea.";
  if (Object.keys(errors).length) {
    return { status: "error", message: "Verifică datele completate.", errors };
  }

  const db = getServiceClient();
  if (!db) {
    console.error("[supplyhub] SUPABASE_SERVICE_ROLE_KEY lipseste; lead-ul nu a fost salvat.");
    return {
      status: "error",
      message: "Cererea nu a putut fi trimisă. Încearcă din nou sau scrie-ne direct.",
    };
  }

  const { error } = await db.from("leads").insert({
    supplier_id: supplierId,
    requester_name: name,
    company: company || null,
    email,
    phone: phone || null,
    message,
    source_page: sourcePage || null,
    consent,
  });

  if (error) {
    console.error("[supplyhub] insert lead:", error.message);
    return {
      status: "error",
      message: "Cererea nu a putut fi trimisă. Încearcă din nou sau scrie-ne direct.",
    };
  }

  // Randul din baza este sursa de adevar. Esecul emailului nu invalideaza cererea.
  await notify({ name, company, email, phone, message, sourcePage, supplierName, supplierEmail });

  return { status: "success" };
}

async function notify(lead: {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  sourcePage: string;
  supplierName: string;
  supplierEmail: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL;
  const admin = process.env.ADMIN_EMAIL;
  if (!apiKey || !from) {
    console.warn("[supplyhub] Resend neconfigurat; lead salvat, fara notificare.");
    return;
  }

  const resend = new Resend(apiKey);
  const body = [
    `Distribuitor: ${lead.supplierName || "—"}`,
    `Nume: ${lead.name}`,
    `Firmă: ${lead.company || "—"}`,
    `Email: ${lead.email}`,
    `Telefon: ${lead.phone || "—"}`,
    `Pagina: ${lead.sourcePage || "—"}`,
    "",
    lead.message,
  ].join("\n");

  const jobs: Promise<unknown>[] = [];

  if (admin) {
    jobs.push(
      resend.emails.send({
        from,
        to: admin,
        replyTo: lead.email,
        subject: `Cerere de ofertă: ${lead.supplierName || "SupplyHub"}`,
        text: body,
      }),
    );
  }

  if (lead.supplierEmail) {
    jobs.push(
      resend.emails.send({
        from,
        to: lead.supplierEmail,
        replyTo: lead.email,
        subject: `Cerere de ofertă prin SupplyHub — ${lead.name}`,
        text:
          `Ai primit o cerere de ofertă prin SupplyHub. Răspunde direct la acest email ` +
          `pentru a ajunge la solicitant.\n\n${body}`,
      }),
    );
  }

  const results = await Promise.allSettled(jobs);
  for (const r of results) {
    if (r.status === "rejected") console.error("[supplyhub] Resend:", r.reason);
  }
}
