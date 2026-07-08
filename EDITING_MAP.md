# HomesByIsraelHE Homepage / Nav / Titles Edit Kit

Source of truth on this Mac:

`/Users/israelhernandez/Documents/Website Files/homesbyisraelhe-homepage-shell`

This bundle is intentionally focused on homepage layout, navigation behavior, shared navigation/title surfaces, and hub-level pages. It does not include the individual article folders inside Buy, Sell, Homeowners, Move / Relocate, Invest, Local Areas, or Market Pulse.

## Edit These First

- `index.html`: main homepage at `https://homesbyisraelhe.com/`; header markup, desktop mega nav, mobile menu, search overlay, homepage sections, footer title groups.
- `styles.css`: homepage/header/nav/mobile menu/search overlay styling shared by the main shell.
- `script.js`: homepage behavior; nav trigger routing, menu/search open and close behavior, dashboard cards, carousels, and contact intent behavior.
- `article.js`: shared article-page navigation template and menu/search behavior used outside the homepage.
- `article.css`: article-page styles that affect the shared article nav/search/menu presentation.

## Hub-Level Titles And Nav Labels

- `buy/index.html`
- `sell/index.html`
- `move-relocate/index.html`
- `homeowners/index.html`
- `invest/index.html`
- `local-areas-main/index.html`
- `local-areas-guides/index.html`
- `local-areas-research/index.html`
- `housing-market-pulse/index.html`
- `market-trends/index.html`
- `search/index.html`

These are hub/search/index pages only. The nested article pages were left out on purpose.

## Search And Library Labels

- `library-data.js`: search/library data, page labels, article card titles, and hub metadata used by filtered library pages.
- `library.js`: hub-page filtering/search rendering behavior.
- `library.css`: hub-page filter and library styles.
- `guidance-search.js`: shared search helpers.
- `site-search.js`: full search page behavior.

## SEO / Site-Wide Title Config

- `content/config/site.json`: base site name and description.
- `content/config/serp-overrides.json`: SEO title/description overrides. This includes article metadata too, so edit only the paths you intend to change.

## Deploy Context

- `README_DEPLOYMENT.md`
- `site-deploy-manifest.json`
- `package.json`
- `wrangler.toml`
- `_headers`
- `_redirects`
- `_routes.json`

Production deploys should be made from the real source folder, not from this edit-kit folder.
