"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { initialLeadState, submitLead } from "@/app/actions/lead";

const field =
  "mt-1.5 w-full border border-rule bg-white px-3 py-2.5 text-[0.95rem] focus:border-accent focus:outline-none";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-accent px-6 py-3 font-medium text-white hover:bg-ink disabled:opacity-60"
    >
      {pending ? "Se trimite…" : "Trimite cererea"}
    </button>
  );
}

export function LeadForm({
  supplierId,
  supplierName,
  supplierEmail,
  sourcePage,
}: {
  supplierId: number;
  supplierName: string;
  supplierEmail: string | null;
  sourcePage: string;
}) {
  const [state, action] = useActionState(submitLead, initialLeadState);

  if (state.status === "success") {
    return (
      <div className="border border-accent bg-accent-soft p-6">
        <h3 className="font-semibold">Cererea a plecat către {supplierName}.</h3>
        <p className="mt-2 text-[0.95rem] text-muted">
          Distribuitorul primește datele tale de contact și îți răspunde direct pe email. Dacă vrei
          să compari mai multe oferte, trimite cererea și altor distribuitori din aceeași categorie.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="supplier_id" value={supplierId} />
      <input type="hidden" name="supplier_name" value={supplierName} />
      <input type="hidden" name="supplier_email" value={supplierEmail ?? ""} />
      <input type="hidden" name="source_page" value={sourcePage} />

      {/* Honeypot: ascuns pentru oameni, completat de boti. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website_url">Nu completa acest câmp</label>
        <input id="website_url" name="website_url" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="border-l-2 border-accent bg-accent-soft px-4 py-3 text-[0.95rem]">
          {state.message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Nume și prenume
          </label>
          <input id="name" name="name" required autoComplete="name" className={field} />
          {state.errors?.name && <p className="mt-1 text-sm text-accent">{state.errors.name}</p>}
        </div>
        <div>
          <label htmlFor="company" className="text-sm font-medium">
            Firmă <span className="text-muted">(opțional)</span>
          </label>
          <input id="company" name="company" autoComplete="organization" className={field} />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className={field} />
          {state.errors?.email && <p className="mt-1 text-sm text-accent">{state.errors.email}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium">
            Telefon <span className="text-muted">(opțional)</span>
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={field} />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium">
          Ce echipamente cauți
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Tip de echipament, cantitate, termen de livrare, județul în care se montează."
          className={field}
        />
        {state.errors?.message && <p className="mt-1 text-sm text-accent">{state.errors.message}</p>}
      </div>

      <div>
        <label htmlFor="consent" className="flex items-start gap-3 text-sm">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            className="mt-1 size-4 shrink-0 accent-accent"
          />
          <span>
            Sunt de acord ca datele mele de contact să fie transmise acestui distribuitor, ca să
            primesc o ofertă. Detalii în{" "}
            <a href="/politica-de-confidentialitate" className="text-accent underline underline-offset-2">
              politica de confidențialitate
            </a>
            .
          </span>
        </label>
        {state.errors?.consent && <p className="mt-1 text-sm text-accent">{state.errors.consent}</p>}
      </div>

      <SubmitButton />
    </form>
  );
}
