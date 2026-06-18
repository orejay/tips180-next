import Image from "next/image";

/**
 * Split-card frame for the auth pages (form on the left, illustration on the
 * right) — the legacy `Auth` wrapper, as a Server Component.
 */
export function AuthShell({
  image,
  children,
}: {
  image: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-4xl overflow-hidden rounded-lg bg-surface shadow-sm">
      <div className="w-full p-8 lg:w-1/2 lg:p-10">{children}</div>
      <div className="hidden items-center justify-center bg-surface-muted p-8 lg:flex lg:w-1/2">
        <Image
          src={image}
          alt=""
          width={420}
          height={420}
          className="h-auto w-full max-w-sm"
        />
      </div>
    </div>
  );
}
