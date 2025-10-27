# Visualization Interpretation Interview Landing Page

A single-page, accessible invitation site for scheduling 30-minute interviews on variability in visualization interpretation. Built with vanilla HTML, CSS, and JavaScript so it can be hosted on any static provider.

## Features
- Semantic HTML5 layout with skip navigation, proper heading hierarchy, and WCAG 2.1 AA focus/contrast compliance.
- Academic visual aesthetic with system font stack, fluid typography, responsive grid, and gentle micro-interactions.
- Inline SVG icon set (calendar, video, shield-lock) plus an Open Graph preview graphic.
- Participation form with client-side validation, inline error messaging, and Google Apps Script integration instructions.
- JSON-LD metadata for `WebPage` and `Event`, Open Graph/Twitter tags, and print-friendly styles.

## Structure
```
assets/
  calendar.svg
  hero-pattern.svg
  preview.png
  shield-lock.svg
  video.svg
index.html
styles.css
script.js
```

## Local Preview
Open `index.html` directly in a browser or serve the folder with a lightweight static server:

```bash
python -m http.server 8000
```

## Configure Google Apps Script Endpoint
1. Create a Google Sheet named (for example) `Interview Responses` with headers: `timestamp`, `role`, `roleOther`, `experience`, `affiliation`, `timezone`, `name`, `email`, `alternate`, `nonce`.
2. Open the Sheet, choose **Extensions → Apps Script**, and paste the sample handler from the top of `script.js`, adjusting column order if needed.
3. Deploy as a web app (**Deploy → Test deployments → Select type: Web app**) with **Execute as: Me** and **Who has access: Anyone with the link**.
4. Copy the generated URL and replace `REPLACE_WITH_YOUR_WEB_APP_URL` in `script.js`.
5. Publish the site, then submit the form to confirm the sheet receives entries.

## Optional Assets
To regenerate the Open Graph preview image, ensure the Python virtual environment is active and run:

```bash
/Users/tapendra/Desktop/PerVar/Interview/.venv/bin/python scripts/create_preview.py
```

This uses Pillow to render `assets/preview.png`. Update the script if you need different colors or copy.

## Deployment
Upload the folder contents to any static host (GitHub Pages, Netlify, Vercel, Azure Static Web Apps, etc.). Ensure HTTPS is enabled so the form can post to Google Apps Script without mixed-content issues.
