---
name: email-updates
description: >
  Fetch and process the content-update emails forwarded by Vékony Lajos
  (vekonylajos@gmail.com) into the Jánkmajtis site — news items, testületi ülés
  rows, hirdetmények — with a staged, approval-gated flow that ends in R2 upload
  and FTP deploy. Use when the user says "fetch emails", "fetch mails from
  vekonylajos", "process the updates", "publish the incoming content", or invokes
  /email-updates. Handles auth on the vekonydoktor personal Gmail, reads scanned
  PDFs visually, dedupes against what's already live, and never publishes without
  explicit approval.
---

# Email-driven site updates

End-to-end workflow for turning forwarded office emails into published site
changes. Read `CLAUDE.md` (repo root) for the underlying conventions — this skill
orchestrates them in a fixed order and adds the approval gates.

**Hard rule:** never perform an external write (R2 upload, FTP deploy, git push)
until the user explicitly approves that step. Local edits/commits are fine to
prepare; publishing is not.

## Step 1 — Verify the personal mailbox is reachable

Content mail lands in **`vekonydoktor@gmail.com`**. **Always use that account.
Never use the `vekony@lovelysystems.com` work account for this workflow.**

Probe reachability with a cheap search (try the default client, then the
`personal` client):

```bash
gog -a vekonydoktor@gmail.com gmail search "from:vekonylajos@gmail.com" --max 1 -p
# if that errors with invalid_grant / expired / revoked:
gog -a vekonydoktor@gmail.com --client personal gmail search "from:vekonylajos@gmail.com" --max 1 -p
```

- A header row or `No results` → reachable, continue.
- Both fail with `invalid_grant` / `Token has been expired or revoked` → **stop and
  prompt the user.** This session cannot run the browser OAuth flow.

Re-auth with `gog auth add` (**not** `auth login` — that's an alias for
`auth manage`, a localhost accounts-manager page). Limit to Gmail: the default
requests ~45 scopes, which makes Google's "Verify it's you" check stricter. Run it
in the background (it waits for the OAuth callback on localhost), suppressing
auto-open:

```bash
(BROWSER=echo gog auth add vekonydoktor@gmail.com --client personal --services gmail \
  > sandbox/claude/gog_auth.log 2>&1 &); sleep 4
```

Then open the printed Google URL in **Brave** (logged into the personal Gmail; not
the default browser — never change the default):

```bash
open -a "Brave Browser" "$(grep -o 'https://accounts.google.com[^ ]*' sandbox/claude/gog_auth.log)"
```

Also give the user the URL, then wait. Do **not** ask for tokens or callback URLs.
Once they confirm, re-run the probe before continuing.

Tokens expiring after ~7 days means the OAuth app is in **Testing** publishing
status; switching it to **In production** (no verification needed) removes that
limit.

## Step 2 — Fetch the latest mails, focus on undone work

```bash
gog -a vekonydoktor@gmail.com gmail search "from:vekonylajos@gmail.com" --max 20 -p
```

- `UNREAD` + `INBOX` are the likely-new items; read mails are usually already
  processed. Confirm against the last processed date (recent git log / the top
  news entry).
- **Focus only on tasks not yet done.** Before treating an item as new, dedupe:
  compare attachment byte-sizes and check whether the target already exists (see
  Step 5's live checks). A re-send of an already-published meeting is common —
  skip it.

Fetch each candidate (get/attachment also default to the wrong account — always
pass `-a vekonydoktor@gmail.com`):

```bash
gog -a vekonydoktor@gmail.com gmail get <messageId> -j     # body + attachments[] with attachmentId
gog -a vekonydoktor@gmail.com gmail attachment <messageId> <attachmentId> --out <path>
```

Stage downloads under `sandbox/claude/emails_<YYMMDD>/<messageId>/`.

## Step 3 — Figure out what each item actually needs

- **Scanned PDFs have no text layer** (Konica copier). Render and read visually:
  `pdftoppm -png -r 110 -f 1 -l 1 in.pdf out` → Read the PNG. The letterhead tells
  you Jánkmajtis vs Darnó when the filename doesn't.
- **`.docx`** — unzip and read `word/document.xml`; images live in `word/media/`.
- **Rotation:** many scans are landscape with sideways content. Fix losslessly with
  pypdf in `sandbox/claude/venv/`; `p.rotate(90)` = clockwise. **Verify direction
  by re-rendering** — sibling PDFs in one mail can be rotated opposite ways.
- Determine for each item: is it a **news** item or a **testületi** row? What title,
  date, body, and document label? Any duration note ("15 napra", "visszavonásig")?
- **Display window:** does the mail ask for the item to appear only from a later date
  (e.g. "2026.10.16.-tól") or to come down at some point ("15 napra", "...napjáig")?
  That becomes a `visible()` window (Step 5). If it's ambiguous whether a date range
  is the display period or just the document's own content (e.g. an auction's bidding
  period), ask the user.

## Step 4 — Plan and get approval

Print a compact summary table: item → type → target file → planned R2 path →
title/date → display window (visible from / until, or "—"). List anything skipped as a duplicate and why. **Wait for the user's
approval before editing.**

## Step 5 — Make the changes (local, with **local links** for preview)

Conventions (see `CLAUDE.md` for the full folder↔prefix map):

- **News** → new `<div class="new">` blocks at the top of the Aktualitások list in
  `index.php`, newest first. **News dates: use today unless the user says otherwise.**
  Inline images use `box-shadow: 2px 2px 5px #000000` to match the other news images.
- **Testületi ülés** → rows in `testuleti_<YEAR>.php` (newest first, Meghívó before
  Jegyzőkönyv). ⚠️ Hand-edit the row; never blindly rerun the generator (it wipes rows
  from the gitignored `docs/` tree).
- **Editing accented lines:** anchor Edits on ASCII portions (the filename in the
  href); NFC/NFD mismatches make accented `old_string`s silently fail.
- **Scheduled news (`visible()`)** — `index.php` includes `schedule.php`, which provides
  `visible($from, $until)` (Budapest local time, `'YYYY-MM-DD HH:MM'`, either may be
  `null`). Wrap a time-boxed news block:
  ```php
  <?php if (visible('2026-10-16 08:00', '2026-12-15 12:00')): ?>
  <div class="new">…</div>
  <?php endif; ?>
  ```
  - Future start → default **08:00** on the start day unless the mail says otherwise;
    the news date (`newDate`) is the **start day**, not today. Place it at the top of
    the list like any new item.
  - End → from the duration note. The last day is always shown in full: "…napjáig",
    "15 napra" or a closing date (even with a time in the document, e.g. bidding until
    12:00) → `until` = **00:00 of the following day**.
  - Expired blocks stay in the source; removing them is a separate cleanup job.
- `php -l <file>` after each edit.

**Link every newly-added document at a LOCAL relative path first**, so the user can
click through in the local preview (the R2 URLs 404 until upload). The relative path
**mirrors the eventual R2 subtree**, and you copy the file there locally:

- News PDFs/images → `./news/<today YYMMDD>/<file>` (copy into local `news/<YYMMDD>/`).
- Testületi PDFs → `./docs/testuleti_ulesek/<folder>/<file>` (copy into that local dir).

`news/` and `docs/` are gitignored, so the copied files never enter the repo — only
the working-tree href points local for now. **Do not commit yet** — the links still
need to become R2 URLs after acceptance (Step 7).

## Step 6 — Hand off for local review

**Start the preview server yourself** — don't ask the user to run it. Run
`php -S 127.0.0.1:8765` from repo root in the background (skip if already
listening), check the changed page returns 200, then give the user the direct URL
(e.g. `http://127.0.0.1:8765/index.php`). The document links resolve against the
local `news/`/`docs/` copies. Tell the user what changed and wait for approval.

The `php -S` preview **ignores `visible()` start times** (end times still apply), so
scheduled items show exactly as they will look once live — no temporary date edits.
Tell the user which items are scheduled and their window. To check the production
behaviour, render with the plain CLI: `php index.php | grep -c <new-filename>` (0 before
the start time).

## Step 7 — Roll out (only after approval)

0. **Stop the preview server** you started in Step 6 as soon as the preview is
   accepted (kill the background `php -S 127.0.0.1:8765` task). Also stop it if the
   session ends or the user abandons the change — never leave it running.

   **Swap local links → R2 URLs, then commit.** Once the preview is accepted, rewrite
   every local href added in Step 5 to its absolute
   `https://files.jankmajtis.hu/<subtree>/...` form (news → `.../news/<YYMMDD>/...`;
   testületi → `.../testuleti_ulesek/<folder>/...`). `php -l` again, then **commit per
   meaningful task** (news entries that arrived together → one commit; a testületi
   update is its own commit). Short one-line Hungarian message, end with the
   `Co-Authored-By` trailer. Do **not** push yet.

   **Check scheduled windows before committing:** `grep -n "visible(" index.php` — every
   new block from Step 4 must carry the planned start/end exactly (future start, not
   today), and the CLI render (`php index.php | grep -c <new-filename>`) must give 0 for
   items whose start is still ahead.

1. **R2 upload** (bucket `docs`, keys mirror the URL subtree; creds in `.env`):
   ```bash
   set -a && . ./.env && set +a
   aws s3 cp <local> s3://docs/<key> --endpoint-url "$AWS_ENDPOINT_URL" \
     --content-type <application/pdf|image/jpeg>
   ```
   Verify live with a **cache-bust** query (Cloudflare negative-caches 404s from
   before upload): `curl -so/dev/null -w '%{http_code}' ".../file.pdf?cb=$(date +%s%N)"`.

2. **git push** (if the user asked): `git push origin master`.

3. **FTP deploy** — IP-restricted to HU residential IPs. No preflight IP check — just
   attempt the upload. Deploy only the changed pages:
   ```bash
   set -a && . ./.env && set +a
   lftp -e "set ftp:ssl-allow no; put -O / index.php; put -O / testuleti_2026.php; bye" \
     -u "$FTP_USER","$FTP_PASSWORD" "$FTP_HOST"
   ```
   A rejection (`530 ... Errol az IP cimrol [...] nem engedelyez belepest`) almost always
   means the user is on a VPN (Swiss/German/Austrian IP) — tell them to get off the VPN,
   then retry.

   If `schedule.php` changed (or isn't live yet: `curl -so/dev/null -w '%{http_code}'
   https://jankmajtis.hu/schedule.php` ≠ 200), upload it **together with** `index.php` —
   `index.php` fatals without it.

   Silent success = deployed. Verify live: `curl -s https://jankmajtis.hu/<page> | grep <new-filename>`.
   For an item whose start is still in the future, expect **no** match now — instead
   verify the page returns 200 and an already-visible item is still there.

4. **Heads-up in the final report:** for every scheduled item, state when it appears
   and when it will disappear (date + time, Budapest), e.g. "Megjelenik 2026.10.16.
   08:00-kor, eltűnik 2026.12.15. 12:00-kor."

Run `aws`/`lftp`/`curl`-to-external with the sandbox disabled (network egress).
