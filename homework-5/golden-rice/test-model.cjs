const assert=require('node:assert/strict');
const {defaults:d,calculate:c}=require('./model.js');
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
let v=c(d);close(v.totalRice,260);close(v.betaHarvest,798.252);close(v.betaPlate,478.9512);close(v.portionVitaminA,15.351);close(v.matchedLand,100);
v=c({...d,adoption:0});close(v.betaPlate,0);close(v.portionVitaminA,0);close(v.totalRice,260);
v=c({...d,relativeYield:80});close(v.totalRice,208);close(v.matchedLand,125);close(v.portionVitaminA,c(d).portionVitaminA);
v=c({...d,adoption:50,relativeYield:80});close(v.totalRice,234);close(v.goldenMassShare,4/9);close(v.portionVitaminA,c(d).portionVitaminA*4/9);
close(c({...d,storage:0}).betaPlate,0);close(c({...d,cooking:0}).portionVitaminA,0);close(c({...d,conversion:3.8}).portionVitaminA/c(d).portionVitaminA,12/3.8);
console.log('PASS: default arithmetic and units, zero adoption, yield/land tradeoff, mixed-harvest serving, retention, conversion sensitivity.');
