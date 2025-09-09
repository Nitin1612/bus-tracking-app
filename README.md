
Bus Tracking App — Tailwind-ready (Vite + React + Leaflet)
=========================================================

What's new:
- Converted UI to Tailwind CSS (setup files included).
- Added sample SVG backgrounds in src/assets (bg1.svg, bg2.svg).
- Included geocoding script: src/scripts/geocode_busstops.py (run locally).
- Polished UI components for enterprise feel and mobile responsiveness.

How to run:
1. Install dependencies:
   npm install

2. Build Tailwind CSS (local dev):
   npx tailwindcss -i ./src/index.css -o ./src/tailwind-output.css --watch
   (or run the prepare:css script once to generate the CSS)

3. Start dev server:
   npm run dev

Geocoding: (removed)
- This environment cannot perform geocoding for you. To geocode all stops, run:
   pip install requests
   cd src/scripts
   python geocode_busstops.py --input ../data/busstops.json --output ../data/busstops.geocoded.json

- The script uses Nominatim; please respect usage policy and include your email in the User-Agent header inside the script.

Assets:
- Sample background images are in src/assets/

If you want, I can attempt to geocode a small subset here as a demo, but full geocoding must be run locally due to external network restrictions.


IMPORTANT: This project no longer performs runtime geocoding. Ensure `src/data/busstops.json` contains valid `lat` and `lon` for stops you want to route between. Route drawing and navigation require lat/lon in the JSON files.
