const TRIALS = [{"trial": "IRRI \u00b7 2015 wet", "golden_plot_g": 337.9, "conventional_plot_g": 327.5, "p_value": 0.121, "yield_ratio": 1.0317557251908396, "source_table": "Tab1", "source": "https://doi.org/10.1038/s41598-021-82001-0", "golden_reported_plusminus_g": 4.9, "conventional_reported_plusminus_g": 11.4}, {"trial": "IRRI \u00b7 2016 dry", "golden_plot_g": 807.5, "conventional_plot_g": 821.0, "p_value": 0.711, "yield_ratio": 0.9835566382460414, "source_table": "Tab1", "source": "https://doi.org/10.1038/s41598-021-82001-0", "golden_reported_plusminus_g": 6.3, "conventional_reported_plusminus_g": 35.8}, {"trial": "IRRI \u00b7 2016 wet", "golden_plot_g": 705.6, "conventional_plot_g": 878.1, "p_value": 0.014, "yield_ratio": 0.8035531260676461, "source_table": "Tab1", "source": "https://doi.org/10.1038/s41598-021-82001-0", "golden_reported_plusminus_g": 12.0, "conventional_reported_plusminus_g": 68.0}, {"trial": "PhilRice \u00b7 2016 dry", "golden_plot_g": 376.8, "conventional_plot_g": 404.9, "p_value": 0.583, "yield_ratio": 0.930600148184737, "source_table": "Tab2", "source": "https://doi.org/10.1038/s41598-021-82001-0", "golden_reported_plusminus_g": 5.0, "conventional_reported_plusminus_g": 17.4}, {"trial": "PhilRice \u00b7 2016 wet", "golden_plot_g": 654.7, "conventional_plot_g": 681.3, "p_value": 0.658, "yield_ratio": 0.9609569939820932, "source_table": "Tab2", "source": "https://doi.org/10.1038/s41598-021-82001-0", "golden_reported_plusminus_g": 9.8, "conventional_reported_plusminus_g": 55.5}];
const {defaults,calculate}=GoldenRiceModel;
const $=id=>document.getElementById(id);
const fields=['adoption','relativeYield','storage','conversion','yield','concentration','cooking','portion','reference'];
const format=(n,d=1)=>n.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
let params={...defaults};
function initialize(){
 const q=new URLSearchParams(location.search);
 for(const key of fields){
  const el=$(key);const raw=q.get(key);if(raw===null)continue;
  const n=Number(raw);if(!Number.isFinite(n))continue;
  if(el.tagName==='SELECT'){if([...el.options].some(o=>+o.value===n))el.value=n;}
  else if(n>=+el.min&&n<=+el.max)el.value=n;
 }
 fields.forEach(k=>$(k).addEventListener('input',update));
 $('reset').addEventListener('click',()=>{fields.forEach(k=>$(k).value=defaults[k]);$('status').textContent='Default scenario restored.';update();});
 $('share').addEventListener('click',async()=>{
  const u=new URL(location.href);u.search='';fields.forEach(k=>u.searchParams.set(k,params[k]));u.hash='experiment';
  try{await navigator.clipboard.writeText(u.href);$('status').textContent='Copied a link with your current settings.';}
  catch(e){history.replaceState(null,'',u);$('status').textContent='These settings are now in your address bar. Copy that URL to share.';}
 });
 $('download').addEventListener('click',()=>{
  const v=calculate(params), rows=[['type','name','value','unit']];
  const units={area:'ha',yield:'t paddy/ha/harvest',milling:'fraction',dryMatter:'fraction',adoption:'percent of planted area',relativeYield:'percent of conventional yield',concentration:'micrograms beta-carotene/g dry matter',storage:'percent retained',cooking:'percent retained',conversion:'micrograms beta-carotene per microgram vitamin A activity',portion:'g uncooked rice',reference:'micrograms RAE/day'};
  Object.entries(params).forEach(([k,n])=>rows.push(['input',k,n,units[k]]));
  const outputUnits={baselineRice:'t milled rice',goldenRice:'t milled rice',conventionalRice:'t milled rice',totalRice:'t milled rice',goldenMassShare:'fraction',betaHarvest:'g beta-carotene',betaStored:'g beta-carotene',betaPlate:'g beta-carotene',vitaminA:'g modeled vitamin A activity',portionVitaminA:'micrograms modeled vitamin A activity',portionPercent:'percent of selected reference',matchedLand:'ha',riceChange:'percent'};
  Object.entries(v).forEach(([k,n])=>rows.push(['output',k,n,outputUnits[k]]));
  const csv=rows.map(row=>row.map(x=>'"'+String(x).replaceAll('"','""')+'"').join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='golden-rice-scenario.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('status').textContent='Scenario downloaded with inputs, outputs, and units.';
 });
 renderTrials();update();
}
function update(){
 for(const k of fields)params[k]=+$(k).value;
 const labels={adoption:params.adoption+'%',relativeYield:format(params.relativeYield,1)+'%',storage:params.storage+'%',yield:format(params.yield,1)+' t/ha',concentration:format(params.concentration,2)+' µg/g',cooking:params.cooking+'%',portion:params.portion+' g'};
 for(const [k,v] of Object.entries(labels))$(k+'-value').textContent=v;
 const v=calculate(params);
 $('rice-result').textContent=format(v.totalRice,1)+' t';
 $('rice-change').textContent=Math.abs(v.riceChange)<0.0001?'Same output as conventional':format(Math.abs(v.riceChange),1)+'% '+(v.riceChange<0?'less':'more')+' rice than conventional';
 $('beta-result').textContent=format(v.betaPlate,0)+' g';
 $('portion-result').textContent=format(v.portionVitaminA,1)+' µg';
 $('portion-label').textContent=params.portion+' g';
 $('portion-percent').textContent=format(v.portionPercent,1)+'% of a '+params.reference+' µg daily reference';
 $('land-result').textContent=format(v.matchedLand,1)+' ha';
 let message;
 if(params.adoption===0)message='All 100 hectares remain conventional. The model credits no additional beta-carotene from Golden Rice; other sources of vitamin A are outside the comparison.';
 else if(params.storage===0||params.cooking===0)message='At zero retention, none of the modeled beta-carotene reaches the plate. Producing the trait is only one step in delivering its nutritional benefit.';
 else if(v.riceChange<-.01)message='At these settings, rice output falls '+format(-v.riceChange,1)+'%. Matching the conventional harvest would require '+format(v.matchedLand-100,1)+' additional hectares. Extra beta-carotene does not remove that land tradeoff.';
 else if(v.riceChange>.01)message='This assumed yield advantage gives '+format(v.riceChange,1)+'% more rice on the same land. It is a scenario, not an established yield advantage of Golden Rice.';
 else message='With equal yields, the same area produces the same rice mass plus additional beta-carotene. The amount that reaches the plate depends on retention and conversion.';
 $('takeaway').textContent=message;
 renderHarvest(v);renderRetention(v);
}
function renderHarvest(v){
 const max=Math.ceil(Math.max(v.baselineRice,v.totalRice)/100)*100;
 const x=n=>30+n/max*530;let svg='<title>Milled rice produced on 100 hectares</title><desc>Conventional baseline '+format(v.baselineRice)+' tonnes; selected planting mix '+format(v.totalRice)+' tonnes.</desc>';
 svg+='<text x="30" y="23" font-size="18" fill="#183b33">All conventional</text><text x="585" y="23" text-anchor="end" font-size="18" fill="#183b33">'+format(v.baselineRice)+' t</text>';
 svg+='<rect x="30" y="34" width="'+(x(v.baselineRice)-30)+'" height="22" rx="2" fill="#c6cbbd"/>';
 svg+='<text x="30" y="83" font-size="18" fill="#183b33">Selected planting mix</text><text x="585" y="83" text-anchor="end" font-size="18" fill="#183b33">'+format(v.totalRice)+' t</text>';
 svg+='<rect x="30" y="94" width="'+(x(v.conventionalRice)-30)+'" height="22" fill="#c6cbbd"/><rect x="'+x(v.conventionalRice)+'" y="94" width="'+(x(v.goldenRice)-30)+'" height="22" fill="#d8a42d"/>';
 [0,max/2,max].forEach(n=>svg+='<text x="'+x(n)+'" y="145" text-anchor="middle" font-size="15" fill="#52665c">'+format(n,0)+'</text>');
 $('harvest-chart').innerHTML=svg;
}
function renderRetention(v){
 const vals=[v.betaHarvest,v.betaStored,v.betaPlate];const labels=['In milled harvest','After storage','After cooking'];
 const max=Math.max(v.betaHarvest,1);let s='<title>Beta-carotene remaining across the harvest</title>';
 vals.forEach((n,i)=>{const y=15+i*65;s+='<text x="0" y="'+(y+21)+'" font-size="19" fill="#183b33">'+labels[i]+'</text><rect x="195" y="'+y+'" width="'+n/max*510+'" height="30" fill="'+['#e7c67a','#dfb44f','#c68e13'][i]+'"/><text x="735" y="'+(y+22)+'" font-size="21" fill="#183b33">'+format(n,1)+' g</text>';});
 $('retention-chart').innerHTML=s;
}
function renderTrials(){
 let s='<title>Golden Rice plot yield relative to conventional PSBRc82</title><desc>Ratios span 80.4% to 103.2%. Only the 2016 IRRI wet-season difference has reported p below 0.05.</desc>';
 const start=300,width=590,max=120;const x=n=>start+n/max*width;
 [0,20,40,60,80,100,120].forEach(n=>{s+='<line x1="'+x(n)+'" x2="'+x(n)+'" y1="30" y2="310" stroke="'+(n===100?'#183b33':'#d5d8c8')+'" '+(n===100?'stroke-dasharray="5 5"':'')+'/><text x="'+x(n)+'" y="338" text-anchor="middle" fill="#52665c" font-size="17">'+n+'%</text>';});
 $('trial-table').innerHTML='';
 TRIALS.forEach((t,i)=>{
  const y=48+i*53;const significant=t.p_value<.05;
  s+='<text x="0" y="'+(y+17)+'" font-size="19" fill="#183b33">'+t.trial+'</text><rect x="'+start+'" y="'+y+'" width="'+(t.yield_ratio*100/max*width)+'" height="25" fill="'+(significant?'#a76334':'#d8a42d')+'"/><text x="'+(x(t.yield_ratio*100)+10)+'" y="'+(y+19)+'" font-size="18" fill="#183b33">'+format(t.yield_ratio*100,1)+'%</text><text x="990" y="'+(y+19)+'" font-size="17" fill="#52665c">p='+t.p_value.toFixed(3)+'</text>';
  const tr=document.createElement('tr');
  for(const val of [t.trial,format(t.golden_plot_g),format(t.conventional_plot_g),format(t.yield_ratio*100,1)+'%',t.p_value.toFixed(3)]){const td=document.createElement('td');td.textContent=val;tr.appendChild(td);}
  const td=document.createElement('td'),b=document.createElement('button');b.className='button';b.type='button';b.textContent='Try ratio';b.setAttribute('aria-label','Use yield ratio from '+t.trial);b.addEventListener('click',()=>{$('relativeYield').value=(t.yield_ratio*100).toFixed(1);update();$('experiment').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});$('status').textContent='Using '+t.trial+' yield ratio, rounded to 0.1 percentage point.';});td.appendChild(b);tr.appendChild(td);$('trial-table').appendChild(tr);
 });
 $('trial-chart').innerHTML=s;
}
initialize();
