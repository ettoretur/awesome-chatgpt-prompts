"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProtoPrompt } from "./data";

export interface VariantCardProps {
  prompt: ProtoPrompt;
}

/** Copies text and exposes a short-lived `copied` flag for inline feedback. */
export function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard can be unavailable (insecure context, denied permission); still acknowledge the press.
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  }, [text]);

  return { copied, copy };
}

/** Copy icon that cross-fades into a check while `copied` is true. */
export function CopySwapIcon({ copied, className }: { copied: boolean; className?: string }) {
  return (
    <span className="pc-swap" data-copied={copied ? "" : undefined} aria-hidden="true">
      <Copy data-icon="idle" className={cn("h-3.5 w-3.5", className)} />
      <Check data-icon="done" className={cn("h-3.5 w-3.5", className)} />
    </span>
  );
}

export function promptHref(prompt: ProtoPrompt) {
  return `/prompts/${prompt.id}_${prompt.slug}`;
}
