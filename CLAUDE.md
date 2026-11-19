# Peku landing page — handoff (updated Nov 2, 2026)

Peku (renamed Bao → Goodo on Oct 22, 2026, then Goodo → Peku on Nov 2, 2026; entity plan: Hurstville Labs, Inc. d/b/a Peku) is a WhatsApp restaurant picker for San Francisco. This repo is its pre-launch waitlist page.
Audience: tech workers, remote workers, and VCs/investors overwhelmed by TikTok/Instagram food content. Keep dating out of the copy (planned for v2).

## Where things live
- **Live site:** https://www.heypeku.com (primary since Nov 17, 2026; heypeku.com, getgoodo.com and www.getgoodo.com all 308-redirect to it, keeping the path). heypeku.com is registered and DNS-hosted at Cloudflare: CNAME @ and www → `f85631c6c3720fb8.vercel-dns-017.com`, both "DNS only" (proxy off), plus Google Workspace MX/SPF/DKIM, plus A/AAAA `admin` → the bot's Fly IPs (66.241.124.221 / 2a09:8280:1::1b4:8baa:0, DNS only) so the bot's admin dashboard is at https://admin.heypeku.com/admin/dashboard (Fly cert on `mimi-sf-bot`, added Nov 19, 2026; mimi-sf-bot.fly.dev still works). `vercel.json` redirects heypeku.com/admin there; it also proxies `/i/*` (friends' invite links and their preview card) to the bot, which builds those links on www.heypeku.com when its `INVITE_BASE_URL` secret is set; the bot redirects `/` and `/admin` to `/admin/dashboard`. getgoodo.com DNS is at Squarespace (A @ 216.198.79.1, CNAME www → Vercel). Also bao-beryl.vercel.app; Vercel project `bao` under "Aolin's projects", deploys `main` on push. GitHub Pages (aolinxuu.github.io/bao) can't run `api/`; turn it off.
- **Code:** `index.html` is the page (a `<style>` block plus a small script for the join dialog). `api/join.js` is the one Vercel Function.
- **Signup:** "Join the waitlist" asks only for a WhatsApp number; "Have a code?" adds an access-code field. Every signup goes to the bot's waitlist (`POST https://mimi-sf-bot.fly.dev/waitlist`, `app/web/waitlist.py` in the bot repo `aolinxuu/mimi`), whose admission queue lets waitlist people in first. With a code, the reply is a link to the chosen channel with "My code is <code>" typed in; the bot checks the code (a friend's code skips the line, a wrong one leaves them waiting), so the site doesn't. Without a code, the success screen has a "Say hi on <channel>" button with "Hi!" typed in: the bot can only let in and message people who have messaged it, so the form alone never reaches them. The iMessage/WhatsApp/SMS chips pick the channel (sent to the bot as `channel`); every other CTA means iMessage. iMessage and SMS links are `sms:+18584627637?&body=…` (Sendblue line, `TEXT_NUMBER`), WhatsApp is `wa.me/16283016836`.
  - The forward carries `Authorization: Bearer $WAITLIST_FORWARD_KEY` (same value as the Fly secret) and the visitor's IP in `X-Client-IP`, so the bot's per-IP limits count visitors. The bot's 422 shows "Check your phone number", its 429 "Too many tries". If the bot is unreachable the signup still succeeds and the error is in the Vercel logs.
  - Copy in Upstash Redis `upstash-kv-cobalt-cable` (free plan) via the Vercel Marketplace (`KV_REST_API_URL/TOKEN`): hash `signup:<phone digits>` = {phone, sms, code (if given), at (first join)}; sorted set `signups` by first join time. Older entries also have `status`.
  - Env vars: `WAITLIST_FORWARD_KEY`, `BOT_WAITLIST_URL` (optional; defaults to the Fly URL), `WHATSAPP_NUMBER=16283016836` (digits only; was `BAO_WHATSAPP`; Twilio number still registered on WhatsApp as "Bao" (rename after the SF fictitious business name filing + Meta Business verification), phone number ID 1389678297560424; the old Meta test number was 15556733257). `INVITE_CODE` and the Redis set `invite_codes` are no longer read.
- **Images:** mascot (bird) PNGs in `img/peku/` (wave, think, cookie, jump, ready), from the canvas. The dish cutouts in `img/dishes/` are no longer used.
- **Design source of truth:** Design canvas "Peku landing page (v5.3 Y2K)" — https://claude.ai/artifact/7w4sQLenWkbdcpLtHqdfLz (`Main.dc.html`, one fluid 1440-wide page). Older: v5 https://claude.ai/artifact/KYn3pqreexA8oZsGiKS8hF, floating dishes https://claude.ai/artifact/KESaMLiFukqjvWwEXQynWL.
  - The user edits the canvas by hand: always re-read `project/canvas.json` and the artboard before publishing. Change canvas and `index.html` together.
  - Live copy differs from the canvas on purpose: placeholders filled (group-chat spot Golden Bowl is made up, cities = SF only, hello@heypeku.com, no Instagram/TikTok), A/B defaults used: headline "The spot for the night that matters.", glossy CTA, chat animation on.

## Current design (Nov 17, 2026, v5.3 Y2K scrolling page)
- Yellow hero ("waitlist only" badge, glossy orange CTA, Peku waving beside an orange flip phone whose screen replays a short text thread; sparkles), occasions strip, how it works (3 cards), group chat "coming soon", FAQ, blue footer. Fonts Fredoka (wordmark), Rubik, Silkscreen (phone screen). The chat loop is a small script; reduced motion shows it static.
- Every CTA ("text Peku", "Text Peku", the iMessage/WhatsApp/SMS chips, "get early access") opens the waitlist dialog; the chips set the channel, the rest default to iMessage; "have a code?" opens it with the code field. Closing the dialog after a signup resets it to the form.
- Colors are CSS variables on `:root`; light only (no dark override).
- User preference: simpler and fewer words every round; apply requests directly; lead with the answer, short, bullets.

## Brand (Nov 2, 2026)
- Personality: cheeky, food-obsessed, trustworthy; voice = cheeky friend ("Ok you're getting the pork belly bao at Mama's. Trust. Table for 2 at 7?"). Jokes in the wording, never in the pick.
- Mascot: a bird (Peku pecks / peckish / peko peko). Real food photos stay; only the mascot and hand-drawn marks are illustrated.
- Launch scope: recs + table booking; delivery later. Never: influencer hype, corporate tech, fine-dining snob.

## Open items
0. Rename leftovers kept on purpose: Vercel project/URL `bao-beryl`, repo `aolinxuu/bao`, WhatsApp display name, domain getgoodo.com (now a redirect). All pages now show @heypeku.com emails (hello@, privacy@, support@): these are aliases of aolin@heypeku.com in the heypeku.com Google Workspace (added Nov 17, 2026).
1. Turn off GitHub Pages. (Custom domain getgoodo.com added Oct 23, 2026.)
2. 中文/EN toggle removed Oct 23, 2026 (US audience).
3. Contact email filled: hello@ (footer, questions), privacy@ (data deletion), support@ (SMS HELP). Still placeholders: `[LEGAL NAME]`, `[ADDRESS]` (fill after incorporation).
5. Strategy: WhatsApp vs iMessage/SMS for a US audience.

## Deploy notes
- In a cloud session: `add_repo aolinxuu/bao` with push access, commit, `git push origin main`.
- The container `gh` token is invalid; do GitHub settings through the user's Chrome.
