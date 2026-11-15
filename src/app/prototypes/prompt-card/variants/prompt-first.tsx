"use client";

import Link from "next/link";
import { Flame, Link2 } from "lucide-react";
import { PromptAuthor } from "@/components/prompts/prompt-author";
import { RunPromptButton } from "@/components/prompts/run-prompt-button";
import { UpvoteCount } from "@/components/prompts/upvote-count";
import { renderContentWithVariables } from "@/components/prompts/variable-fill-modal";
import { CopySwapIcon, promptHref, useCopy, type VariantCardProps } from "../shared";

/**
 * Prompt-first — axis: hierarchy + interaction.
 * The prompt text is the card. The title shrinks to a tab; the whole body is the copy target.
 */
export function PromptFirstCard({ prompt }: VariantCardProps) {
  const { copied, copy } = useCopy(prompt.content);

  return (
    <article className="group flex flex-col overflow-hidden rounded-[var(--radius)] border transition-colors duration-150 ease-out hover:border-foreground/20">
      <header className="flex h-9 items-center justify-between gap-2 border-b bg-muted/40 px-3">
        <Link
          href={promptHref(prompt)}
          prefetch={false}
          className="min-w-0 truncate text-xs font-medium hover:underline"
        >
          {prompt.title}
        </Link>
        <div className="flex shrink-0 items-center gap-2 text-[10px] text-muted-foreground">
          {prompt.flowSteps ? (
            <span className="flex items-center gap-0.5" title={`Starts a ${prompt.flowSteps}-step flow`}>
              <Link2 className="h-3 w-3" />
              {prompt.flowSteps}
            </span>
          ) : null}
          {prompt.trending && (
            <span className="flex items-center gap-0.5 text-orange-600 dark:text-orange-400">
              <Flame className="h-3 w-3 fill-current" />
              Trending
            </span>
          )}
          <span className="uppercase tracking-wider">{prompt.category}</span>
        </div>
      </header>

      <button
        type="button"
        onClick={copy}
        aria-label={`Copy prompt: ${prompt.title}`}
        className="pc-pf-body relative block w-full cursor-copy px-3 pb-9 pt-3 text-start outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <span className="pc-pf-text block whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-foreground/85 line-clamp-6">
          {renderContentWithVariables(prompt.content)}
        </span>
        <span
          className="pc-pf-hint absolute bottom-2 end-2 flex h-6 items-center gap-1.5 rounded-md border bg-background px-2 text-[11px] font-medium text-foreground shadow-sm"
          data-copied={copied ? "" : undefined}
        >
          <CopySwapIcon copied={copied} className="h-3 w-3" />
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </span>
      </button>

      <footer className="flex h-9 items-center justify-between border-t px-3 text-[11px] text-muted-foreground">
        <PromptAuthor author={prompt.author} />
        <div className="flex items-center gap-2">
          <UpvoteCount count={prompt.voteCount} />
          <RunPromptButton
            content={prompt.content}
            title={prompt.title}
            description={prompt.description}
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            categoryName={prompt.category}
            promptType={prompt.type}
          />
        </div>
      </footer>
    </article>
  );
}
