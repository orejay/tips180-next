import { ArrowUpRight, Newspaper } from "lucide-react";
import { getNews } from "@/lib/home";

/** Sport News strip (legacy SportsNews). External image URLs → plain <img>. */
export async function SportsNews() {
  const news = await getNews();
  if (news.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-teal-500 to-blue-600 text-white shadow-sm">
            <Newspaper size={17} />
          </span>
          <div>
            <h2 className="text-xl font-bold text-foreground md:text-2xl">Sport News</h2>
            <p className="text-xs text-subtle">Latest headlines from the world of football</p>
          </div>
        </div>
        <a
          href="https://www.tips180.com/blog/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-blue-700"
        >
          More News
          <ArrowUpRight size={15} />
        </a>
      </div>

      {/* Horizontal snap rail on small screens, comfortable grid on large. */}
      <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0">
        {news.map((item) => (
          <a
            key={item.id}
            href={item.news_link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-72 shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md lg:w-auto dark:border-white/8 dark:bg-[#18181b]"
          >
            <div className="relative h-44 w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image_link}
                alt={item.caption}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/50 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                {item.date}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <p className="line-clamp-3 text-sm font-semibold leading-snug text-foreground">
                {item.caption}
              </p>
              <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold text-primary transition-colors group-hover:text-blue-700">
                Read More
                <ArrowUpRight size={15} />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
