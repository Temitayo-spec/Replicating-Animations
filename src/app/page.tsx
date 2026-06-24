import Link from 'next/link';
import { animations } from '@/lib/animations';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#edede7] text-neutral-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10 md:px-10 md:py-14">
        {/* Top bar */}
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500">
          <span>Replicating Animations</span>
          <span>by @Temitayo-spec</span>
        </div>

        {/* Hero */}
        <header className="mt-20 md:mt-28">
          <h1 className="max-w-4xl font-['PP_Neue_Montreal'] text-5xl font-medium leading-[0.95] tracking-[-0.02em] md:text-7xl lg:text-[5.5rem]">
            A field guide to web animation.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-600 md:text-lg">
            A growing study collection of award-winning interaction patterns —
            deconstructed and rebuilt from scratch with Next.js, GSAP, Framer
            Motion and Tailwind. Open any one, then hit{' '}
            <span className="text-neutral-900">View source</span> to copy the
            code into your own project.
          </p>
        </header>

        {/* Index */}
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
                    {String(i + 1).padStart(2, '0')}
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

        {/* Footer */}
        <footer className="mt-auto pt-16 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400">
          Built with Next.js · Tailwind · GSAP · Framer Motion
        </footer>
      </div>
    </main>
  );
}
