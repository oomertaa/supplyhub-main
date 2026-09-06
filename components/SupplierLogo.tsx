import Image from "next/image";

/** Logo cu spatiu rezervat fix, deci fara deplasare de continut la incarcare. */
export function SupplierLogo({
  name,
  src,
  size = 56,
}: {
  name: string;
  src: string | null;
  size?: number;
}) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="relative shrink-0 overflow-hidden border border-rule bg-white"
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          src={src}
          alt={`Logo ${name}`}
          fill
          sizes={`${size}px`}
          className="object-contain p-1.5"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center bg-accent-soft font-semibold text-accent"
          style={{ fontSize: size * 0.32 }}
        >
          {initials}
        </span>
      )}
    </div>
  );
}
