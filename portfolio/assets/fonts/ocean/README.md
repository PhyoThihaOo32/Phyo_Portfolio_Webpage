# Ocean typography

Ocean uses a small, locally hosted type system. Other themes keep their existing font families.

| Family | Role | Local file | Source version |
| --- | --- | --- | --- |
| Original Surfer | Hero and section headings | original-surfer-latin-400.woff2 | Google Fonts CSS v25, normal 400 |
| Pacifico | Flowing accent in the hero headline | pacifico-latin-400.woff2 | Google Fonts CSS v23, normal 400 |
| DM Sans | Body copy, controls, card titles, and navigation | dm-sans-latin-variable.woff2 | Google Fonts CSS v17, normal variable 400–800 |

Pacifico is the surf-inspired face selected from [FontSpace](https://www.fontspace.com/pacifico-font-f11956), following the owner's Ocean category reference. The remaining reading and heading faces are from [Google Fonts](https://fonts.google.com/). Script is kept to a large accent; small text remains in DM Sans or the existing technology-specific monospace faces.

The unmodified Latin WOFF2 files were retrieved from Google's font service on November 2, 2026:

- DM Sans: https://fonts.gstatic.com/s/dmsans/v17/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu0-K4.woff2
- Original Surfer: https://fonts.gstatic.com/s/originalsurfer/v25/RWmQoKGZ9vIirYntXJ3_MbekzNMSC0Fu.woff2
- Pacifico: https://fonts.gstatic.com/s/pacifico/v23/FwZY7-Qmy14u9lezJ-6H6Mk.woff2

The three fonts total 88,632 bytes. They use `font-display: swap` and readable system fallbacks. Ocean's initial page load preloads these files; the browser also loads them naturally when switching to Ocean later. No visitor request to a third-party font server is needed.

Each family is distributed under the SIL Open Font License 1.1. Original copyright notices and complete licenses are retained in `dmsans-OFL.txt`, `originalsurfer-OFL.txt`, and `pacifico-OFL.txt`, from the corresponding [`google/fonts`](https://github.com/google/fonts/tree/main/ofl) directories.
