# Weekly Split — Workout Planner

A drag-and-drop weekly workout planner designed to pair with a recovery signal — Whoop recovery, Garmin Body Battery, or just how much energy you feel you have. Workouts are arranged along a "recovered energy required" gradient so you can match session intensity to how the day actually feels.

Everything is stored in your browser's `localStorage`. No account, no server, no sync. Drop the two files on any static host and it runs.

<!-- If you've deployed this, replace the line below with your Pages URL. -->
**Live site:** _(add your GitHub Pages URL here after deploying — see below)_

## Using the app (as a visitor)

If you're using someone else's deployment:

- On first visit you'll be asked to **create a profile** or **import a JSON file**. The welcome screen can't be dismissed — you have to do one of those two things before you can use the planner.
- Your profile lives only in your browser's storage on that device. The person hosting the site can't see it. Other visitors can't see it either.
- The profile pill at the top of the header opens: **Switch · Create · Rename · Export · Import · Delete**.
- **Export** downloads a JSON backup. **Import** reads one back in as a new profile. This is how you move data between your phone and laptop — there is no cloud sync.
- Browser `localStorage` is typically ~5 MB per origin, enough for years of data. If you clear browser data for the site, every profile is gone — export a backup occasionally.

## Host your own copy

The easiest path is GitHub Pages:

1. Fork this repo (or download `index.html` + `weekly-workout-planner.js` into a new public repo).
2. On the repo page: **Settings → Pages → Source: Deploy from a branch → Branch: `main` → `/ (root)` → Save**.
3. Wait ~60 seconds. Your site will be at `https://<your-username>.github.io/<repo-name>/`.
4. On mobile: open the page in your browser, then `Share → Add to Home Screen` to get a launcher icon that opens fullscreen.

The repo must be **public** for free-tier Pages. It works on any other static host too (Netlify, Vercel, Cloudflare Pages, S3, a plain nginx server) — just serve the two files.

## Running locally

Double-clicking `index.html` won't work — browsers block ES module imports over `file://` URLs. Run a local server:

```bash
# In the folder with index.html:
python3 -m http.server 8000
# then visit http://localhost:8000
```

Or with Node:
```bash
npx serve .
```

## Customizing the component

`weekly-workout-planner.js` is the only source file and it has no build step. It uses React's automatic JSX runtime — calls look like `jsx('div', { ... })` instead of `<div>` — so the browser loads it directly via the import map in `index.html`. Edit the `.js` and reload.

Things you might want to change:

- **Default workout types and their colors** — `DEFAULT_WORKOUT_TYPES` near the top of the file. Colors are arranged along the "recovered energy required" gradient, see the `COLOR_PRESETS` comment.
- **Default weekly template** — `INITIAL_DEFAULT_PLAN`. Keyed by day-of-week (Mon=0, Sun=6).
- **Per-workout guidance shown in the detail modal** — `WORKOUT_DETAILS`.
- **Recovery-color playbook at the bottom of the page** — `PLAYBOOK_RECOVERY`, `PLAYBOOK_SURF`, `PLAYBOOK_CAPS`.

If you want to rewrite this as a proper Vite/React project with JSX syntax, a hot-reload dev server, and real build tooling:

```bash
npm create vite@latest workout-planner -- --template react
cd workout-planner
npm install lucide-react tailwindcss
# port the component into src/ using real JSX syntax
npm run build
# deploy the dist/ folder
```

### Native apps

- Windows `.exe` → [Tauri](https://tauri.app) wraps a Vite build.
- Android `.apk` → [Capacitor](https://capacitorjs.com) wraps a Vite build.

## Troubleshooting

**Blank page, no errors visible.** Open DevTools (F12 / Cmd+Opt+I) and check the Console tab. The page has a built-in error boundary that shows the exact problem if boot fails.

**`Failed to fetch dynamically imported module`.** You're probably opening `index.html` over `file://`. See "Running locally" above.

**Fonts look wrong.** Your network or browser blocked `fonts.googleapis.com`. The app falls back to system serif/sans but loses the editorial feel. Not a functional problem.

**Tailwind CDN warning in the console.** Harmless. Only relevant for high-traffic production sites.

## License

[PolyForm Noncommercial 1.0.0](LICENSE). Free to use, fork, and modify for **noncommercial purposes** — personal use, hobby projects, research, education, and nonprofit work are all covered. Forks and redistributions must keep the copyright notice (`Required Notice: Copyright (c) 2026 pbelzeski`) and a copy of the license text.

Commercial use — selling the software, wrapping it in a paid product, or using it as part of a revenue-generating service — is **not** permitted under this license. If you want to use it commercially, [open an issue](../../issues) or get in touch; a separate commercial license may be available.
