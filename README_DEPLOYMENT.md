# HomesByIsraelHE Production Deployment

This folder is the local source of truth for `https://homesbyisraelhe.com`:

`/Users/israelhernandez/Documents/Website Files/homesbyisraelhe-homepage-shell`

Treat every Codex chat, terminal, and script as an employee with potential production impact. No production deploy should depend on memory, screenshots, or a manually chosen folder.

## Required Start

Before changing anything that can affect `homesbyisraelhe.com`, run:

```bash
npm run hbi:begin
```

This validates the canonical repo, branch, Cloudflare Pages project, Wrangler config, homepage identity, and duplicate production targets outside this repo.

## Phase 2 Production Authority

Production deploy authority is now CI-only.

Local shells and Codex sessions can build, validate, and prepare commits, but `npm run deploy:production` will refuse to deploy unless it is running inside the approved GitHub Actions production workflow.

The workflow file is:

`.github/workflows/production-deploy.yml`

Before enabling the workflow, finish these external setup items:

1. Create or choose the canonical GitHub repository.
2. Push this repo to that remote.
3. Set the exact `owner/repo` slug:

```bash
npm run hbi:set-github-repo -- owner/repo git@github.com:owner/repo.git
```

4. In GitHub, create the `homesbyisraelhe-production` environment.
5. Add required GitHub Actions secrets:
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_API_TOKEN`
6. Restrict the environment to the `main` branch and require manual approval if desired.
7. After a successful CI deploy, remove local Wrangler production authority by logging out or revoking the local OAuth token.

Check readiness with:

```bash
npm run hbi:phase2-status
```

## Only Production Deploy Command

Use:

```bash
npm run deploy:production
```

Do not run `npx wrangler pages deploy` directly for production.

From a local shell, this command is expected to fail. That is the point. It should only pass inside the approved GitHub Actions workflow.

The production deploy command now:

- verifies this is the canonical repo
- verifies production deploy authority comes from GitHub Actions
- verifies the GitHub repo, branch, event, Cloudflare account ID, and CI secrets
- blocks environment overrides to another Pages project or branch
- checks that no other active `wrangler.toml` targets the `homesbyisraelhe` Pages project
- builds `.deploy/homesbyisraelhe-pages`
- checks required current-site text
- blocks known old homepage text
- blocks `functions/_middleware.js` from the production artifact
- requires `_routes.json` so Pages Functions stay scoped to `/api/*`
- verifies `_headers` security headers are present
- writes `.deploy/control-plane/deploy-provenance.json`
- appends an audit event to `audit-reports/deploy-audit-log.jsonl`
- deploys to Cloudflare Pages
- runs production verification

## Source-Of-Truth Files

- `site-deploy-manifest.json` defines the canonical repo, domain, Cloudflare project, required text, forbidden old-version text, and duplicate-target scan roots.
- `scripts/hbi-begin.mjs` is the session start preflight.
- `scripts/hbi-deploy-guard.mjs` is the production deploy gate.
- `scripts/hbi-control-plane.mjs` contains the shared validation and audit logic.
- `scripts/deploy-production.mjs` is the only approved production deploy path.

## Emergency Rule

If the live site is wrong, restore only from this folder. Do not deploy from sibling projects, backups, generated experiment folders, or mirrored live-site folders.

If the control-plane guard fails, fix the cause instead of bypassing it. The only routine exception currently allowed is a dirty working tree; dirty deploys are audited because this repo still has active generated content work.

## Safe Audit Mode

Broad Codex/browser QA should use local builds first. If a live production audit is required, use:

```bash
npm run audit:responsive:live-safe
```

This appends the internal audit flags that keep GA4 and `/api/analytics-context` from firing on every audited page view. A normal live crawl without `HBI_SAFE_LIVE_AUDIT=1` is blocked by `scripts/audit-responsive.mjs`.

For manual browser checks, open any live page with `?hbi_audit=1`. Turn it off with `?hbi_audit=0`.
