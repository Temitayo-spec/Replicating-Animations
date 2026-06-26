import Link from "next/link";
import { animations } from "@/lib/animations";

const REPO = "Temitayo-spec/Replicating-Animations";
const REPO_URL = `https://github.com/${REPO}`;

async function getRepoStats(): Promise<{
  stars: number;
  forks: number;
} | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { stars: data.stargazers_count ?? 0, forks: data.forks_count ?? 0 };
  } catch {
    return null;
  }
}

export default async function Home() {
  const stats = await getRepoStats();

  return (
    <main className="min-h-screen bg-[#edede7] text-neutral-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10 md:px-10 md:py-14">
        <div className="flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500">
          <span>Replicating Animations</span>
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="hidden sm:inline">by @Temitayo-spec</span>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View this project on GitHub"
              className="group inline-flex items-center gap-3 transition-colors hover:text-neutral-900"
            >
              <GitHubMark />
              {stats && (
                <>
                  <span className="inline-flex items-center gap-1.5 tabular-nums">
                    <StarIcon />
                    {stats.stars}
                  </span>
                  <span className="inline-flex items-center gap-1.5 tabular-nums">
                    <ForkIcon />
                    {stats.forks}
                  </span>
                </>
              )}
            </a>
          </div>
        </div>

        <header className="mt-20 md:mt-28">
          <h1 className="max-w-4xl font-['PP_Neue_Montreal'] text-5xl font-medium leading-[0.95] tracking-[-0.02em] md:text-7xl lg:text-[5.5rem]">
            A field guide to web animation.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-600 md:text-lg">
            A growing study collection of award-winning interaction patterns —
            deconstructed and rebuilt from scratch with Next.js, GSAP, Framer
            Motion and Tailwind. Open any one, then hit{" "}
            <span className="text-neutral-900">View source</span> to copy the
            code into your own project.
          </p>
        </header>

        <section className="mt-16 md:mt-24">
          <div className="mb-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500">
            <span>Index</span>
            <span>{animations.length} animations</span>
          </div>
          <ul className="border-t border-neutral-300">
            {animations.map((a, i) => (
              <li key={a.slug}>
                <Link
                  href={`/${a.slug}`}
                  className="group flex items-center gap-4 border-b border-neutral-300 py-5 transition-colors hover:bg-black/3 md:gap-8 md:py-6"
                >
                  <span className="font-mono text-xs text-neutral-400 md:text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-['PP_Neue_Montreal'] text-2xl font-medium tracking-[-0.01em] md:text-3xl">
                      {a.title}
                    </span>
                    <span className="mt-1 block max-w-xl text-sm text-neutral-500">
                      {a.blurb}
                    </span>
                  </span>
                  <span className="hidden shrink-0 font-mono text-[11px] uppercase tracking-[0.15em] text-neutral-400 md:block">
                    {a.stack}
                  </span>
                  <span
                    aria-hidden
                    className="shrink-0 text-lg text-neutral-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-neutral-900"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <footer className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-16 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400">
          <span>Built with Next.js · Tailwind · GSAP · Framer Motion</span>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 transition-colors hover:text-neutral-900"
          >
            <GitHubMark />
            View on GitHub
          </a>
        </footer>
      </div>
    </main>
  );
}

const GitHubMark = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const StarIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.401 8.168L12 18.896l-7.335 3.868 1.401-8.168L.132 9.211l8.2-1.193z" />
  </svg>
);

const ForkIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
  </svg>
);
