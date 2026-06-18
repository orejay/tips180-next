import Image from "next/image";
import Link from "next/link";
import { footerNav, type NavLink, type SocialLink } from "@/config/nav";

/**
 * Site footer for the public marketing pages. Pure Server Component — all links
 * render in the initial HTML for crawlers. Auth/interactivity lives in the header.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-linear-to-r from-brand-start to-brand-end px-4 py-8 text-white lg:px-0">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-2 sm:grid-cols-2 lg:grid-cols-4">
        <FooterColumn title="Football Predictions">
          <LinkList links={footerNav.predictions} />
        </FooterColumn>

        <FooterColumn title="Helpful Links">
          <LinkList links={footerNav.helpful} />
        </FooterColumn>

        <FooterColumn title="Stay Connected">
          <ul className="space-y-2">
            {footerNav.social.map((social) => (
              <li key={social.name}>
                <SocialItem social={social} />
              </li>
            ))}
          </ul>
        </FooterColumn>

        <FooterColumn title="Get in Touch">
          <ul className="space-y-2 text-sm font-normal">
            {footerNav.contact.emails.map((email) => (
              <li key={email}>
                <a href={`mailto:${email}`} className="hover:underline">
                  {email}
                </a>
              </li>
            ))}
            <li>
              <a href={`tel:${footerNav.contact.phone.tel}`} className="hover:underline">
                {footerNav.contact.phone.display}
              </a>
            </li>
          </ul>
        </FooterColumn>
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-7xl flex-col items-center gap-4 px-2">
        <p className="text-sm">Payment Methods</p>
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
          className="h-auto w-full max-w-3xl"
        />
        <p className="text-center text-sm">
          Content on tips180.com is not intended for anybody under 18yrs of age
        </p>
      </div>

      <div className="mx-auto mt-6 flex w-full max-w-7xl items-center gap-3 px-2">
        <Image
          src="/images/tip-logo.png"
          alt="Tips180 logo"
          width={3494}
          height={894}
          className="h-7 w-auto"
        />
        <p className="text-sm">
          © {year}. <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
          {" | "}
          <Link href="/disclaimer" className="hover:underline">Disclaimer</Link>
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-base font-semibold lg:text-lg">{title}</h3>
      {children}
    </div>
  );
}

function LinkList({ links }: { links: readonly NavLink[] }) {
  return (
    <ul className="space-y-2 text-sm font-normal">
      {links.map((link) => (
        <li key={link.name} className="flex items-center gap-2">
          <Bullet />
          <Link href={link.href} className="hover:underline">
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function SocialItem({ social }: { social: SocialLink }) {
  return (
    <a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 text-sm font-normal hover:underline"
    >
      <Image src={social.icon} alt="" width={24} height={24} className="h-6 w-6 object-contain" />
      {social.name}
    </a>
  );
}

function Bullet() {
  return (
    <svg width="6" height="6" viewBox="0 0 10 10" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="5" cy="5" r="5" fill="white" />
    </svg>
  );
}
