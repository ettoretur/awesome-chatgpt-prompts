"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ComponentType } from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Masonry } from "@/components/ui/masonry";
import { protoPrompts } from "./data";
import type { VariantCardProps } from "./shared";
import { PromptFirstCard } from "./variants/prompt-first";
import { EditorialCard } from "./variants/editorial";
import { CompactCard } from "./variants/compact";
import "./picker.css";
import "./variants.css";

interface Variant {
  name: string;
  Card: ComponentType<VariantCardProps>;
  gap: number;
  gridClassName?: string;
}

const variants: Variant[] = [
  { name: "Prompt-first", Card: PromptFirstCard, gap: 16 },
  { name: "Editorial", Card: EditorialCard, gap: 32 },
  { name: "Compact", Card: CompactCard, gap: 8, gridClassName: "pc-compact-grid" },
];

export function PromptCardPrototype({ initial }: { initial: number }) {
  const [current, setCurrent] = useState(initial >= 0 && initial < variants.length ? initial : 0);
  const [mountKey, setMountKey] = useState(0);
  const pickerRef = useRef<HTMLElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const select = useCallback((i: number) => {
    if (i < 0 || i >= variants.length) return;
    setCurrent(i);
    setMountKey((k) => k + 1);
    const url = new URL(window.location.href);
    url.searchParams.set("v", String(i + 1));
    window.history.replaceState(null, "", url);
  }, []);

  const moveHighlight = useCallback(() => {
    const el = itemRefs.current[current];
    const highlight = highlightRef.current;
    if (!el || !highlight) return;
    highlight.style.width = `${el.offsetWidth}px`;
    highlight.style.transform = `translateX(${el.offsetLeft}px)`;
  }, [current]);

  useLayoutEffect(() => {
    moveHighlight();
    window.addEventListener("resize", moveHighlight);
    return () => window.removeEventListener("resize", moveHighlight);
  }, [moveHighlight]);

  // Enable the highlight slide only after first paint, so load doesn't animate.
  useEffect(() => {
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => pickerRef.current?.setAttribute("data-ready", ""));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= variants.length) select(num - 1);
      else if (e.key === "ArrowRight") select((current + 1) % variants.length);
      else if (e.key === "ArrowLeft") select((current - 1 + variants.length) % variants.length);
      else if (e.key === "r" || e.key === "R") setMountKey((k) => k + 1);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [current, select]);

  const { Card, gap, gridClassName } = variants[current];

  return (
    <>
      {/* Realistic context: the homepage "Featured Prompts" section, same container and masonry grid. */}
      <section className="border-b py-12 pb-28">
        <div className="container">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              <h2 className="text-xl font-semibold">Featured Prompts</h2>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/prompts" prefetch={false}>
                Browse all
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Masonry
            key={`${current}-${mountKey}`}
            columnCount={{ default: 1, md: 2, lg: 3 }}
            gap={gap}
            className={gridClassName}
          >
            {protoPrompts.map((prompt) => (
              <Card key={prompt.id} prompt={prompt} />
            ))}
          </Masonry>
        </div>
      </section>

      <nav ref={pickerRef} className="proto-picker" aria-label="Prototype variants">
        <span ref={highlightRef} className="proto-picker-highlight" aria-hidden="true" />
        {variants.map((variant, i) => (
          <button
            key={variant.name}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            type="button"
            className="proto-picker-item"
            data-active={i === current ? "" : undefined}
            aria-current={i === current ? "true" : undefined}
            onClick={() => select(i)}
          >
            {variant.name}
          </button>
        ))}
      </nav>
    </>
  );
}
