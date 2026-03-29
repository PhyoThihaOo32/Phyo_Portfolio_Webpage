# Phyo Thiha Oo — Portfolio Webpage

[![HTML5](https://img.shields.io/badge/HTML5-Structure-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Styling-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-Interaction-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Responsive](https://img.shields.io/badge/Responsive-Mobile%20%2B%20Desktop-0EA5E9?style=for-the-badge)](#features)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge)](https://web.dev/progressive-web-apps/)
[![Themes](https://img.shields.io/badge/Themes-5-10B981?style=for-the-badge)](#theme-system)

Personal portfolio website built with vanilla HTML/CSS/JS and designed around **theme-driven visuals**, **project storytelling**, and **interactive sections** (gallery, radio, game, aquarium).

---

## Overview

This project is my public portfolio as a Software Engineer and CS student.  
It highlights my background, skills, projects, timeline, and contact flow in a clean, fast, no-framework architecture.

---

## Features

- **5 themes**: `Dark`, `Light`, `Cyber`, `Space`, `Burmese`
- **Code-rain visual panels** for About / Focus / Highlights
- **Project explorer** with search + filter chips
- **Theme-aware daily gallery**
  - Dark/Light: public-domain artworks (The Met)
  - Cyber/Burmese: curated local gallery sets
- **Music section** with Apple/lofi embed support
- **Contact panel** with FormSubmit endpoint integration
- **Recreation Corner**
  - Lofi Bird mini game
  - Animated Dream Aquarium canvas
- **Responsive behavior** for laptop, tablet, and mobile
- **PWA support** (`manifest.webmanifest`, `sw.js`)

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

### Contact Form Delivery

This site uses FormSubmit endpoint mode:

- Endpoint: `https://formsubmit.co/ajax/phyothihaoo.pto@gmail.com`
- Ensure FormSubmit account/email activation is completed
- If delivery fails, check **Spam/Promotions** and endpoint activation status

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
- LinkedIn: [linkedin.com/in/phyo-t-oo-1990a2240](https://www.linkedin.com/in/phyo-t-oo-1990a2240/)
- Repository: [Phyo_Portfolio_Webpage](https://github.com/PhyoThihaOo32/Phyo_Portfolio_Webpage)

---

## License

Personal portfolio project.  
If reused, please replace identity content, assets, and personal links.
