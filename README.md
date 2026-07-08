# HomesByIsraelHE Homepage Nav/Layout Edit Kit

This repo is a separate tracking workspace for homepage layout, navigation behavior, hub labels, and title-surface edits for `homesbyisraelhe.com`.

It is not the production source repo.

Production source folder on this Mac:

`/Users/israelhernandez/Documents/Website Files/homesbyisraelhe-homepage-shell`

Use this repo to review and track proposed changes. When changes are ready, apply them back to the production source folder deliberately.

## Start Here

- `EDITING_MAP.md` explains what each included file controls.
- `index.html`, `styles.css`, and `script.js` control the main homepage layout and nav behavior.
- `article.js` and `article.css` control shared article-page navigation surfaces.
- Hub-level `index.html` files are included; individual non-Pulse article folders are intentionally excluded.
- `housing-market-pulse/` is included in full so individual Pulse city pages can be edited separately.

## Included Scope

- Homepage shell
- Shared navigation and search scripts
- Shared styles
- Hub-level index pages
- Full generated `housing-market-pulse/` section for individual Pulse-page edits
- Search/library data and rendering files
- Full raw `market-trends/data/*.json` market dataset for graph/data-backed views
- Minimal referenced assets for local preview
- Production context docs for orientation only

## Not Included

- Individual article page folders
- Full image library
- Full production deploy artifact
- Generated `.deploy` output
