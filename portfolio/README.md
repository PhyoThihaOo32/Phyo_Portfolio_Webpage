# Personal Portfolio (Dark, Clean, Structured)

A zero-dependency, single-page portfolio you can customize by editing `content.js`. No build tools required — open `index.html` in a browser or serve statically.

## Quick start

- Edit `content.js` and fill in your real details (name, bio, skills, projects, links).
- Optional: place a photo at `assets/avatar.svg` (PNG/JPG also work; update path in `content.js`).
- Optional: add your résumé at `assets/resume.pdf`.
- Open `index.html` in a browser.

If your browser blocks loading local JS on `file://`, run a tiny local server:

- Python: `python3 -m http.server 8000` then open http://localhost:8000/portfolio/
- Node: `npx serve` (or any static server)

Keyboard shortcuts:
- `/` focuses project search
- `t` toggles dark/light theme

## Customize

- Colors: tweak CSS variables at the top of `styles.css`.
- Default theme: change `preferences.theme` in `content.js` ("dark" or "light").
- Sections: all rendering logic lives in `main.js` — feel free to rearrange or remove sections.
- Social icons: set URLs in `profile.social` inside `content.js` (only non-empty are shown).
- Projects: set `featured: true` to emphasize. Use `tags` to enable filtering.

## Deploy

Any static host works:
- GitHub Pages: push this `portfolio/` folder to a repo and enable Pages.
- Vercel/Netlify: drag-and-drop or connect the repo.
- S3/CloudFront or your own server: upload the folder as-is.

PWA: A simple service worker (`sw.js`) is included for offline caching and a minimal `manifest.webmanifest` for installability.

## SEO & Sharing

- Page `<title>` and meta description are in `index.html`.
- JSON-LD Person schema is injected from your `content.js` (see `injectJsonLd()` in `main.js`).
- Favicon lives at `assets/favicon.svg`.

## Accessibility

- Keyboard focus styles, skip link, semantic landmarks, and sensible contrast.
- Respects reduced-motion preferences.

## Structure

```
portfolio/
├── assets/
│   ├── avatar.svg        # replace with your photo
│   └── favicon.svg
├── content.js            # your data (edit me)
├── index.html            # layout + sections
├── main.js               # rendering + UX
├── styles.css            # dark theme styles
└── README.md
```

## License

This template is yours to use. No attribution required.
