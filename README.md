# Phyo Portfolio Webpage

[![HTML](https://img.shields.io/badge/HTML5-Structure-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS3-Styling-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-Interaction-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8?style=for-the-badge)](https://web.dev/progressive-web-apps/)
[![Responsive](https://img.shields.io/badge/Responsive-Desktop%20%26%20Mobile-0EA5E9?style=for-the-badge)](#features)
[![Themes](https://img.shields.io/badge/Themes-5-10B981?style=for-the-badge)](#features)

A recruiter-focused personal portfolio built with HTML, CSS, and JavaScript.

**Live site:** [phyo-portfolio-webpage.onrender.com](https://phyo-portfolio-webpage.onrender.com/)

The site leads with selected software projects, current engineering experience, measurable outcomes, and an updated one-page resume while preserving the multi-theme visual system, art gallery, radio, and interactive recreation features that make the portfolio personal.

## Repo Description

Responsive software engineering portfolio with curated project case studies, experience, an ATS-friendly resume, five visual themes, and progressive web app support.

## Features

- Five themes: Dark, Light, Cyber, Space, and Burmese
- Soft animated Borrachas artwork in Dark mode with a reduced-motion still fallback
- Recruiter-first hero with current role, stack, and measurable highlights
- Curated project portfolio featuring SafeYork, MindEase, Code Memory Visualizer, LogicDiagramAI, and QA automation
- Current software engineering, AI education, and CUNY experience timeline
- Updated one-page, ATS-friendly resume generated from a reproducible source
- Custom font system tailored to individual themes
- Animated code-rain visual treatment for About, Focus, and Highlights
- Gallery with theme-specific behavior
- Project filtering and search
- Responsive layout across desktop and mobile
- Interactive contact form with mail integration
- Resume download and vCard export
- PWA support through `manifest.webmanifest` and `sw.js`

## Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Static assets and locally bundled fonts

## Project Goals

- Build a portfolio that reflects both technical ability and visual taste
- Explore frontend architecture without a framework
- Create a stronger identity through themes, type, motion, and layout
- Present projects and background in a way that feels deliberate and memorable

## Theme System

- `Dark`: clean, minimal, strong default presentation
- `Light`: bright, airy, and more editorial
- `Cyber`: neon, high-contrast, and stylized
- `Space`: sci-fi inspired, atmospheric, and cosmic

## Local Development

Open the site with any static server from the project folder:

```bash
cd /Users/phyothihaoo/Documents/Playground/portfolio
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Project Structure

```text
portfolio/
├── assets/
│   ├── art/
│   ├── fonts/
│   ├── avatar.svg
│   ├── favicon.svg
│   └── resume.pdf
├── output/pdf/             # Final resume artifact
├── scripts/build_resume.py # Reproducible resume builder
├── content.js
├── index.html
├── main.js
├── styles.css
├── manifest.webmanifest
├── sw.js
└── README.md
```

## Customization

- Edit personal data in `content.js`
- Adjust layout and interactions in `main.js`
- Modify themes, typography, and visual treatments in `styles.css`
- Replace gallery assets in `assets/art/`

## Accessibility

- Semantic structure and section landmarks
- Keyboard-friendly navigation
- Reduced-motion support for users who prefer less animation
- Clear visual states for controls and forms

## Deployment

This is a static site and can be deployed easily to:

- GitHub Pages
- Netlify
- Vercel
- Any standard static host

## Author

Phyo Thiha Oo

- GitHub: [https://github.com/PhyoThihaOo32](https://github.com/PhyoThihaOo32)
- LinkedIn: [https://www.linkedin.com/in/phyo-t-oo-1990a2240/](https://www.linkedin.com/in/phyo-t-oo-1990a2240/)
- Portfolio Repo: [https://github.com/PhyoThihaOo32/Phyo_Portfolio_Webpage](https://github.com/PhyoThihaOo32/Phyo_Portfolio_Webpage)

## License

This project is published as a personal portfolio project.
