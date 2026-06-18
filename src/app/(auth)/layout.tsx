import type { Metadata } from "next";

/**
 * Layout for authentication routes (login, signup, password reset). Noindex for
 * the whole group — these are private/transactional pages with no SEO value.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 items-center justify-center bg-background px-4 py-12">
      {children}
    </main>
  );
}
