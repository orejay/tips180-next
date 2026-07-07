import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { footerNav, type NavLink, type SocialLink } from "@/config/nav";

/**
 * Site footer for the public marketing pages. Pure Server Component — all links
 * render in the initial HTML for crawlers. Auth/interactivity lives in the header.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-stone-200 bg-stone-100 text-foreground dark:border-transparent dark:bg-black dark:text-white">
      {/* Brand accent hairline */}
      <div className="h-1 w-full bg-linear-to-r from-brand-start to-brand-end" />

      <div className="mx-auto w-full max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand + socials */}
          <div className="lg:col-span-2">
            <Image
              src="/images/tip-logo.png"
              alt="Tips180 logo"
              width={3494}
              height={894}
              className="h-8 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted dark:text-white/55">
              Expert football predictions and winning betting tips, delivered daily
              to keep your slips green.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {footerNav.social.map((social) => (
                <SocialIcon key={social.name} social={social} />
              ))}
            </div>
          </div>

          <FooterColumn title="Football Predictions">
            <LinkList links={footerNav.predictions} />
          </FooterColumn>

          <FooterColumn title="Helpful Links">
            <LinkList links={footerNav.helpful} />
          </FooterColumn>

          <FooterColumn title="Get in Touch">
            <ul className="space-y-2.5 text-sm">
              {footerNav.contact.emails.map((email) => (
                <li key={email}>
                  <a href={`mailto:${email}`} className="text-muted transition-colors hover:text-foreground dark:text-white/55 dark:hover:text-white">
                    {email}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`tel:${footerNav.contact.phone.tel}`}
                  className="font-semibold text-foreground transition-colors hover:text-primary dark:text-white dark:hover:text-brand-start"
                >
                  {footerNav.contact.phone.display}
                </a>
              </li>
            </ul>
          </FooterColumn>
        </div>

        {/* Trust / compliance band */}
        <div className="mt-10 flex flex-col items-center gap-5 rounded-2xl bg-white p-6 ring-1 ring-stone-200 dark:bg-white/3 dark:ring-white/8">
          <p className="text-xs font-semibold uppercase tracking-wide text-subtle dark:text-white/45">Payment Methods</p>
          <Image
            src="/images/paymentmethods.webp"
            alt="Tips180 accepted payment methods"
            width={1650}
            height={140}
            className="h-auto w-full max-w-2xl"
          />
          <Image
            src="/images/gamerslogos.png"
            alt="Responsible gaming partners"
            width={1914}
            height={130}
            className="h-auto w-full max-w-3xl opacity-90"
          />
          <p className="text-center text-xs text-subtle dark:text-white/45">
            Content on tips180.com is not intended for anybody under 18 years of age
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-200 dark:border-white/8">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-sm text-muted dark:text-white/55 sm:flex-row">
          <p>© {year} Tips180. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="transition-colors hover:text-foreground dark:hover:text-white">
              Privacy Policy
            </Link>
            <span className="text-stone-300 dark:text-white/20">|</span>
            <Link href="/disclaimer" className="transition-colors hover:text-foreground dark:hover:text-white">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-foreground dark:text-white/90">{title}</h3>
      {children}
    </div>
  );
}

function LinkList({ links }: { links: readonly NavLink[] }) {
  return (
    <ul className="space-y-2.5 text-sm">
      {links.map((link) => (
        <li key={link.name}>
          <Link
            href={link.href}
            className="group inline-flex items-center gap-1 text-muted transition-colors hover:text-foreground dark:text-white/55 dark:hover:text-white"
          >
            <ChevronRight
              size={13}
              className="-ml-1 shrink-0 text-brand-start opacity-0 transition-all group-hover:ml-0 group-hover:opacity-100"
            />
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function SocialIcon({ social }: { social: SocialLink }) {
  return (
    <a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={social.name}
      title={social.name}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white ring-1 ring-stone-200 transition-all hover:-translate-y-0.5 hover:bg-stone-50 dark:bg-white/8 dark:ring-white/10 dark:hover:bg-white/15"
    >
      <Image src={social.icon} alt="" width={18} height={18} className="h-4.5 w-4.5 object-contain" />
    </a>
  );
}
