import { getAnnouncement } from "@/lib/home";
import { DismissibleBanner } from "@/components/marketing/dismissible-banner";

/** Site announcement bar (legacy AnnouncementBanner). Server-fetched, fail-soft. */
export async function AnnouncementBanner() {
  const announcement = await getAnnouncement();
  if (!announcement) return null;
  return <DismissibleBanner caption={announcement.caption} body={announcement.body} />;
}
