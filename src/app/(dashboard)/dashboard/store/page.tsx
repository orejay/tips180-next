import type { Metadata } from "next";
import Link from "next/link";
import { storeCategories } from "@/config/store-categories";

export const metadata: Metadata = { title: "My Store" };

export default function StorePage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">My Store</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {storeCategories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="flex items-center justify-center rounded-lg border border-border px-3 py-6 text-center text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-linear-to-r hover:from-brand-start hover:to-brand-end hover:text-white"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
