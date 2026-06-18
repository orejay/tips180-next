import { getNews } from "@/lib/home";

/** Sport News strip (legacy SportsNews). External image URLs → plain <img>. */
export async function SportsNews() {
  const news = await getNews();
  if (news.length === 0) return null;

  return (
    <section className="bg-surface py-14">
      <div className="mx-auto mb-6 flex w-10/12 items-end justify-between">
        <h2 className="text-xl font-bold text-foreground md:text-2xl lg:text-3xl">Sport News</h2>
        <a
          href="https://www.tips180.com/blog/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-linear-to-r from-brand-start to-brand-end bg-clip-text text-sm font-bold text-transparent underline lg:text-base"
        >
          More News
        </a>
      </div>
      <div className="mx-auto w-10/12 overflow-x-auto">
        <div className="flex w-max gap-4">
          {news.map((item) => (
            <article key={item.id} className="flex w-[300px] shrink-0 flex-col">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image_link}
                alt={item.caption}
                className="mb-2 h-44 w-full rounded-md object-cover"
                loading="lazy"
              />
              <div className="flex items-start justify-between gap-2 py-1">
                <p className="text-sm font-medium text-foreground">{item.caption}</p>
                <span className="shrink-0 rounded bg-blue-50 dark:bg-primary-soft px-2 py-1 text-xs font-semibold text-primary">
                  {item.date}
                </span>
              </div>
              <a
                href={item.news_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block w-fit rounded bg-linear-to-r from-brand-start to-brand-end px-4 py-2 text-xs font-medium text-white lg:text-sm"
              >
                Read More
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
