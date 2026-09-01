# 0001. The English edition uses a persuasion-first voice that diverges from the Thai brand voice

Date: 2026-09-01
Status: superseded by 0002

## Context

The Thai site's voice is a hard rule: warm, honest, plain business Thai, no hype, no technical vocabulary. An English edition was added for a different buyer — foreign owners in/around Thailand and remote international clients — who are colder traffic, compare against a global market, and respond to explicit persuasion (clear offers, objection handling, direct CTAs). Applying the Thai voice rules verbatim would handicap the English pitch; applying wolf-style English rules to Thai would break an established brand.

## Decision

We will give each language edition its own voice. English: full wolf tone — direct, persuasive, grade-5 reading level, technical specifics allowed when they build trust, value argued through APAC-economics framing (relative only, never price figures, never "cheap"). Thai: unchanged. Audits judge each edition against its own rules.

## Alternatives considered

- **Thai rules applied verbatim to English** — safest for consistency, but mutes the pitch to buyers who expect substance and directness.
- **Wolf structure with the warm Thai tone** — keeps one voice, but the user explicitly chose full divergence for conversion.
- **Wolf tone on offer pages only** — visible seams between page tones; harder to keep consistent.

## Consequences

Easier: English copy can sell hard to its actual audience; the APAC-economics argument becomes usable. Harder: two voices to maintain, and PRODUCT.md / docs/site-spec.md need an English carve-out so audits don't flag the divergence as a violation. Shared hard rules still bind both editions: no price figures, no emoji, no invented facts. Reversal cost: rewrite the English copy in the Thai voice — no structural work, copy only.
