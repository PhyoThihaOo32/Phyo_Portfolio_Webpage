# GIS Chatbot (C++)

A lightweight C++17 command-line chatbot for BMCC CUNY Geographic Information Science (GIS) A.S. program.

Features:
- Offline Q&A over a curated knowledge base from the BMCC GIS program page.
- Simple intent detection for sections like Overview, Requirements, Courses, Careers, Internships, Research, Transfer, Contact, Events.
- Ad copy generator for platforms (twitter/instagram/linkedin/facebook/print) with style and length options.

Usage:
1. Build: `cmake -S . -B build && cmake --build build -j` (or `g++ -std=c++17 -O2 -Isrc src/*.cpp -o build/gis_chatbot`)
2. Run: `./build/gis_chatbot`

Commands in REPL:
- Type a natural-language question, e.g., "What internships are available?"
- `/ad platform=twitter style=energetic length=short focus=careers cta="Apply Now" geo=NYC`
- `/help`, `/sections`, `/quit`

Note: Information is based on the page content provided by the user as of March 12, 2026. Verify details with BMCC before making decisions.
