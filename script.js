const pages=[...document.querySelectorAll('.page')];
const links=[...document.querySelectorAll('[data-page]')];
function showPage(id){const el=document.getElementById(id)||document.getElementById('home');pages.forEach(p=>p.classList.toggle('active',p===el));document.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('active',a.dataset.page===el.id));history.replaceState(null,'','#'+el.id);window.scrollTo({top:0,behavior:'smooth'});}
links.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();showPage(a.dataset.page)}));
const initial=location.hash.slice(1);showPage(initial&&document.getElementById(initial)?initial:'home');
const search=document.getElementById('search');const cards=[...document.querySelectorAll('.rule-card')];const empty=document.getElementById('noResults');
search?.addEventListener('input',()=>{const q=search.value.toLowerCase().trim();let count=0;cards.forEach(c=>{const ok=c.innerText.toLowerCase().includes(q);c.style.display=ok?'grid':'none';if(ok)count++});empty.hidden=count!==0});
const themeBtn=document.getElementById('themeBtn');if(localStorage.getItem('og-theme')==='light')document.body.classList.add('light');function icon(){themeBtn.textContent=document.body.classList.contains('light')?'☀':'☾'}icon();themeBtn?.addEventListener('click',()=>{document.body.classList.toggle('light');localStorage.setItem('og-theme',document.body.classList.contains('light')?'light':'dark');icon()});
document.getElementById('year').textContent=new Date().getFullYear();


async function refreshServerStatus(){
  const count=document.getElementById('onlineCount');
  const status=document.getElementById('serverStatus');
  const mini=document.getElementById('livePlayersMini');
  const maxMini=document.getElementById('liveMaxMini');
  const statusText=document.getElementById('liveStatusText');
  if(!count) return;
  try{
    const res=await fetch('/api/server',{cache:'no-store'});
    const data=await res.json();
    if(!res.ok || data.error) throw new Error(data.message||'API error');
    const current=Number(data.currentPlayers ?? 0);
    const max=Number(data.maxPlayers ?? 0);
    count.textContent=`${current}${max?`/${max}`:''}`;
    status.textContent='ONLINE';
    statusText.textContent='SERVER ONLINE';
    if(mini) mini.textContent=String(current);
    if(maxMini) maxMini.textContent=String(max||'—');
  }catch(e){
    count.textContent='OFFLINE';
    status.textContent='OFFLINE';
    statusText.textContent='SERVER OFFLINE';
    if(mini) mini.textContent='—';
    if(maxMini) maxMini.textContent='—';
  }
}
refreshServerStatus();
setInterval(refreshServerStatus,30000);


const playerCountEl=document.getElementById('playerCount');
const playerListEl=document.getElementById('playerList');
const serverStatusEl=document.getElementById('serverStatus');

async function loadLivePlayers(){
  if(!playerCountEl || !playerListEl) return;
  try{
    const res=await fetch('/api/players', {cache:'no-store'});
    if(!res.ok) throw new Error('API error');
    const data=await res.json();
    const players = Array.isArray(data.players) ? data.players : [];
    const current = Number(data.currentPlayers ?? players.length ?? 0);
    const max = Number(data.maxPlayers ?? 0);

    playerCountEl.textContent = max > 0 ? `${current}/${max}` : `${current}`;
    serverStatusEl.innerHTML = '<span class="status-online"></span> Server online';

    if(players.length === 0){
      playerListEl.innerHTML = '<div class="player-empty">Nu sunt jucători online.</div>';
      return;
    }

    playerListEl.innerHTML = players.map((p, i) => {
      const name = typeof p === 'string' ? p : (p.name ?? p.username ?? 'Jucător');
      return `<div class="player-row"><span class="player-index">${String(i+1).padStart(2,'0')}</span><span class="player-name">${escapeHtml(name)}</span></div>`;
    }).join('');
  }catch(err){
    playerCountEl.textContent = '—';
    serverStatusEl.innerHTML = '<span class="status-offline"></span> Server indisponibil';
    playerListEl.innerHTML = '<div class="player-empty">Lista jucătorilor nu este disponibilă momentan.</div>';
  }
}
function escapeHtml(v){
  return String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
loadLivePlayers();
setInterval(loadLivePlayers, 30000);
