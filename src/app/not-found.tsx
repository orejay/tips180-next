import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center bg-background px-6 py-20">
      <div className="flex flex-col items-center text-center">
        <p className="bg-linear-to-r from-brand-start to-brand-end bg-clip-text text-6xl font-black text-transparent">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold text-foreground">Page not found</h1>
        <p className="mt-2 max-w-md text-muted">
          This page wasn&apos;t found or has been removed. We suggest heading back
          to the homepage.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-md bg-linear-to-r from-brand-start to-brand-end px-6 py-2.5 font-medium text-white transition-opacity hover:opacity-90"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
