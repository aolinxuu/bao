# Goodo landing page — handoff (updated Oct 23, 2026)

Goodo (renamed from Bao on Oct 22, 2026; entity plan: Hurstville Labs, Inc. d/b/a Goodo) is a WhatsApp restaurant picker for San Francisco. This repo is its pre-launch waitlist page.
Audience: tech workers, remote workers, and VCs/investors overwhelmed by TikTok/Instagram food content. Keep dating out of the copy (planned for v2).

## Where things live
- **Live site:** https://getgoodo.com (primary; www.getgoodo.com 308-redirects to it; DNS at Squarespace via Google Workspace: A @ 216.198.79.1, CNAME www → Vercel; also bao-beryl.vercel.app; Vercel project `bao` under "Aolin's projects", deploys `main` on push). GitHub Pages (aolinxuu.github.io/bao) can't run `api/`; turn it off.
- **Code:** `index.html` is the page (a `<style>` block plus a small script for the join dialog). `api/join.js` is the one Vercel Function.
- **Signup:** "Join the waitlist" asks only for a WhatsApp number; "Have a code?" adds an access-code field. A valid code returns a `wa.me` link to Goodo; no code puts them on the waitlist; a wrong code shows "That code didn't work."
  - Valid codes: env `INVITE_CODE` (1020) or any member of the Redis set `invite_codes` (friend referrals; add with `SADD invite_codes <code>`).
  - Storage: Upstash Redis `upstash-kv-cobalt-cable` (free plan) via the Vercel Marketplace (`KV_REST_API_URL/TOKEN`). Hash `signup:<phone digits>` = {phone, code, status, at}; sorted set `signups` by join time.
  - Env vars: `INVITE_CODE=1020`, `BAO_WHATSAPP=16283016836` (digits only; Twilio number still registered on WhatsApp as "Bao" (rename after the SF fictitious business name filing + Meta Business verification), phone number ID 1389678297560424; the old Meta test number was 15556733257).
- **Images:** floating dish cutouts are in `img/dishes/<dish>.webp` (16 files; the older `img/dish-1..3.webp` are unused).
- **Design source of truth:** Design canvas "Goodo landing page" (was "Bao landing page") — https://claude.ai/artifact/KESaMLiFukqjvWwEXQynWL
  - `Floating.dc.html` — Desktop, floating dishes (matches live)
  - `Phone-floating.dc.html` — Phone, floating dishes (matches live at ≤600px)
  - The `Handdrawn-v2*` and `Phone-v2*` boards are the previous live design.
  - The user edits the canvas by hand: always re-read `project/canvas.json` and the artboard before publishing. Change canvas and `index.html` together.
  - Dish positions in `index.html` are CSS variables per image: `--l/--t/--w` (desktop, % of viewport) and `--ml/--mt/--mw` (phone). Images without phone values carry class `dsk` and hide on phone.

## Current design (Oct 20, 2026, Corner-style)
- One screen, no scroll, on desktop (1280×800, 1440×900) and phone (390×844; short phones scroll a little).
- Centered: big black "goodo" wordmark in Shantell Sans 800 (static, no shadow; SVG viewBox 760×250, width clamp(300px,44vw,580px), phone min(330px,86vw)), line "Skip the scroll. Goodo picks where to eat in SF, and what to order.", black pill "Join the waitlist", link "Have a code?". Nav also has a "Join the waitlist" pill on desktop.
- Around it: 16 dish cutouts (12 on phone) floating gently, off for reduced motion. None may overlap the text.
- Invite-only framing: no "5 invites" copy on the page; invites get explained after signup.
- Colors are CSS variables on `:root` with a dark override; SVGs use `currentColor`.
- User preference: simpler and fewer words every round; apply requests directly; lead with the answer, short, bullets.

## Open items
0. Rename leftovers kept on purpose: Vercel project/URL `bao-beryl`, repo `aolinxuu/bao`, env var `BAO_WHATSAPP`, WhatsApp display name. Planned domain: getgoodo.com.
1. Turn off GitHub Pages. (Custom domain getgoodo.com added Oct 23, 2026.)
2. 中文/EN toggle is inert (or drop it — audience is now US tech workers).
3. Contact email filled: hello@ (footer, questions), privacy@ (data deletion), support@ (SMS HELP). Still placeholders: `[LEGAL NAME]`, `[ADDRESS]` (fill after incorporation).
5. Strategy: WhatsApp vs iMessage/SMS for a US audience.

## Deploy notes
- In a cloud session: `add_repo aolinxuu/bao` with push access, commit, `git push origin main`.
- The container `gh` token is invalid; do GitHub settings through the user's Chrome.
