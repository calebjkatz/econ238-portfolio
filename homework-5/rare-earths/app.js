const stages=[
 {name:'Mine production',year:'2025',china:69.2,source:'USGS'},
 {name:'Processing',year:'2024',china:87,source:'USGS'},
 {name:'NdFeB magnet mfg.',year:'2020 benchmark',china:92,source:'DOE'}
];
const elements=[
 {symbol:'Nd',name:'Neodymium',tag:'Core NdFeB magnet element',text:'Neodymium is a principal rare-earth ingredient in NdFeB magnets, the highest-strength widely used permanent magnets. It is central to motors, generators, robotics, electronics, and defense applications.',supply:'Usually handled with praseodymium as NdPr/didymium in modern supply chains.'},
 {symbol:'Pr',name:'Praseodymium',tag:'Core NdFeB magnet element',text:'Praseodymium commonly travels with neodymium through mining and separation. NdPr oxide can be converted to metal and alloyed with iron and boron for high-performance magnets.',supply:'The U.S. now produces separated NdPr oxide at Mountain Pass.'},
 {symbol:'Sm',name:'Samarium',tag:'SmCo magnets',text:'Samarium is used in samarium-cobalt magnets, valued for high-temperature performance and resistance to demagnetization. These magnets are important in demanding aerospace and defense applications.',supply:'China tightened export controls on samarium products in April 2025.'},
 {symbol:'Dy',name:'Dysprosium',tag:'Heavy rare earth',text:'Dysprosium can improve coercivity and high-temperature performance in NdFeB magnets. It is used in smaller quantities than Nd or Pr but can be strategically important.',supply:'USGS reported China accounted for all dysprosium and terbium processing in its 2024 China industry summary.'},
 {symbol:'Tb',name:'Terbium',tag:'Heavy rare earth',text:'Terbium can also improve high-temperature performance of NdFeB magnets. Heavy rare earths are a particularly difficult diversification problem because available non-Chinese feedstocks and processing volumes are smaller.',supply:'China export controls tightened on terbium products in 2025.'},
 {symbol:'Pm',name:'Promethium',tag:'Radioactive outlier',text:'Promethium is a lanthanide, but it has no stable isotopes. That makes it fundamentally different from mined magnet feedstocks such as Nd, Pr, Sm, Dy, and Tb.',supply:'It is produced in specialized nuclear contexts rather than forming a normal bulk rare-earth mining and magnet supply chain.'}
];
function renderBars(){
 const root=document.getElementById('stage-bars');
 root.innerHTML=stages.map(s=>`<div class="bar-row"><div class="bar-label"><strong>${s.name}</strong><small>${s.year} · ${s.source}</small></div><div class="bar-track"><div class="bar-china" style="width:${s.china}%"></div></div><div class="bar-value">${s.china}%</div></div>`).join('');
}
function renderElements(){
 const buttons=document.getElementById('element-buttons'),card=document.getElementById('element-card');
 buttons.innerHTML=elements.map((e,i)=>`<button class="element-btn ${i===0?'active':''}" data-i="${i}" type="button"><strong>${e.symbol}</strong><span>${e.name}</span></button>`).join('');
 const show=i=>{const e=elements[i];card.innerHTML=`<div class="symbol">${e.symbol}</div><span class="tag">${e.tag}</span><h3>${e.name}</h3><p>${e.text}</p><p class="note"><strong>Supply-chain note:</strong> ${e.supply}</p>`;buttons.querySelectorAll('button').forEach((b,j)=>b.classList.toggle('active',j===i));};
 buttons.addEventListener('click',ev=>{const b=ev.target.closest('button');if(b)show(+b.dataset.i);});show(0);
}
renderBars();renderElements();