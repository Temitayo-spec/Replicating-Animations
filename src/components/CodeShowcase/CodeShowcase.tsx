"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Highlight, themes, type Language } from "prism-react-renderer";

type SourceFile = {
  /** Label shown on the tab / header, e.g. "Gallery.tsx". */
  filename: string;
  /** The source code to display and copy. */
  code: string;
  /** Prism language for highlighting. */
  language?: string;
};

type CodeShowcaseProps = {
  /** One entry per file the demo needs (component + any local imports). */
  files?: SourceFile[];
  /** Convenience for a single self-contained file (alternative to `files`). */
  code?: string;
  filename?: string;
  language?: Language;
  /** The live animation/demo this code produces. */
  children: ReactNode;
};

/**
 * Wraps any animation demo and exposes its source in a light, editorial
 * side-sheet with a one-click copy button. The demo stays fully visible while
 * the sheet is open. Pass every file the demo needs via `files` (tabs appear
 * when there's more than one), or a single `code` string for self-contained
 * demos:
 *   <CodeShowcase files={[main, helper]}><Demo /></CodeShowcase>
 *   <CodeShowcase code={src}><Demo /></CodeShowcase>
 */
const CodeShowcase = ({
  files,
  code,
  filename = "Component.tsx",
  language = "tsx",
  children,
}: CodeShowcaseProps) => {
  const sources: SourceFile[] =
    files && files.length > 0
      ? files
      : [{ filename, code: code ?? "", language }];

  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  const current = sources[Math.min(active, sources.length - 1)];
  const source = current.code.trim();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Jump back to the top of the code when switching files.
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [active]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be unavailable (insecure context / denied permission).
      setCopied(false);
    }
  };

  return (
    <div className="relative">
      {children}

      {/* Trigger — minimal outlined pill, matches the site's editorial type */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[9998] inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-xs font-medium uppercase tracking-[0.08em] text-white shadow-lg transition hover:bg-neutral-700"
      >
        <CodeGlyph />
        View source
      </button>

      {/* Transparent click-catcher — closes on outside click, keeps demo
          visible, and swallows scroll so the page behind can't move */}
      <div
        onClick={() => setOpen(false)}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className={`fixed inset-0 z-[10010] ${open ? "" : "pointer-events-none"}`}
        aria-hidden="true"
      />

      {/* Right side sheet — stop wheel/touch from reaching the page's own
          scroll/wheel handlers (e.g. sliders that advance on wheel) */}
      <aside
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className={`fixed right-0 top-0 z-[10020] flex h-screen w-[min(92vw,560px)] flex-col border-l border-black/10 bg-[#f7f6f1] shadow-[-8px_0_40px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label={`Source code for ${current.filename}`}
        aria-hidden={!open}
      >
        {/* Header */}
        <header className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-3">
          {sources.length > 1 ? (
            <div className="-mx-1 flex min-w-0 flex-1 items-center gap-1 overflow-x-auto px-1">
              {sources.map((f, i) => (
                <button
                  key={f.filename}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`whitespace-nowrap rounded-md px-2.5 py-1 font-mono text-[12px] transition ${
                    i === active
                      ? "bg-black/[0.07] text-black/80"
                      : "text-black/40 hover:text-black/70"
                  }`}
                >
                  {f.filename}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-black/50">
              <CodeGlyph />
              <span className="font-mono text-[13px] text-black/70">
                {current.filename}
              </span>
            </div>
          )}
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={copy}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-neutral-900 text-white hover:bg-neutral-700"
              }`}
            >
              {copied ? (
                <>
                  <CheckIcon />
                  Copied
                </>
              ) : (
                <>
                  <CopyIcon />
                  Copy
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1.5 text-black/40 transition hover:bg-black/5 hover:text-black/70"
              aria-label="Close source panel"
            >
              <CloseIcon />
            </button>
          </div>
        </header>

        {/* Code body */}
        <div
          ref={bodyRef}
          className="flex-1 overflow-auto overscroll-contain bg-white"
        >
          <Highlight
            code={source}
            language={(current.language ?? "tsx") as Language}
            theme={themes.github}
          >
            {({ className, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={`${className} px-5 py-4 font-mono text-[12.5px] leading-[1.7]`}
                style={{ background: "transparent" }}
              >
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })} className="table-row">
                    <span className="table-cell select-none pr-5 text-right text-black/25 tabular-nums">
                      {i + 1}
                    </span>
                    <span className="table-cell">
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </span>
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
      </aside>
    </div>
  );
};

const CodeGlyph = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const CopyIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default CodeShowcase;
