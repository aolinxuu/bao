# Peku landing page — handoff (updated Nov 2, 2026)

Peku (renamed Bao → Goodo on Oct 22, 2026, then Goodo → Peku on Nov 2, 2026; entity plan: Hurstville Labs, Inc. d/b/a Peku) is a WhatsApp restaurant picker for San Francisco. This repo is its pre-launch waitlist page.
Audience: tech workers, remote workers, and VCs/investors overwhelmed by TikTok/Instagram food content. Keep dating out of the copy (planned for v2).

## Where things live
- **Live site:** https://getgoodo.com (primary; www.getgoodo.com 308-redirects to it; DNS at Squarespace via Google Workspace: A @ 216.198.79.1, CNAME www → Vercel; also bao-beryl.vercel.app; Vercel project `bao` under "Aolin's projects", deploys `main` on push). GitHub Pages (aolinxuu.github.io/bao) can't run `api/`; turn it off.
- **Code:** `index.html` is the page (a `<style>` block plus a small script for the join dialog). `api/join.js` is the one Vercel Function.
- **Signup:** "Join the waitlist" asks only for a WhatsApp number; "Have a code?" adds an access-code field. A valid code returns a `wa.me` link to Peku; no code puts them on the waitlist; a wrong code shows "That code didn't work."
  - Valid codes: env `INVITE_CODE` (1020) or any member of the Redis set `invite_codes` (friend referrals; add with `SADD invite_codes <code>`).
  - Storage: Upstash Redis `upstash-kv-cobalt-cable` (free plan) via the Vercel Marketplace (`KV_REST_API_URL/TOKEN`). Hash `signup:<phone digits>` = {phone, sms, status, code (invited only), at (first join)}; sorted set `signups` by first join time. Both are written in one `multi()`; status only moves forward (a later join without a code never undoes an invite).
  - Env vars: `INVITE_CODE=1020`, `BAO_WHATSAPP=16283016836` (digits only; Twilio number still registered on WhatsApp as "Bao" (rename after the SF fictitious business name filing + Meta Business verification), phone number ID 1389678297560424; the old Meta test number was 15556733257).
- **Images:** floating dish cutouts are in `img/dishes/<dish>.webp` (16 files; the older `img/dish-1..3.webp` are unused).
- **Design source of truth:** Design canvas "Peku landing page" (was "Bao"/"Goodo landing page") — https://claude.ai/artifact/KESaMLiFukqjvWwEXQynWL
  - `Floating.dc.html` — Desktop, floating dishes (matches live)
  - `Phone-floating.dc.html` — Phone, floating dishes (matches live at ≤600px)
  - The `Handdrawn-v2*` and `Phone-v2*` boards are the previous live design.
  - The user edits the canvas by hand: always re-read `project/canvas.json` and the artboard before publishing. Change canvas and `index.html` together.
  - Dish positions in `index.html` are CSS variables per image: `--l/--t/--w` (desktop, % of viewport) and `--ml/--mt/--mw` (phone). Images without phone values carry class `dsk` and hide on phone.

## Current design (Oct 20, 2026, Corner-style)
- One screen, no scroll, on desktop (1280×800, 1440×900) and phone (390×844; short phones scroll a little).
- Centered: big black "peku" wordmark in Shantell Sans 800 (static, no shadow; SVG viewBox 620×250, width clamp(300px,46vw,600px), phone min(300px,77vw)), line "Skip the scroll. Peku picks where to eat in SF, and what to order.", black pill "Join the waitlist", link "Have a code?". Nav also has a "Join the waitlist" pill on desktop.
- Around it: 16 dish cutouts (12 on phone) floating gently, off for reduced motion. None may overlap the text.
- Invite-only framing: no "5 invites" copy on the page; invites get explained after signup.
- Colors are CSS variables on `:root` with a dark override; SVGs use `currentColor`.
- User preference: simpler and fewer words every round; apply requests directly; lead with the answer, short, bullets.

## Brand (Nov 2, 2026)
- Personality: cheeky, food-obsessed, trustworthy; voice = cheeky friend ("Ok you're getting the pork belly bao at Mama's. Trust. Table for 2 at 7?"). Jokes in the wording, never in the pick.
- Mascot: a bird (Peku pecks / peckish / peko peko). Real food photos stay; only the mascot and hand-drawn marks are illustrated.
- Launch scope: recs + table booking; delivery later. Never: influencer hype, corporate tech, fine-dining snob.

## Open items
0. Rename leftovers kept on purpose: Vercel project/URL `bao-beryl`, repo `aolinxuu/bao`, env var `BAO_WHATSAPP`, WhatsApp display name, domain getgoodo.com and its emails (until a Peku domain exists), nav logo is still the bao-bun icon (to be replaced by the bird mascot).
1. Turn off GitHub Pages. (Custom domain getgoodo.com added Oct 23, 2026.)
2. 中文/EN toggle removed Oct 23, 2026 (US audience).
3. Contact email filled: hello@ (footer, questions), privacy@ (data deletion), support@ (SMS HELP). Still placeholders: `[LEGAL NAME]`, `[ADDRESS]` (fill after incorporation).
5. Strategy: WhatsApp vs iMessage/SMS for a US audience.

## Deploy notes
- In a cloud session: `add_repo aolinxuu/bao` with push access, commit, `git push origin main`.
- The container `gh` token is invalid; do GitHub settings through the user's Chrome.
