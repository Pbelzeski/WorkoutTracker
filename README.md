# Weekly Split — Workout Planner

A drag-and-drop weekly workout planner that pairs with your Whoop recovery or Garmin Body Battery. Profiles, customization, and workout history are stored locally in your browser — no account, no server, no sync.

## Files

- `index.html` — the deployable page
- `weekly-workout-planner.js` — the component the browser loads
- `README.md` — this file

## Deploy to GitHub Pages (≈5 minutes)

1. Create a new public GitHub repository.
2. Upload **`index.html`** and **`weekly-workout-planner.js`** to the repo root. Drag-and-drop works in the GitHub web UI.
3. Settings → Pages → Source: `Deploy from a branch` → Branch: `main` → `/ (root)` → Save.
4. Wait ~60 seconds. Visit `https://<your-username>.github.io/<repo-name>/`.
5. On mobile: open in the browser, then `Share → Add to Home Screen` to get an app icon that launches fullscreen.

## Running locally

Due to browser security rules, you **can't just double-click `index.html`** — ES modules don't work over `file://` URLs. Run a local server instead:

```bash
# In the folder with index.html:
python3 -m http.server 8000
# then visit http://localhost:8000
```

Or with Node:
```bash
npx serve .
```

## How profiles work

- All data (schedule, completed workouts, custom workout types) is stored in your browser's `localStorage`.
- Each profile is an isolated namespace. Switching profiles loads a separate set of data.
- On first visit, the app requires you to either create a profile or import one from a JSON file — the welcome screen can't be dismissed. This means anyone else visiting your deployed page sees an empty welcome screen, not your data.
- The profile pill at the top-left of the header opens a menu: **Switch · Create · Rename · Export · Import · Delete**.

### Data portability (how to move between devices)

- **Export** downloads a JSON file like `philip-workouts-2026-04-18.json`. Save it anywhere.
- **Import** reads a JSON file on any device and creates a new profile from its contents.

Phone and laptop each have their own browser storage — there is no cloud sync. Use export/import to move between them.

### Storage notes

- Browser `localStorage` is typically ~5 MB per origin — room for years of data.
- If you clear browser data for this origin, all profiles are gone. Export a backup occasionally.

## Editing the component

`weekly-workout-planner.js` is the only source file. It uses the automatic JSX runtime (`jsx(...)` / `jsxs(...)` calls instead of JSX syntax) so it runs directly in the browser with no build step. Edit it directly.

If you want to rewrite this as a proper Vite/React project later:

```bash
npm create vite@latest workout-planner -- --template react
cd workout-planner
npm install lucide-react tailwindcss
# port the component into src/ using real JSX syntax
npm run build
# deploy the dist/ folder
```

### Native apps later

- Windows `.exe` → [Tauri](https://tauri.app) wraps a Vite build.
- Android `.apk` → [Capacitor](https://capacitorjs.com) wraps a Vite build.

## Troubleshooting

**Blank page, no errors visible.** Open DevTools (F12 / Cmd+Opt+I) and check the Console tab. The page has a built-in error boundary that will show the exact problem if boot fails.

**`Failed to fetch dynamically imported module`.** You're probably opening `index.html` via `file://`. See "Running locally" above.

**Fonts look wrong.** Your network or browser blocked `fonts.googleapis.com`. The app falls back to system serif/sans but loses the editorial feel. Not a functional problem.

**Tailwind CDN warning in the console.** Harmless. Only relevant for high-traffic production sites, which this isn't.
