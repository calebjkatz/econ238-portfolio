# Homework 4 data

The CSV files are empty schemas, not datasets. Do not interpret missing entries as zeros.

- `mortality-annual.csv`: verified annual deaths for tornadoes, floods, and hurricanes starting in 1940, plus annual U.S. population for the same geography. Preserve source URLs and document category changes, geographic coverage, vintage, and missing observations.
- `migration.csv`: use one consistent period, county boundaries, a sourced hurricane-exposure measure, and domestic migration only. Record how rates and classifications were constructed. Keep county FIPS as five-character strings.

Raw chart: sum each hazard's deaths and divide by the number of observed years in the decade. A missing year cannot enter as zero. Use matched years across deaths and populations and label partial decades explicitly.

Adjusted chart: sum deaths / sum annual populations × 1,000,000. Label this as deaths per million person-years. It is a pooled rate, not the unweighted mean of annual rates. Population adjustment does not adjust for age or spatial exposure.

Final publication still requires sourced data, actual figures, an accessible table or equivalent text description for each figure, and an interpretation based on those results. These templates do not automatically generate charts.
