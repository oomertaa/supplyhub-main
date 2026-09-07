import { IconShieldCheck } from "./Icons";

/** Marcajul „verificat”: date de contact confirmate de redactie. */
export function VerifiedBadge({ withLabel = true }: { withLabel?: boolean }) {
  return (
    <span
      className="chip chip-accent"
      title="Date de contact verificate de echipa SupplyHub"
    >
      <IconShieldCheck className="size-3.5" />
      {withLabel ? "Verificat" : null}
    </span>
  );
}
