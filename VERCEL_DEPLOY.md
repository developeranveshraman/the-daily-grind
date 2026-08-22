# Deploy The Daily Grind on Vercel

This project is a static Vite/React single-page application. The accompanying **Vercel-ready ZIP** contains the source code, this configuration, and all café images as local public assets, so it does not depend on Manus-hosted image paths after deployment.

> The app’s dashboard updates in real time **within the same browser’s local order stream**. Because this build has no backend, it deliberately does not synchronize sales, carts, or favorites across different customers or devices.

## Included configuration

| Setting | Value | Purpose |
|---|---|---|
| Install command | `pnpm install --frozen-lockfile` | Reproduces the dependency tree from the supplied lockfile. |
| Build command | `pnpm build` | Creates the optimized static application. |
| Output directory | `dist/public` | Matches this project’s Vite build output. |
| SPA rewrite | `/(.*)` → `/index.html` | Preserves direct navigation to routes such as `/menu` and `/dashboard`. |

Vercel documents the SPA rewrite pattern used in `vercel.json` for Vite deep links.[1] Vite’s static deployment guidance also confirms that Vercel can detect a Vite project when deploying by Git or CLI.[2]

## Option A: Deploy through Git and the Vercel dashboard

1. Download and unzip `the-daily-grind-vercel.zip`.
2. Create an empty GitHub, GitLab, or Bitbucket repository, then commit and push the unzipped folder’s contents. Do not commit `node_modules` or `dist`.
3. Visit [Vercel’s new-project page](https://vercel.com/new), sign in, and import that repository.
4. Confirm the detected project settings. The included `vercel.json` sets the install command, build command, output directory, and route fallback; no environment variables are required for this static build.
5. Select **Deploy**. When the deployment completes, open `/`, `/menu`, `/dashboard`, and `/test-console` directly from the deployed URL to confirm client-side routing works.
6. In Vercel, promote a tested preview deployment to production or merge the change into your chosen production branch.

## Option B: Deploy from the command line

1. Download and unzip `the-daily-grind-vercel.zip`, then open a terminal in the unzipped folder.
2. Install dependencies and validate the production bundle:

   ```bash
   pnpm install --frozen-lockfile
   pnpm check
   pnpm build
   ```

3. Install the Vercel CLI, authenticate when prompted, and make a production deployment:

   ```bash
   npm install --global vercel
   vercel --prod
   ```

4. Follow the CLI prompts to choose your account and project name. The CLI reads the included `vercel.json` automatically.

## Operational notes

The portable package intentionally remains frontend-only. The newly added live dashboard feed uses `localStorage` and browser events, so a completed prototype order appears immediately in the dashboard on that browser. To make the dashboard share live sales between staff devices or real customers, add a hosted database and authenticated order API before accepting real purchases.

## References

[1]: https://vercel.com/docs/frameworks/frontend/vite "Vite on Vercel — SPA routing"
[2]: https://vite.dev/guide/static-deploy "Vite — Deploying a Static Site"

