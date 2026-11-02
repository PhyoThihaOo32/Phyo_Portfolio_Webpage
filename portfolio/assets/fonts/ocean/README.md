# Ocean typography

Ocean uses a small, locally hosted type system. Other themes keep their existing font families.

| Family | Role | Local file | Source version |
| --- | --- | --- | --- |
| Make Summer Fun | Hero and section headings | make-summer-fun-regular.ttf | Misti's Fonts, unmodified FontSpace download |
| DM Sans | Body copy, controls, card titles, and navigation | dm-sans-latin-variable.woff2 | Google Fonts CSS v17, normal variable 400–800 |

Make Summer Fun is the exact face [selected by the owner on FontSpace](https://www.fontspace.com/make-summer-fun-font-f46329). The original 707,160-byte TrueType file is served without editing, conversion, or subsetting. Its designer is Misti Hammers (Misti's Fonts). The [designer's terms](https://mistifonts.com/make-summer-fun/) permit personal use and require a license for commercial use. It is used here for the owner's personal portfolio. The download's original source/terms information is preserved in `make-summer-fun-source.txt`. This font is **not** SIL OFL licensed.

Handwriting is reserved for large headings. Small copy, navigation, form fields, buttons, and tags remain in DM Sans or the existing technology-specific monospace faces.

Ocean preloads Make Summer Fun and DM Sans (744,092 bytes total). Both use `font-display: swap` and system fallbacks. Other themes do not request either font. There are no visitor requests to third-party font servers.

## Earlier Google Fonts assets

Original Surfer and Pacifico are retained as earlier source assets but are no longer referenced by the stylesheet or preload list. DM Sans remains active. These Google Fonts files and their licenses are unchanged.

The unmodified Latin WOFF2 files were retrieved from Google's font service on November 2, 2026:

- DM Sans: https://fonts.gstatic.com/s/dmsans/v17/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu0-K4.woff2
- Original Surfer: https://fonts.gstatic.com/s/originalsurfer/v25/RWmQoKGZ9vIirYntXJ3_MbekzNMSC0Fu.woff2
- Pacifico: https://fonts.gstatic.com/s/pacifico/v23/FwZY7-Qmy14u9lezJ-6H6Mk.woff2

These three Google Fonts families are distributed under the SIL Open Font License 1.1. Original copyright notices and complete licenses are retained in `dmsans-OFL.txt`, `originalsurfer-OFL.txt`, and `pacifico-OFL.txt`, from the corresponding [`google/fonts`](https://github.com/google/fonts/tree/main/ofl) directories.
