# A7 summary

## Task 3: legal pages (done Oct 15, 2026)

New: `privacy.html`, `terms.html`, `sms-terms.html`. Changed: the `index.html` footer.

### Fill in these placeholders before A2P 10DLC registration
Carriers check that the business name and address appear on the site.

| Placeholder | Where |
|---|---|
| `[LEGAL NAME]` | privacy.html (body + footer), terms.html (body + footer), sms-terms.html (body + footer) |
| `[ADDRESS]` | privacy.html (body + footer), terms.html (body + footer), sms-terms.html (footer) |
| `[CONTACT EMAIL]` | all 4 pages: shown text and `mailto:` href |

Find them all: `grep -n '\[LEGAL NAME\]\|\[ADDRESS\]\|\[CONTACT EMAIL\]' *.html`

### Visible changes (mirror on the canvas)
1. **Landing footer** (desktop and phone): `© 2026 Bao · Privacy · Terms · SMS terms · [CONTACT EMAIL]`.
   - Privacy and Terms now link to real pages.
   - **SMS terms** is a new link.
   - `hello@[domain]` is replaced by a `[CONTACT EMAIL]` mailto link.
   - On phone, the email wraps to a second line.
2. **Three new legal pages**, all with the same layout:
   - Nav: the bao logo and wordmark only (links home, no 中文/EN toggle).
   - A centered 680px text column: Shantell Sans 800 h1 (42px; 34px on phone), "Last updated" line in muted gray, Shantell Sans 22px section headings, Figtree 17px body in `--sub`.
   - Footer: the landing footer plus `[LEGAL NAME] · [ADDRESS]`.
   - Same color variables and dark mode as the landing page. These pages scroll.

Nothing else on the landing page changed. The hero, "Get early access" (still `#`, task 2) and the inert 中文/EN toggle are as they were.

### Checks
- Landing page has no scroll at 1280×800, 1440×900 and 375×812 (`scrollHeight == innerHeight`), and no horizontal overflow on phone.
- Every link between the pages returns 200.
- Screenshots are in `shots/a7-legal/`: `index-1280x800.jpg`, `index-375x812.jpg`, `privacy-375x812.jpg`, `sms-terms-1280x800-dark.jpg`.

### Open issues: the pages promise things the bot doesn't do yet
- **`delete` keyword**: privacy.html says "Text delete to Bao". The bot repo has no handler for it (A5 `app/handle.py`). It should run `DELETE FROM users WHERE id=$1` (cascades) and also remove the matching waitlist row.
- **STOP / HELP**: sms-terms.html promises a single STOP confirmation and a HELP reply. Neither exists yet (A4/A5, and the A8 SMS provider may handle them).
- **7-day pin coarsening**: stated on privacy.html. The `coarsen` job kind exists in `app/contracts.py`, but its delay still has to be confirmed against A4/A5 code.
- **30-day deletion window** and **"deleted if Bao doesn't launch"**: these are new commitments. Change them if they're wrong.
- **SMS provider**: privacy.html says "our iMessage/SMS provider". Name it once A8 picks one.
- **Canvas**: the brief names the `Handdrawn.dc.html` artboard, but `CLAUDE.md` says the current one is `Handdrawn-v2.dc.html` (plus the phone and dark variants).
- Not legal advice. Have someone review the pages before relying on them.
