/* All masses are per harvest. Concentration is measured per gram dry matter.
   See data/parameters.json and the exhibit's reproducibility notes. */
(function(root) {
  const defaults = Object.freeze({area:100,yield:4,milling:0.65,dryMatter:0.86,adoption:100,relativeYield:100,concentration:3.57,storage:75,cooking:80,conversion:12,portion:100,reference:300});
  function calculate(p) {
    const a=p.adoption/100, r=p.relativeYield/100;
    const baselineRice=p.area*p.yield*p.milling;
    const goldenRice=baselineRice*a*r;
    const conventionalRice=baselineRice*(1-a);
    const totalRice=goldenRice+conventionalRice;
    const goldenMassShare=totalRice ? goldenRice/totalRice : 0;
    const betaHarvest=goldenRice*p.dryMatter*p.concentration;
    const betaStored=betaHarvest*p.storage/100;
    const betaPlate=betaStored*p.cooking/100;
    const vitaminA=betaPlate/p.conversion;
    const portionVitaminA=p.portion*p.dryMatter*goldenMassShare*p.concentration*(p.storage/100)*(p.cooking/100)/p.conversion;
    const matchedLand=p.area/(1-a+a*r);
    const fieldworkIndex=matchedLand/p.area;
    return {baselineRice,goldenRice,conventionalRice,totalRice,goldenMassShare,betaHarvest,betaStored,betaPlate,vitaminA,portionVitaminA,portionPercent:portionVitaminA/p.reference*100,matchedLand,fieldworkIndex,riceChange:(totalRice/baselineRice-1)*100};
  }
  const api={defaults,calculate};
  if(typeof module!=='undefined'&&module.exports) module.exports=api;
  else root.GoldenRiceModel=api;
})(typeof window!=='undefined'?window:globalThis);
