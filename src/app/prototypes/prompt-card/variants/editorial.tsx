"use client";

import Link from "next/link";
import { Flame } from "lucide-react";
import { PromptAuthor } from "@/components/prompts/prompt-author";
import { RunPromptButton } from "@/components/prompts/run-prompt-button";
import { UpvoteCount } from "@/components/prompts/upvote-count";
import { renderContentWithVariables } from "@/components/prompts/variable-fill-modal";
import { CopySwapIcon, promptHref, useCopy, type VariantCardProps } from "../shared";

/**
 * Editorial — axis: typography + personality.
 * No box. A rule, a kicker, a serif headline, the prompt as a pull-quote. Reads like a table of contents.
 */
export function EditorialCard({ prompt }: VariantCardProps) {
  const { copied, copy } = useCopy(prompt.content);

  return (
    <article className="pc-ed flex flex-col border-t border-foreground/70 pb-2 pt-4">
      <div className="mb-3 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        <span>{prompt.category}</span>
        {prompt.trending && (
          <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
            <Flame className="h-3 w-3 fill-current" />
            Trending
          </span>
        )}
      </div>

      <h3 className="font-display text-[1.6rem] font-medium leading-[1.12] tracking-tight text-balance">
        <Link
          href={promptHref(prompt)}
          prefetch={false}
          className="pc-ed-title rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {prompt.title}
        </Link>
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{prompt.description}</p>

      <blockquote className="mt-4 border-s-2 border-foreground/15 ps-3 font-mono text-xs leading-relaxed text-foreground/70 line-clamp-3">
        {renderContentWithVariables(prompt.content)}
      </blockquote>

      <footer className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex min-w-0 items-center gap-3">
          <PromptAuthor author={prompt.author} />
          <UpvoteCount count={prompt.voteCount} />
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={copy}
            className="pc-press flex h-7 items-center gap-1.5 rounded-md px-2 font-medium text-foreground outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
          >
            <CopySwapIcon copied={copied} className="h-3 w-3" />
            <span aria-live="polite">{copied ? "Copied" : "Copy prompt"}</span>
          </button>
          <RunPromptButton
            content={prompt.content}
            title={prompt.title}
            description={prompt.description}
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            categoryName={prompt.category}
            promptType={prompt.type}
          />
        </div>
      </footer>
    </article>
  );
}
