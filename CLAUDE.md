# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Municipal website for Jánkmajtis, a Hungarian village. The site is in a dual state: legacy PHP pages at the root coexist with a modern Eleventy (11ty) v3 static site generator under `/v2/`. Active development happens on the root-level PHP pages; v2 is a future migration target.

## Safety Rules

**No external action without explicit user approval.** This includes:
- `git push` (to any branch, including PR branches)
- FTP uploads (via `lftp`, `deploy.sh`, or any other mechanism)
- R2 uploads (via `aws s3 cp`, `aws s3 sync`, or the helper script)
- Any operation that mutates state outside the local working tree

Local-only actions (editing files, downloading from Gmail, querying R2 read-only) are fine without asking. When in doubt about reversibility or visibility, ask.

## Build & Development Commands

All commands run from the `/v2/` directory:

```bash
cd v2 && npm run serve    # Dev server with live reload
cd v2 && npm run build    # Build static site to v2/_site/
cd v2 && npm run setup    # Convert PHP pages to Nunjucks templates
```

For the legacy PHP site, run locally with the built-in PHP dev server:

```bash
php -S 127.0.0.1:8765    # serves from repo root
```

No test or lint commands are configured.

## Architecture

### Legacy (root level)
- ~50 PHP pages using `include('header.php')` / `include('footer.php')` pattern
- Static assets: `/css/`, `/js/`, `/images_gif/`, `/images_jpg/`, `/images_png/`
- jQuery 1.12.2, Bootstrap 5.3.3, Font Awesome 5.3.3 (all via CDN)
- FancyBox v2.1.5 (vendored in `/fancybox/`)

### V2 (Eleventy)
- **Config**: `v2/.eleventy.js` — passthrough copies assets from root, output to `v2/_site/`
- **Templates**: `v2/src/*.njk` — Nunjucks pages converted from PHP
- **Layout**: `v2/src/_layouts/base.njk` — single master template
- **Converter**: `v2/scripts/setup.js` — automated PHP-to-Nunjucks conversion script (~2700 lines)
- Eleventy reads from `v2/src/` and references root-level assets via `../` passthrough

### Asset hosting

The site uses **two hosts** for served content:

1. **FTP (`ftp.hosting.atw.hu`)** — PHP pages, CSS, JS, images. Limited quota; do **not** add large PDFs here.
2. **Cloudflare R2 (`files.jankmajtis.hu`)** — all PDF documents. Bucket name: `docs`. Public via custom domain. URL structure mirrors local subtree: e.g. `docs/testuleti_ulesek/foo/bar.pdf` (local) ↔ `https://files.jankmajtis.hu/testuleti_ulesek/foo/bar.pdf` (live).

**Rule of thumb for new PDFs**: upload to R2, link with absolute `https://files.jankmajtis.hu/...` URL. Existing legacy PDFs may still link via relative `./docs/...` paths — leave those as-is unless explicitly migrating.

R2 access lives in `.env` (gitignored): `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL`. FTP creds: `FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`.

Helper: [sandbox/claude/sync_r2.sh](sandbox/claude/sync_r2.sh) — `aws s3 sync` wrapper for testületi tree.

### Deployment

Two mechanisms exist:

1. **`deploy.sh`** — interactive lftp-based deploy (excludes `.git`, `sandbox/`, `v2/`, `news/`, `docs/`, etc.); has dry-run + confirmation. Run manually.
2. **Manual lftp** — for one-off PHP page uploads after a specific commit. Pattern:
   ```bash
   set -a && . ./.env && set +a
   git diff --name-only <base-commit>..HEAD | while IFS= read -r f; do
     printf 'put %s\n' "$f"
   done > cmds.lftp
   lftp -e "source cmds.lftp" -u "$FTP_USER","$FTP_PASSWORD" "$FTP_HOST"
   ```

**Both require explicit user approval before running.** See Safety Rules above.

## Content sections

### Testületi ülések (Council meetings)

Pages live at the root (`testuleti_*.php`), PDFs on R2 under `testuleti_ulesek/<folder>/`.

**Menu structure** (in `header.php` Önkormányzat submenu) — three groups under headers:
- Jánkmajtisi Képviselő-testületi ülések: 2019–2026 (8 pages)
- Darnói Képviselő-testületi ülések: 2019–2022 + Bizottsági (5 pages)
- Bizottságok és társulások: Pénzügyi/Ügyrendi, Roma, Darnó Társulás, Víziközmű (4 pages)

**Folder ↔ file prefix map** (each PDF in a folder is prefixed for self-identification):
| Folder | Prefix | Body |
|--------|--------|------|
| `kepviselo_testulet_<YYYY>` | `jm` | Jánkmajtis village council |
| `darno_kepviselo_testulet_<YYYY>` | `dr` | Darnó village council |
| `darno_bizottsagi` | `drb` | Darnó committee |
| `penzugyi_ugyrendi` | `pu` | Jánkmajtis Pénzügyi/Ügyrendi bizottság (sub-marker `_p`/`_u` for committee) |
| `roma_nemzetisegi` | `rn` | Roma Nemzetiségi Önkormányzat ülései |
| `darno_tarsulas` | `if` | Jánkmajtis-Darnó Intézményfenntartó Társulás |
| `vizikozmu_tarsulas` | `vk` | Jánkmajtis-Csegöld Víziközmű Beruházási Társulás |

**Filename pattern**: `<prefix>_(meghivo|jkv)[_<committee>]_<YYYYMMDD>.pdf` — e.g. `jm_jkv_20260601.pdf`, `pu_meghivo_p_20190827.pdf`.

**Generator**: [sandbox/claude/build_testuleti_page.py](sandbox/claude/build_testuleti_page.py) — scans `docs/testuleti_ulesek/<folder>/` and emits PHP pages with R2 URLs. Rerun after adding/removing PDFs.

### News

Pages reference PDFs under `news/<YYMMDD>/` on R2 (newer) or FTP-served `./news/<YYMMDD>/` (legacy). When adding new news items, use **today's date** for the folder name and R2 URLs.

### Gazdálkodás

Page: `gazd_eves_koltsegvetesek.php`. Single docs-table with one row per document. New rows should use R2 URLs (`https://files.jankmajtis.hu/gazdalkodas/...`). Existing rows with `./docs/gazdalkodas/...` paths refer to PDFs already on FTP; leave those untouched.

## Email-driven workflow

Content updates arrive as forwarded Gmail messages from `vekonylajos@gmail.com` (sourced from the jegyző `drerdeianita@gmail.com`). Use `gog` CLI (`gog gmail search`, `gog gmail get`, `gog gmail attachment`) to fetch and download.

Auth lives in the `vekonydoktor@gmail.com` gog account. Sessions can pick up where prior runs left off — check sandbox scripts for the relevant message IDs and prior categorization.

Drive-link-only emails (when attachments were too large for email) reference PDFs that aren't downloadable via the API — those need to be obtained from the sender separately or via the `docs/_upload_/` staging folder if the sender provided one.

## Key Conventions

- All content is in Hungarian.
- CSS/JS files use `?v=X` query params for cache busting.
- `news/`, `docs/`, and `sandbox/` directories are gitignored (PDFs live on R2/FTP, not in repo).
- `.env` is gitignored — never commit secrets.
- PHP pages follow naming patterns: `gazd_*.php` (finances), `valasztas-*.php` (elections), `testuleti_*.php` (council meetings), `hesz_*.php` (HÉSZ), `*_jm.php` / `*_dr.php` (Jánkmajtis / Darnó village).
- Scratch files / helper scripts go in `./sandbox/claude/`.
- Default git branch is `master`. Feature work happens on topic branches; merge with `--no-ff` to preserve history.
