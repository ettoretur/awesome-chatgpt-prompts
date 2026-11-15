import type { Metadata } from "next";
import { PromptCardPrototype } from "./harness";

// Prototype surface: isolated from production code. Nothing outside this folder imports from it.
export const metadata: Metadata = {
  title: "Prototype: prompt card",
  robots: { index: false, follow: false },
};

export default async function PromptCardPrototypePage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const { v } = await searchParams;
  const requested = parseInt(v ?? "", 10);
  return <PromptCardPrototype initial={Number.isNaN(requested) ? 0 : requested - 1} />;
}
