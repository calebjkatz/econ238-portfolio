# Extreme Weather, Risk, and Adaptation

Public-facing Homework 4 draft. `index.html` is a standalone static page; it needs no Jekyll layout, theme change, package installation, or build step. Styles and the poster availability script are isolated under `assets/`. Existing assignments remain unchanged.

## Finish the publication

1. Edit the headline and opening in `index.html` to reflect the final supported finding.
2. Populate the header-only files in `data/` with verified inputs, retaining source URLs and methods. Add final figures in `images/` and replace the three clearly labeled figure placeholders. No invented values or chart traces have been included.
3. Replace the migration framing with the final 150–250 word evidence-based interpretation. Hurricanes are the selected hazard. Document exposure classification and distinguish domestic migration from natural increase and international immigration.
4. Complete mortality findings, comparison of rates and counts, economics interpretation, and the Burke intervention assessment. Keep NWS event counts and model-estimated temperature-attributable mortality separate.
5. Add `poster/Caleb_Katz_Econ238_HW4_Poster.pdf` (18 × 24 inches). Both relative links enable when the server returns an actual PDF content type. Do not create an empty or fake PDF.
6. Update sources, dates, definitions, chart descriptions, and methods to match the final data. Resolve the visible pending notices and then remove the draft status. Revise the caveat and conclusion if the findings require it.

## Preview

From the repository root:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/homework-4/`. Existing Markdown assignments require GitHub Pages/Jekyll to render; this HTML page works directly. A PDF request returns 404 until the real poster is added; that is handled as an unavailable download, not a functioning link.

The homepage links to `homework-4/`. All local asset and navigation links are relative to support the repository's existing GitHub Pages base path.

Only public publication material belongs here. Never add the private EETT Brainstorm Log #2 or a full homework packet.
