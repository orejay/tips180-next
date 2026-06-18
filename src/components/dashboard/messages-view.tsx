"use client";

import { useState, useTransition } from "react";
import { siteConfig } from "@/config/site";
import { markMessageReadAction } from "@/app/(dashboard)/dashboard/actions";
import { cn } from "@/lib/utils";

export type Message = {
  id: number;
  title: string;
  message: string;
  date_created: string;
  image_url?: string;
};

export function MessagesView({
  read,
  unread,
}: {
  read: Message[];
  unread: Message[];
}) {
  const [tab, setTab] = useState<0 | 1>(0);
  const [active, setActive] = useState<Message | null>(null);
  const [, startTransition] = useTransition();

  const list = tab === 0 ? unread : read;

  function open(msg: Message) {
    setActive(msg);
    if (tab === 0) startTransition(() => markMessageReadAction(msg.id));
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      {/* Folder tabs */}
      <div className="flex gap-2 lg:w-3/12 lg:flex-col">
        <FolderButton active={tab === 0} onClick={() => { setTab(0); setActive(null); }}>
          Unread ({unread.length})
        </FolderButton>
        <FolderButton active={tab === 1} onClick={() => { setTab(1); setActive(null); }}>
          Read ({read.length})
        </FolderButton>
      </div>

      {/* List / detail */}
      <div className="lg:w-9/12">
        {active ? (
          <article>
            <button
              type="button"
              onClick={() => setActive(null)}
              className="mb-4 text-sm text-primary hover:underline"
            >
              ← Back to messages
            </button>
            <h2 className="mb-4 text-lg font-bold text-foreground">{active.title}</h2>
            {active.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${siteConfig.apiUrl}${active.image_url}`}
                alt=""
                className="mb-4 w-full max-w-xl rounded-lg"
              />
            )}
            <div className="space-y-2 text-muted">
              {active.message.split("~").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </article>
        ) : (
          <div>
            <h2 className="mb-2 px-1 text-lg font-semibold text-foreground">
              {tab === 0 ? "Unread Messages" : "Read Messages"}
            </h2>
            {list.length === 0 ? (
              <p className="border-t border-border p-3 text-muted">No messages here.</p>
            ) : (
              <ul className="divide-y divide-stone-100">
                {list.map((msg) => (
                  <li key={msg.id}>
                    <button
                      type="button"
                      onClick={() => open(msg)}
                      className="flex w-full items-center justify-between gap-3 px-1 py-3 text-left hover:bg-surface-muted"
                    >
                      <span className="font-medium text-foreground">{msg.title}</span>
                      <span className="shrink-0 text-xs text-subtle">
                        {new Date(msg.date_created).toLocaleDateString()}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FolderButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 rounded-md px-3 py-2 text-sm font-semibold shadow-sm transition-colors lg:flex-none",
        active
          ? "bg-linear-to-r from-brand-start to-brand-end text-white"
          : "bg-surface text-muted hover:bg-surface-muted",
      )}
    >
      {children}
    </button>
  );
}
