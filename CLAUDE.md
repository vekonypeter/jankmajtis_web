# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Municipal website for Jánkmajtis, a Hungarian village. The site is in a dual state: legacy PHP pages at the root coexist with a modern Eleventy (11ty) v3 static site generator under `/v2/`.

## Build & Development Commands

All commands run from the `/v2/` directory:

```bash
cd v2 && npm run serve    # Dev server with live reload
cd v2 && npm run build    # Build static site to v2/_site/
cd v2 && npm run setup    # Convert PHP pages to Nunjucks templates
```

No test or lint commands are configured.

## Architecture

### Legacy (root level)
- ~40 PHP pages using `include('header.php')` / `include('footer.php')` pattern
- Static assets: `/css/`, `/js/`, `/images_gif/`, `/images_jpg/`, `/images_png/`
- jQuery 1.12.2, Bootstrap 5.3.3, Font Awesome 5.3.3 (all via CDN)
- FancyBox v2.1.5 (vendored in `/fancybox/`)

### V2 (Eleventy)
- **Config**: `v2/.eleventy.js` — passthrough copies assets from root, output to `v2/_site/`
- **Templates**: `v2/src/*.njk` — Nunjucks pages converted from PHP
- **Layout**: `v2/src/_layouts/base.njk` — single master template
- **Converter**: `v2/scripts/setup.js` — automated PHP-to-Nunjucks conversion script (~2700 lines)
- Eleventy reads from `v2/src/` and references root-level assets via `../` passthrough

### Deployment
- GitHub Actions (`.github/workflows/upload-to-ftp.yml`) deploys via FTP to `ftp.hosting.atw.hu`
- Currently has `dry-run: true` — set to `false` for actual deployment
- Triggered on every push to master

## Key Conventions

- All content is in Hungarian
- CSS/JS files use `?v=X` query params for cache busting
- `news/` and `docs/` directories are gitignored (not in repo)
- PHP pages follow naming patterns: `gazd_*.php` (finances), `valasztas-*.php` (elections)
