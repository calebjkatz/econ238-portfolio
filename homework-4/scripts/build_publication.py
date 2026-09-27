#!/usr/bin/env python3
"""Build the webpage and print source from editable templates and generated data."""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
tables=json.loads((ROOT/'assets/data/tables.json').read_text())
calc=json.loads((ROOT/'assets/data/calculations.json').read_text())
replacements={'@@WEATHER_TABLE@@':tables['weather'],'@@POPULATION_TABLE@@':tables['population'],'@@FLOOD_TABLE@@':tables['flood'],'@@DECLINE@@':f"{calc['population_adjusted_decline_percent']:.2f}"}
for template,target in [('page.html','index.html'),('poster.html','poster/poster.html')]:
    text=(ROOT/'scripts/templates'/template).read_text()
    for key,value in replacements.items():text=text.replace(key,value)
    assert '@@' not in text
    (ROOT/target).write_text(text)
print('Built webpage and poster HTML from shared CSV-derived tables.')
