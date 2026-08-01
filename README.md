# Walkcode

Walkcode is a static, mobile-friendly practice site for guided coding walkthroughs and quick code drills.

There is no backend, build system, or runtime API. The entire site can be hosted on GitHub Pages or any other static host.

## Project structure

- `index.html` — the small static entry point.
- `src/app.js` — application routing and screen coordination.
- `src/views/` — Home, walkthrough library, drill, and lesson screens.
- `src/lib/` — local progress state and shared UI helpers.
- `src/data/curriculum.js` — the problem roadmap.
- `src/data/lesson-records.js` — explanations and walkthrough records.
- `src/data/drills.js` — code-fix and standalone drill content.
- `src/data/languages.js` — JavaScript/Python variants.
- `src/data/difficulty.js` — difficulty overrides.
- `src/styles.css` — all site styling.

## Local preview

Serve the repository with any static file server, then open `index.html` through that server. No install or build step is required.

## Publishing

Deploy the repository root as a static site. GitHub Pages is sufficient; push only when you are ready to publish your local changes.
