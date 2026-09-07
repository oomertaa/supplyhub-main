"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { initialLeadState, submitLead } from "@/app/actions/lead";
import { IconCheck } from "./Icons";

function FieldError({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-sm font-medium text-danger">{children}</p>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary w-full sm:w-auto">
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
      <div className="flex gap-4 rounded-tile border border-accent-line bg-accent-soft p-5">
        <span className="grid size-9 shrink-0 place-items-center rounded-pill bg-accent text-white">
          <IconCheck className="size-5" />
        </span>
        <div>
          <h3 className="font-bold text-ink">Cererea a plecat către {supplierName}.</h3>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
            Distribuitorul primește datele tale de contact și îți răspunde direct pe email. Dacă
            vrei să compari mai multe oferte, trimite cererea și altor distribuitori din aceeași
            categorie.
          </p>
        </div>
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
        <p
          role="alert"
          className="rounded-tile border border-danger-line bg-danger-soft px-4 py-3 text-[0.9375rem] text-danger"
        >
          {state.message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="field-label">
            Nume și prenume
          </label>
          <input id="name" name="name" required autoComplete="name" className="field" />
          {state.errors?.name && <FieldError>{state.errors.name}</FieldError>}
        </div>
        <div>
          <label htmlFor="company" className="field-label">
            Firmă <span className="font-normal text-muted">(opțional)</span>
          </label>
          <input id="company" name="company" autoComplete="organization" className="field" />
        </div>
        <div>
          <label htmlFor="email" className="field-label">
            Email
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className="field" />
          {state.errors?.email && <FieldError>{state.errors.email}</FieldError>}
        </div>
        <div>
          <label htmlFor="phone" className="field-label">
            Telefon <span className="font-normal text-muted">(opțional)</span>
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className="field" />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="field-label">
          Ce echipamente cauți
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Tip de echipament, cantitate, termen de livrare, județul în care se montează."
          className="field"
        />
        {state.errors?.message && <FieldError>{state.errors.message}</FieldError>}
      </div>

      <div className="rounded-tile border border-line-soft bg-canvas p-4">
        <label htmlFor="consent" className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-soft">
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
            <a
              href="/politica-de-confidentialitate"
              className="font-medium text-accent underline underline-offset-2"
            >
              politica de confidențialitate
            </a>
            .
          </span>
        </label>
        {state.errors?.consent && <FieldError>{state.errors.consent}</FieldError>}
      </div>

      <SubmitButton />
    </form>
  );
}
