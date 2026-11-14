# CLAUDE.md

For detailed agent guidelines, see [AGENTS.md](AGENTS.md).

## Code Patterns

- **Translations:** Use `useTranslations()` or `getTranslations()` from next-intl; never hardcode user-facing text
- **Styling:** Tailwind CSS with `cn()` utility for conditional classes
- **Database:** Prisma client from `@/lib/db`

## Before Committing

1. Run `npm run lint` to check for issues
2. Add translations for any user-facing text
3. Use existing UI components from `src/components/ui/`
4. Never commit secrets (use `.env`)
