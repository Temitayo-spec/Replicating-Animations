"use client";
import { useEffect, useState, type ReactNode } from "react";
import { Highlight, themes, type Language } from "prism-react-renderer";

type CodeShowcaseProps = {
  /** The source code to display and copy. */
  code: string;
  /** Filename shown in the panel header, e.g. "Slider.tsx". */
  filename?: string;
  /** Prism language for highlighting. */
  language?: Language;
  /** The live animation/demo this code produces. */
  children: ReactNode;
};

/**
 * Wraps any animation demo and exposes its source in a light, editorial
 * side-sheet with a one-click copy button. The demo stays fully visible while
 * the sheet is open. Drop it around any showcase page:
 *   <CodeShowcase code={src}><Demo /></CodeShowcase>
 */
const CodeShowcase = ({
  code,
  filename = "Component.tsx",
  language = "tsx",
  children,
}: CodeShowcaseProps) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const source = code.trim();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

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

      {/* Transparent click-catcher — closes on outside click, keeps demo visible */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[10010] ${open ? "" : "pointer-events-none"}`}
        aria-hidden="true"
      />

      {/* Right side sheet */}
      <aside
        className={`fixed right-0 top-0 z-[10020] flex h-screen w-[min(92vw,560px)] flex-col border-l border-black/10 bg-[#f7f6f1] shadow-[-8px_0_40px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label={`Source code for ${filename}`}
        aria-hidden={!open}
      >
        {/* Header */}
        <header className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
          <div className="flex items-center gap-2 text-black/50">
            <CodeGlyph />
            <span className="font-mono text-[13px] text-black/70">
              {filename}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
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
        <div className="flex-1 overflow-auto bg-white">
          <Highlight code={source} language={language} theme={themes.github}>
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
