# Phyo Thiha Oo — Portfolio Webpage

[![HTML5](https://img.shields.io/badge/HTML5-Structure-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Styling-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-Interaction-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Responsive](https://img.shields.io/badge/Responsive-Mobile%20%2B%20Desktop-0EA5E9?style=for-the-badge)](#features)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge)](https://web.dev/progressive-web-apps/)
[![Themes](https://img.shields.io/badge/Themes-6-10B981?style=for-the-badge)](#theme-system)

Personal software engineering portfolio built with vanilla HTML/CSS/JS and designed around **selected project storytelling**, **current experience**, **theme-driven visuals**, and **interactive sections**.

---

## Overview

This project is my public portfolio as a Software Engineer and CS student.  
It highlights my background, skills, projects, timeline, and contact flow in a clean, fast, no-framework architecture.

---

## Features

- **6 themes**: `Dark`, `Light`, `Cyber`, `Space`, `Burmese`, `Ocean`
- **Ocean's glowing wave background**: the owner's selected Loop Glow animation by xponentialdesign, softened by a sky-blue veil with a matching still for reduced motion and data saving
- **Borderless card surfaces** with translucent color washes and feathered edges that blend into each theme's background
- **Dark-theme ambient artwork** by Borrachas with a reduced-motion still fallback
- **Recruiter-first hero** with current role, stack, and measurable highlights
- **Curated project portfolio** with live demos and source links
- **Updated experience timeline** aligned with the current resume
- **Current resume PDF** with view and download controls
- **Code-rain visual panels** for About / Focus / Highlights
- **18 individual skill badges** with technology-specific icons, hover effects, and documentation links
- **Project explorer** with search, clickable tags, shareable filtered URLs, and reset controls
- **Theme-aware daily gallery**
  - Dark/Light: public-domain artworks (The Met)
  - Cyber/Burmese: curated local gallery sets
  - Ocean: ten owner-selected animations with individual creator credits
- **Music section** with lazy-loaded Apple/lofi embeds
- **Contact panel** with FormSubmit endpoint integration
- **Recreation Corner**
  - Lofi Bird mini game
  - Animated Dream Aquarium canvas
- **Responsive behavior** for laptop, tablet, and mobile
- **Motion control** with persistent pause preferences and system reduced-motion support
- **Keyboard and screen-reader improvements** for navigation, filters, gallery controls, and form errors
- **PWA support** (`manifest.webmanifest`, `sw.js`) with same-origin caching and offline fallbacks

---

## Theme System

- **Dark**: high contrast, clean default UI
- **Light**: soft bright surfaces with subtle neon accents
- **Cyber**: violet/magenta neon, stylized typography
- **Space**: nebula-inspired atmosphere, sci-fi tone
- **Burmese**: warm gold/maroon palette reflecting cultural origin
- **Ocean**: sky blue, turquoise, seafoam, and warm coral accents with tropical animation and a featured maritime painting

Ocean's type system uses the owner-selected **Make Summer Fun** by Misti's Fonts for the hero and section headings, with **DM Sans** for body text, buttons, navigation, and card titles. The unmodified Make Summer Fun TrueType file and DM Sans WOFF2 are served locally with `font-display: swap`; initial Ocean visits preload these two files. Other themes retain their existing typefaces. Make Summer Fun is provided for personal use; the designer requires a license for commercial use. See [`assets/fonts/ocean/README.md`](assets/fonts/ocean/README.md) for sources and usage terms. Earlier Original Surfer/Pacifico assets are retained but no longer loaded.

Card surfaces share `--card-surface` and `--card-feather` in `styles.css`. Only their decorative pseudo-elements are masked; text, images, and controls retain full opacity. A soft pointer highlight fades in on hover. Pause and reduced-motion preferences disable the hover movement; focus outlines and form-field boundaries remain visible.

Ocean uses clear card surfaces instead of the shared feathered wash: its white surface layer and blur are removed, with subtle blue contours from `assets/art/ocean/water-contours.svg` below the content. A continuous sky-blue veil over the wave background supports readable text across the page, and unused space around gallery artwork reveals the same water. The contours stay still, and the motion control continues to pause the underlying waves and gallery.

Ocean also has gentle mouse-driven water glints and expanding ripples in `ocean-water.js`. Small transparent canvases follow the pointer with softened movement, fade after a brief rest or exit, and keep all controls clickable. The effect sits behind card text and lightly over artwork frames without distorting the art. Drawing is capped near 30 fps, pixel density and simultaneous surfaces are limited, and canvases are removed after fading. Touch, reduced-motion, paused motion, hidden tabs, scrolling, and theme changes stop the effect.

Ocean's background uses the owner-supplied **Loop Glow GIF by xponentialdesign**, exported as an H.264 MP4 in `assets/art/ambient/ocean-glow-waves.mp4` to preserve the full loop at a smaller download size. `ocean.js` loads the muted, inline video only when Ocean is visible and motion is allowed. The motion control freezes and resumes the video; hidden tabs pause it, and leaving Ocean releases the decoder. Reduced-motion, data-saving, blocked-autoplay, and failed-media cases use a matching PNG still. A sky-blue veil keeps the background quiet and the foreground readable.

The Ocean hero features **Moonlit Night at Sea** by **Ivan Aivazovsky**, selected by the owner from [@darkgloomyart's Instagram post](https://www.instagram.com/p/DVNCXLXim2p/). The 1440 × 1882 WebP is self-hosted in `assets/art/ocean/aivazovsky-moonlit-sea.webp`; the full portrait carries the portfolio's “Curiosity. Then, craft.” quote over a subtle lower-edge shade, above both the still and Three.js rendering. A compact caption credits the artist and links to the selected post. Ocean's credits section uses slightly smaller type and spacing, and its water background has a slightly lighter readability veil for more visible waves. Other themes retain their original hero artwork and styling.

`ocean-art.js` turns this image into a quiet, image-based Three.js scene: small depth differences, a gentle mouse tilt, subtle sea refraction, and warm moonlight shimmer. `ocean-art-scene.js` reuses the local MIT-licensed Three.js bundle. It loads only when the Ocean painting approaches the viewport with motion enabled; the original image stays underneath as a fallback. Rendering is capped near 30 fps with a small texture and limited pixel density. The scene stops offscreen or in hidden tabs, shows the original still when motion is paused, and releases its GPU resources on theme changes. Reduced motion, data saving, module/WebGL failure, and context loss preserve the still image. The painting uses this shader instead of the card-hover canvas; other Ocean cards keep their existing gentle ripples.

Ocean's gallery manifest pairs ten owner-supplied GIFs with optimized MP4 loops and PNG stills. Loop Glow reuses the background's existing media files. Gallery loops load as the gallery approaches the viewport, play silently inline, respect motion/data preferences, and pause offscreen or in hidden tabs. Switching artwork or themes releases the previous video. Fit mode preserves each full frame; the existing fill control remains available. Creator credits appear with each piece; [the Ocean asset notes](assets/art/ocean/README.md) record the source filenames and credits.

The earlier procedural sea is retained in `ocean-scene.js` as unused source artwork. The page background remains the owner-selected GIF loop; the Three.js renderer belongs to the featured painting.

Link directly to a theme with `?theme=ocean` (or any of the other theme names). Changing themes updates that parameter when present; ordinary portfolio URLs retain the visitor's saved preference.

---

## Tech Stack

- **HTML5**
- **CSS3** (custom properties, responsive media queries)
- **Vanilla JavaScript** (rendering + interaction logic)
- **Canvas API** (game + aquarium animation)
- **Static assets** (fonts, images, SVGs)

---

## Local Development

```bash
cd /Users/phyothihaoo/Documents/Playground/portfolio
python3 -m http.server 5500
```

Open:

```text
http://127.0.0.1:5500/index.html
```

---

## Project Structure

```text
portfolio/
├── assets/
│   ├── art/                 # gallery sets (masters/cyber/burmese)
│   ├── fonts/               # theme fonts
│   ├── projects/            # project thumbnails
│   └── recreation/          # aquarium backgrounds
├── content.js               # profile data + configuration
├── index.html               # page structure
├── main.js                  # UI rendering + interactions
├── motion.js                # visitor animation preference
├── interactions.js          # delegated button and card feedback
├── project-visuals.js        # original animated SVG illustrations
├── styles.css               # themes + responsive styles
├── manifest.webmanifest     # PWA manifest
├── sw.js                    # service worker
└── README.md
```

---

## Configuration Notes

Most personal content is managed from `content.js`:

- `profile`: name, role, links, resume
- `about`: code-rain lines
- `projects` / `projectOverrides`
- `passions`
- `music`
- `contact.endpoint`

### Shareable Project Views

Search text and the active tag are encoded in `q` and `tag` URL parameters. The project copy-link control includes `#projects` so a visitor lands at the filtered collection. Reset filters (or Escape in search) clears both.

The published resume is `assets/resume.pdf`, supplied by the portfolio owner. `scripts/build_resume.py` is an older draft generator and is not used to update the published resume.

### Contact Form Delivery

This site uses FormSubmit endpoint mode:

- Endpoint: `https://formsubmit.co/ajax/phyothihaoo.pto@gmail.com`
- Ensure FormSubmit account/email activation is completed
- If delivery fails, check **Spam/Promotions** and endpoint activation status
- FormSubmit must be available; a hosting or provider outage cannot be repaired by front-end JavaScript.
- The form retains the visitor's input when delivery is not confirmed. Email app and Gmail links open a draft containing that input, and Copy message provides a manual fallback.
- These email options open a draft; visitors still press Send in their email account. They work independently of FormSubmit.
- `_url` identifies the published contact page even when the browser omits its referrer. Without JavaScript, the form uses the normal FormSubmit POST endpoint.

---

## Deployment

Static hosting ready:

- GitHub Pages
- Netlify
- Vercel
- Any static web server

---

## Credits

- **The Metropolitan Museum of Art (The Met)** — public-domain artworks used in gallery mode
- **Apple Music / lofi.cafe** — listening embed sources (as configured)
- **Custom local assets and theme fonts** — curated by repository owner

> Please keep/verify license terms for any third-party assets you add to `assets/`.

---

## Author

**Phyo Thiha Oo**

- GitHub: [github.com/PhyoThihaOo32](https://github.com/PhyoThihaOo32)
- LinkedIn: [linkedin.com/in/phyothihaoo](https://www.linkedin.com/in/phyothihaoo)
- Repository: [Phyo_Portfolio_Webpage](https://github.com/PhyoThihaOo32/Phyo_Portfolio_Webpage)

---

## License

Personal portfolio project.  
If reused, please replace identity content, assets, and personal links.
