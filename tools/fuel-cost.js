
function $(id){return document.getElementById(id);}
const defaults = { metric:{sedan:15,suv:10,hybrid:22,ev:6}, imperial:{sedan:35,suv:24,hybrid:52,ev:3.5} };
function setDefaults(){ const u=$('units').value, v=$('vehicle').value; $('efficiency').value = defaults[u][v]; }
function addSegment(val=''){ const wrap=$('segments'); const div=document.createElement('div'); div.className='row'; div.innerHTML = `<input class='input seg' type='number' placeholder='distance' value='${val}'/><button class='btn' type='button' onclick='this.parentNode.remove()'>Remove</button>`; wrap.appendChild(div); }
document.addEventListener('DOMContentLoaded', ()=>{
  setDefaults(); addSegment('120'); addSegment('240');
  $('units').addEventListener('change', setDefaults);
  $('vehicle').addEventListener('change', setDefaults);
  $('addSegment').addEventListener('click', ()=>addSegment(''));
  $('calc').addEventListener('click', ()=>{
    const u=$('units').value, v=$('vehicle').value, passengers=Math.max(1,parseInt($('passengers').value||'1')), eff=parseFloat($('efficiency').value||'0'), price=parseFloat($('price').value||'0'), extras=parseFloat($('extras').value||'0'), speed=parseFloat($('speed').value||'80'), co2f=parseFloat($('co2').value||'2.31');
    const segs=Array.from(document.querySelectorAll('.seg')).map(i=>parseFloat(i.value||'0')).filter(n=>n>0);
    if(segs.length===0 || eff<=0 || price<=0){ alert('Enter segments, efficiency and price'); return; }
    const distance = segs.reduce((a,b)=>a+b,0);
    const fuelNeeded = distance / eff;
    const baseCost = fuelNeeded * price;
    const totalCost = baseCost * (1 + extras);
    const per = totalCost / passengers;
    const hours = distance / speed;
    const co2 = (v==='ev')?0:(fuelNeeded * co2f);
    $('r-distance').textContent = distance.toFixed(1) + (u==='metric'?' km':' mi');
    $('r-fuel').textContent = fuelNeeded.toFixed(2) + (v==='ev'?' kWh':(u==='metric'?' L':' gal'));
    $('r-cost').textContent = $('currency').value + ' ' + totalCost.toFixed(2);
    $('r-per').textContent = $('currency').value + ' ' + per.toFixed(2);
    $('r-time').textContent = hours.toFixed(1) + ' h';
    $('r-co2').textContent = co2.toFixed(1) + ' kg';
    document.getElementById('results').style.display='block';
    const text = encodeURIComponent(`Trip: ${distance.toFixed(1)} km, cost ${$('currency').value} ${totalCost.toFixed(2)} (per ${$('currency').value} ${per.toFixed(2)})`);
    $('share-w').href = `https://wa.me/?text=${text}`;
    $('share-t').href = `https://twitter.com/intent/tweet?text=${text}`;
    $('save-l').onclick = ()=>{ const payload={ts:Date.now(),distance,fuelNeeded,totalCost,per,hours,co2,segs}; const arr=JSON.parse(localStorage.getItem('tch_fuel')||'[]'); arr.unshift(payload); localStorage.setItem('tch_fuel',JSON.stringify(arr.slice(0,20))); alert('Saved locally to browser.'); };
    $('dl-json').onclick = ()=>{ const payload={distance,fuelNeeded,totalCost,per,hours,co2,segs}; const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='fuel-estimate.json'; a.click(); URL.revokeObjectURL(url); };
  });
});
