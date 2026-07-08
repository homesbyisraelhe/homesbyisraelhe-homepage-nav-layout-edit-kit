# HomesByIsraelHE Homepage / Nav / Titles Edit Kit

Source of truth on this Mac:

`/Users/israelhernandez/Documents/Website Files/homesbyisraelhe-homepage-shell`

This bundle is intentionally focused on homepage layout, navigation behavior, shared navigation/title surfaces, and hub-level pages. It does not include the individual article folders inside Buy, Sell, Homeowners, Move / Relocate, Invest, or Local Areas. The `housing-market-pulse/` section is included in full so Pulse pages can be edited individually.

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

Most sections above are hub/search/index pages only. The exception is `housing-market-pulse/`, which now includes the full generated Pulse section so each city Pulse page can be edited individually.

## Housing Market Pulse

- `housing-market-pulse/index.html`: main public Pulse hub at `/housing-market-pulse/`.
- `housing-market-pulse/[city]/index.html`: individual city Pulse pages.
- `housing-market-pulse/[city]/article.meta.json`: metadata for each generated city Pulse page.
- `housing-market-pulse/research/*.json`: research packets used by Pulse pages.
- `scripts/generate-housing-market-pulse-articles.mjs`: source generator for the Pulse section.
- `market-trends/data/*.json`: real market data files used by Market Trends and the Pulse generator.
- `content/la-oc-city-zips.json` and `content/research/city-database.json`: supporting location data.

The full raw `market-trends/data/*.json` dataset is included so charts and generated Pulse pages can use real local market data.

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
