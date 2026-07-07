import type { Metadata } from "next";
import { authFetch } from "@/lib/api-auth";
import { MessagesView, type Message } from "@/components/dashboard/messages-view";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage() {
  const data = await authFetch<{ read: Message[]; unread: Message[] }>(
    "messages",
  );
  const read = data?.read ?? [];
  const unread = data?.unread ?? [];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Messages</h1>
      <MessagesView read={read} unread={unread} />
    </div>
  );
}
