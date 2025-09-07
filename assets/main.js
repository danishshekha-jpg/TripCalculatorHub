
const TOOLS = [
  {title:'Fuel Cost Calculator', url:'/tools/fuel-cost.html'},
  {title:'Distance Between Cities', url:'/tools/distance.html'},
  {title:'Packing List Generator', url:'/tools/packing.html'},
  {title:'Time Zone Difference', url:'/tools/timezones.html'},
  {title:'Currency Converter', url:'/tools/currency.html'}
];
document.addEventListener('DOMContentLoaded', ()=>{
  const s = document.getElementById('site-search');
  const list = document.getElementById('search-suggestions');
  if(s){
    s.addEventListener('input', ()=>{
      const q = s.value.trim().toLowerCase();
      list.innerHTML='';
      if(!q) return;
      const hits = TOOLS.filter(t=> t.title.toLowerCase().includes(q)).slice(0,6);
      hits.forEach(h=>{
        const a = document.createElement('a'); a.href = h.url; a.textContent = h.title; a.className='badge'; a.style.display='inline-block'; a.style.margin='6px';
        list.appendChild(a);
      });
    });
  }
  const nf = document.getElementById('newsletter-form');
  if(nf){
    nf.addEventListener('submit',(e)=>{ e.preventDefault(); alert('Thanks — you are subscribed (demo).'); nf.reset(); });
  }
});
