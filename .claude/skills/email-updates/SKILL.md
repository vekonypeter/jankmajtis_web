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

Starting auth **without hijacking the default browser** — suppress auto-open and
surface the link gog prints so the user opens it themselves:

```bash
BROWSER=echo gog auth login -a vekonydoktor@gmail.com --client personal
```

Print the URL gog emits to the user verbatim and wait. Do **not** ask for tokens
or callback URLs. Once they confirm, re-run the probe before continuing.

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

## Step 4 — Plan and get approval

Print a compact summary table: item → type → target file → planned R2 path →
title/date. List anything skipped as a duplicate and why. **Wait for the user's
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

Tell the user what changed and that they can check locally
(`php -S 127.0.0.1:8765` from repo root) — the document links resolve against the
local `news/`/`docs/` copies. Wait for approval.

## Step 7 — Roll out (only after approval)

0. **Swap local links → R2 URLs, then commit.** Once the preview is accepted, rewrite
   every local href added in Step 5 to its absolute
   `https://files.jankmajtis.hu/<subtree>/...` form (news → `.../news/<YYMMDD>/...`;
   testületi → `.../testuleti_ulesek/<folder>/...`). `php -l` again, then **commit per
   meaningful task** (news entries that arrived together → one commit; a testületi
   update is its own commit). Short one-line Hungarian message, end with the
   `Co-Authored-By` trailer. Do **not** push yet.

1. **R2 upload** (bucket `docs`, keys mirror the URL subtree; creds in `.env`):
   ```bash
   set -a && . ./.env && set +a
   aws s3 cp <local> s3://docs/<key> --endpoint-url "$AWS_ENDPOINT_URL" \
     --content-type <application/pdf|image/jpeg>
   ```
   Verify live with a **cache-bust** query (Cloudflare negative-caches 404s from
   before upload): `curl -so/dev/null -w '%{http_code}' ".../file.pdf?cb=$(date +%s%N)"`.

2. **git push** (if the user asked): `git push origin master`.

3. **FTP deploy** — IP-restricted to HU residential IPs. **Check egress first:**
   ```bash
   curl -s https://ifconfig.me            # must be a HU residential IP, not a datacenter/VPN
   ```
   A datacenter IP is rejected with `530 ... Errol az IP cimrol [...] nem engedelyez belepest`.
   If so, tell the user to drop VPN / allowlist the IP, then retry. Deploy only the
   changed pages:
   ```bash
   set -a && . ./.env && set +a
   lftp -e "set ftp:ssl-allow no; put -O / index.php; put -O / testuleti_2026.php; bye" \
     -u "$FTP_USER","$FTP_PASSWORD" "$FTP_HOST"
   ```
   Silent success = deployed. Verify live: `curl -s https://jankmajtis.hu/<page> | grep <new-filename>`.

Run `aws`/`lftp`/`curl`-to-external with the sandbox disabled (network egress).
