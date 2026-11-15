"use client";

import Link from "next/link";
import { Flame } from "lucide-react";
import { PromptAuthor } from "@/components/prompts/prompt-author";
import { RunPromptButton } from "@/components/prompts/run-prompt-button";
import { UpvoteCount } from "@/components/prompts/upvote-count";
import { renderContentWithVariables } from "@/components/prompts/variable-fill-modal";
import { CopySwapIcon, promptHref, useCopy, type VariantCardProps } from "../shared";

/** One-line preview: show each variable as its default value (or name) instead of raw ${...} syntax. */
function plainPreview(content: string) {
  return content.replace(/\$\{([^:}]+)(?::([^}]*))?\}/g, (_, name: string, def?: string) => (def ?? "").trim() || name.trim());
}

/**
 * Compact — axis: density.
 * Three tight rows, one-line prompt preview. The full prompt peeks out below on hover or keyboard focus.
 */
export function CompactCard({ prompt }: VariantCardProps) {
  const { copied, copy } = useCopy(prompt.content);

  return (
    <article className="pc-co relative rounded-[var(--radius)] border bg-background px-3 py-2.5 transition-colors duration-150 ease-out hover:border-foreground/20">
      <div className="flex items-center gap-2">
        <Link
          href={promptHref(prompt)}
          prefetch={false}
          className="min-w-0 flex-1 truncate text-sm font-medium hover:underline"
        >
          {prompt.title}
        </Link>
        {prompt.trending && (
          <Flame
            className="h-3 w-3 shrink-0 fill-current text-orange-600 dark:text-orange-400"
            aria-label="Trending"
          />
        )}
        <UpvoteCount count={prompt.voteCount} className="text-[11px] text-muted-foreground" />
      </div>

      <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground">{plainPreview(prompt.content)}</p>

      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <div className="flex min-w-0 items-center gap-1.5">
          <PromptAuthor author={prompt.author} />
          <span aria-hidden="true">·</span>
          <span className="truncate">{prompt.category}</span>
        </div>
        <div className="-me-1 flex shrink-0 items-center">
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? "Copied" : `Copy prompt: ${prompt.title}`}
            className="pc-press flex h-6 w-6 items-center justify-center rounded text-foreground outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
          >
            <CopySwapIcon copied={copied} className="h-3 w-3" />
          </button>
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
      </div>

      {/* Peek: the full prompt, overlapping the cards below. pt-1 bridges the gap so hover isn't lost. */}
      <div className="pc-co-peek absolute -inset-x-px top-full z-10 pt-1">
        <div className="rounded-[var(--radius)] border bg-popover p-3 text-popover-foreground shadow-lg">
          <p className="text-xs text-muted-foreground">{prompt.description}</p>
          <p className="mt-2 whitespace-pre-wrap break-words rounded bg-muted p-2 font-mono text-xs leading-relaxed text-foreground/85 line-clamp-[8]">
            {renderContentWithVariables(prompt.content)}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {prompt.tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                prefetch={false}
                tabIndex={-1}
                className="rounded px-1.5 py-0.5 text-[10px] transition-opacity duration-150 ease-out hover:opacity-80"
                style={{ backgroundColor: tag.color + "15", color: tag.color }}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
