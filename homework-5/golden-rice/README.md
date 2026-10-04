# Golden Rice: Same Land. More Nourishment?

ECON 238, FOOD-59, Caleb Katz. Public exhibit: https://calebjkatz.github.io/econ238-portfolio/homework-5/golden-rice/

A dependency-free interactive exhibit about nutrition from existing farmland. Open `index.html` through any static server; no API keys, services, or build step are required.

- `model.js`: pure calculation with explicit units and defaults.
- `app.js`: accessible controls, charts, shareable query-string scenarios, CSV export.
- `data/trials.csv` and `trials.json`: all five PSBRc82 plot-yield comparisons from Swamy et al. (2021), Tables 1–2. The plus/minus fields preserve the published quantities without assigning an unverified uncertainty type.
- `data/parameters.json`: default values, assumptions, sources, and limitations.
- `test-model.cjs`: arithmetic, units, mass balance, zero-adoption, and sensitivity checks. Run `node test-model.cjs`.

Sources and limitations are displayed in the page. Different studies supply composition, agronomic comparisons, and approximate milling recovery. The model does not claim causal field yields, universal conversion efficiency, measured pesticide savings, or health outcomes. It uses only all-trans-beta-carotene and explicitly corrects dry-basis concentration for assumed moisture.

The student should review the exhibit and understand its assumptions before assignment submission. Museum submission is a separate action.
