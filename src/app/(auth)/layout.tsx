/**
 * Layout for authentication routes (login, signup, password reset).
 * These pages are noindex by convention — see per-page metadata.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
