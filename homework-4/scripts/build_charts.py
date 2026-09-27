#!/usr/bin/env python3
"""Regenerate vector figures and accessible tables from the supplied CSV inputs."""
import csv
from decimal import Decimal
import html
import json
import os
from pathlib import Path
import tempfile
os.environ.setdefault('MPLCONFIGDIR', str(Path(tempfile.gettempdir()) / 'econ238-matplotlib'))
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.colors import to_rgb

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'assets/data'
OUT = ROOT / 'images'

def read(name):
    with (DATA / name).open(newline='') as f:
        return list(csv.DictReader(f))

weather = read('weather_mortality_decades.csv')
pop = read('population_decades.csv')
flood = read('flood_migration_summary.csv')
assert len(weather) == 9 and len(pop) == 8
for row in weather:
    assert sum(Decimal(row[x]) for x in ['tornado_avg','flood_avg','hurricane_avg']) == Decimal(row['combined_avg'])
assert [r['complete_decade'] for r in weather] == ['true'] * 8 + ['false']
exact_rates = []
for mortality, population in zip(weather, pop):
    assert population['decade'][:4] == mortality['period'][:4]
    assert population['combined_avg_deaths'] == mortality['combined_avg']
    rate = Decimal(population['combined_avg_deaths']) / Decimal(population['average_population']) * 1_000_000
    # Preserve the supplied three-decimal values, including their rounding precision.
    assert abs(rate - Decimal(population['deaths_per_million'])) < Decimal('0.001')
    exact_rates.append(float(rate))
decline = (1 - exact_rates[-1] / exact_rates[0]) * 100
raw_decline = (1 - float(weather[7]['combined_avg']) / float(weather[0]['combined_avg'])) * 100
summary = {'calculated_rates': exact_rates, 'population_adjusted_decline_percent': decline,
           'raw_death_decline_percent': raw_decline,
           'population_growth_percent': (int(pop[-1]['average_population']) / int(pop[0]['average_population']) - 1) * 100,
           'rate_formula': 'combined_avg_deaths / average_population * 1000000',
           'plotted_rates': 'supplied deaths_per_million values; exact derived rates retained above'}
(DATA / 'calculations.json').write_text(json.dumps(summary, indent=2) + '\n')
plt.rcParams.update({'font.family': 'Arial', 'font.size': 17, 'svg.fonttype': 'none',
                     'svg.hashsalt': 'econ238-hw4', 'axes.edgecolor': '#bbc6be', 'text.color': '#1b302d',
                     'axes.labelcolor': '#1b302d','xtick.color':'#384d46','ytick.color':'#384d46'})
COLORS = ['#173c39', '#36799b', '#ac542e']

def axes_style(ax):
    ax.set_facecolor('none')
    ax.set_axisbelow(True)
    ax.yaxis.grid(True, color='#dce1d9', linewidth=.7)
    ax.tick_params(axis='both',length=0,pad=8)
    for spine in ['top','right','left']: ax.spines[spine].set_visible(False)

def save(fig, stem):
    fig.savefig(OUT / (stem + '.svg'), transparent=True, metadata={'Date': None})
    svg_path = OUT / (stem + '.svg')
    svg_path.write_text('\n'.join(line.rstrip() for line in svg_path.read_text().splitlines()) + '\n')
    plt.close(fig)

fig, ax = plt.subplots(figsize=(11.2, 4.8))
fig.subplots_adjust(left=.07,right=.99,top=.85,bottom=.17)
axes_style(ax)
x=list(range(9)); bottom=[0.0]*9
for column, color, label in zip(['tornado_avg','flood_avg','hurricane_avg'], COLORS, ['Tornado','Flood','Hurricane']):
    heights=[float(r[column]) for r in weather]
    bars=ax.bar(x,heights,bottom=bottom,width=.62,color=color,label=label)
    bars[-1].set_facecolor(tuple(.75 + .25 * c for c in to_rgb(color)))
    bars[-1].set_hatch('///'); bars[-1].set_edgecolor(color)
    bottom=[a+b for a,b in zip(bottom,heights)]
for i,row in enumerate(weather):
    ax.text(i,float(row['combined_avg'])+8,row['combined_avg'],ha='center',va='bottom',fontsize=15)
ax.axvline(7.55,color='#72867a',linestyle=(0,(3,4)),linewidth=1)
ax.set_xticks(x,[r['period'][:4]+'s' for r in weather[:8]]+['2020–25\npartial'])
ax.set_ylim(0,360);ax.set_yticks([0,100,200,300])
ax.set_title('Average annual deaths · Tornado + Flood + Hurricane',loc='left',fontsize=16,pad=46)
ax.legend(loc='upper left',bbox_to_anchor=(0,1.13),ncol=3,frameon=False,handlelength=1.2,columnspacing=2)
save(fig,'mortality-by-decade')

fig, ax = plt.subplots(figsize=(11.2,4.8))
fig.subplots_adjust(left=.07,right=.985,top=.87,bottom=.17)
axes_style(ax)
y=[float(r['deaths_per_million']) for r in pop]
ax.plot(range(8),y,color=COLORS[0],linewidth=2.5,marker='o',markersize=7)
ax.fill_between(range(8),y,0,color=COLORS[0],alpha=.045)
ax.set_xticks(range(8),[r['decade'] for r in pop]);ax.set_xlim(-.25,7.5)
ax.set_ylim(0,2.25);ax.set_yticks([0,.5,1,1.5,2],['0','0.5','1.0','1.5','2.0'])
ax.set_title('Combined annual deaths per million U.S. residents',loc='left',fontsize=16,pad=22)
ax.annotate('1.91',xy=(0,y[0]),xytext=(10,12),textcoords='offset points',fontsize=20,color=COLORS[0],weight='bold')
ax.annotate('0.61',xy=(7,y[-1]),xytext=(-10,16),textcoords='offset points',fontsize=20,color=COLORS[0],weight='bold',ha='center')
ax.text(4.7,1.95,f'≈{decline:.0f}% lower',fontsize=24,color=COLORS[0],ha='center')
ax.text(4.7,1.7,'1940s → 2010s',fontsize=15,color='#52625c',ha='center')
save(fig,'mortality-per-million')

# Create HTML table fragments from the same CSV rows. build_publication.py embeds them.
def table(caption,headers,rows):
    esc=lambda s:html.escape(str(s))
    return '<table><caption>'+esc(caption)+'</caption><thead><tr>'+''.join('<th scope="col">'+esc(x)+'</th>' for x in headers)+'</tr></thead><tbody>'+''.join('<tr><th scope="row">'+esc(r[0])+'</th>'+''.join('<td>'+esc(x)+'</td>' for x in r[1:])+'</tr>' for r in rows)+'</tbody></table>'
fragments={
'weather': table('Average annual reported fatalities by period',['Period','Tornado','Flood','Hurricane','Combined'],[[r['period']+(' (partial; 2025 preliminary)' if r['complete_decade']=='false' else ''),r['tornado_avg'],r['flood_avg'],r['hurricane_avg'],r['combined_avg']] for r in weather]),
'population': table('Completed decades: population and combined mortality',['Decade','Average population','Deaths/year','Deaths/million/year'],[[r['decade'],f"{int(r['average_population']):,}",r['combined_avg_deaths'],r['deaths_per_million']] for r in pop]),
'flood':table('Flood exposure and migration, 1999–2023',['Measure','Finding'],[
['Flood-exposed households',f"{flood[0]['display_value']} in 1999 → {flood[1]['display_value']} in 2023"],
['Share of households exposed',flood[2]['display_value']],
['Census-block migration',flood[3]['display_value']],['Parcel-level migration',flood[4]['display_value']]])}
(DATA/'tables.json').write_text(json.dumps(fragments,indent=2)+'\n')
print(json.dumps(summary,indent=2))
