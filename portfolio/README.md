# Phyo Thiha Oo — Portfolio Webpage

[![HTML5](https://img.shields.io/badge/HTML5-Structure-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Styling-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-Interaction-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Responsive](https://img.shields.io/badge/Responsive-Mobile%20%2B%20Desktop-0EA5E9?style=for-the-badge)](#features)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge)](https://web.dev/progressive-web-apps/)
[![Themes](https://img.shields.io/badge/Themes-5-10B981?style=for-the-badge)](#theme-system)

Personal software engineering portfolio built with vanilla HTML/CSS/JS and designed around **selected project storytelling**, **current experience**, **theme-driven visuals**, and **interactive sections**.

---

## Overview

This project is my public portfolio as a Software Engineer and CS student.  
It highlights my background, skills, projects, timeline, and contact flow in a clean, fast, no-framework architecture.

---

## Features

- **5 themes**: `Dark`, `Light`, `Cyber`, `Space`, `Burmese`
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
