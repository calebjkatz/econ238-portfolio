# Risk Didn't Disappear. Vulnerability Changed.

Completed Homework 4 webpage and matching one-page 18 × 24 inch poster. Existing assignments are unchanged. The only evidence-provenance limitation is the exact annual population extract/vintage: supplied decade populations are preserved, but several do not reconcile to the linked historical archive. This is disclosed in the webpage and poster.

## Source of truth

- `assets/data/weather_mortality_decades.csv`: the nine periods supplied by Caleb, unchanged. All 27 hazard averages independently match the NWS 1940–2025 annual table to the supplied precision. The 2020–25 period is partial and includes preliminary 2025 data.
- `assets/data/population_decades.csv`: eight supplied complete-decade populations, mortality averages, and three-decimal rates, unchanged. No population average was silently substituted.
- `assets/data/flood_migration_summary.csv`: published qualitative/approximate results, not a fabricated annual time series. Approximation signs and the block/parcel distinction are retained.
- `scripts/templates/page.html` and `scripts/templates/poster.html`: editable prose. Edit these, then rebuild, rather than editing generated outputs.
- `assets/style.css` and `poster/poster.css`: webpage and physical print layouts.

## Rebuild

Python 3 with Matplotlib is required for figures. Node.js with `playwright-core` and `pdf-lib`, plus Chrome/Chromium, is required for PDF export. Dependencies need not be installed in this repository.

From the repository root:

```sh
python3 homework-4/scripts/build_charts.py
python3 homework-4/scripts/build_publication.py
node homework-4/scripts/export_poster.cjs
```

When Node dependencies are installed elsewhere, set `NODE_PATH` to that installation's `node_modules` directory. Set `CHROME_EXECUTABLE` if Chrome is not in its standard macOS location. The exporter opens the local print HTML, checks loaded images and overflow, and verifies exactly one 1296 × 1728 point page before writing the PDF. This equals 18 × 24 inches at 72 points per inch. It does not shrink a multipage document to fit.

The QR code is a vector SVG linking to `https://calebjkatz.github.io/econ238-portfolio/homework-4/`; it is fixed unless the publication URL changes. It was generated with the `qrcode` Node package using error correction M and a four-module margin.

`build_charts.py` validates category sums, supplied rate rounding, period completion, and cross-file consistency; generates the two vector SVGs; and writes derived calculations and HTML data tables. `build_publication.py` inserts the same CSV-derived tables into the webpage and poster. No chart observation is independently hard-coded in SVG or HTML.

## Calculations

Death intensity = average annual combined deaths / average decade population × 1,000,000. Relative decline = 1 − (2010s intensity / 1940s intensity). The unrounded result is approximately 67.9295%; raw deaths decline approximately 25.6195%. See `assets/data/calculations.json`.

Do not infer that adaptation caused this decline. Hazard changes, exposure, composition, event timing, reporting, and classification can also affect the comparison. NWS hurricane counts do not include every associated tropical-cyclone death. NWS reporting geography and national population normalization are discussed in the methods.

## Preview and publication

Run `python3 -m http.server 8000` from the repository root, then open `http://localhost:8000/homework-4/`. All styles, figures, data links, and poster links are relative. Both poster links work without JavaScript. The original EETT Brainstorm Log is private and is not included.
