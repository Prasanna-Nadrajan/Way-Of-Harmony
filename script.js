// Small interactive enhancements for Ikigai & Kaizen site

// DOM helpers
const qs = (s, el=document) => el.querySelector(s);
const qsa = (s, el=document) => Array.from(el.querySelectorAll(s));

// Mobile nav toggle
const navToggle = qs('.nav-toggle');
const navList = qs('.nav-list');
if(navToggle && navList){
  navToggle.addEventListener('click', ()=>{
    const open = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!open));
    navList.dataset.open = String(!open);
  });
}

// Year in footer
const yearEl = qs('#year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

// Kaizen tracker
const kaizenForm = qs('#kaizen-form');
const kaizenInput = qs('#kaizen-input');
const kaizenList = qs('#kaizen-list');

const kaizens = JSON.parse(localStorage.getItem('kaizens')||'[]');
function renderKaizens(){
  kaizenList.innerHTML = '';
  kaizens.slice().reverse().forEach((item, idx)=>{
    const li = document.createElement('li');
    li.className = 'kaizen-item';
    li.innerHTML = `<span>${escapeHtml(item)}</span><button data-index="${idx}" aria-label="Remove">✕</button>`;
    kaizenList.appendChild(li);
  });
}
function escapeHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

if(kaizenForm){
  kaizenForm.addEventListener('submit', e=>{
    e.preventDefault();
    const v = kaizenInput.value.trim();
    if(!v) return;
    kaizens.push(v);
    localStorage.setItem('kaizens', JSON.stringify(kaizens));
    kaizenInput.value = '';
    renderKaizens();
  });
  kaizenList.addEventListener('click', e=>{
    if(e.target.matches('button')){
      const i = Number(e.target.dataset.index);
      if(!Number.isNaN(i)){
        kaizens.splice(kaizens.length-1-i,1);
        localStorage.setItem('kaizens', JSON.stringify(kaizens));
        renderKaizens();
      }
    }
  });
  renderKaizens();
}

// Gallery modal
const modal = qs('#modal');
const modalImg = qs('#modal-img');
const modalCaption = qs('#modal-caption');
const modalClose = qs('.modal-close');
qsa('.gallery .tile').forEach(tile => {
  tile.addEventListener('click', ()=>{
    const img = tile.querySelector('img');
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    modalCaption.textContent = tile.dataset.caption || img.alt || '';
    modal.setAttribute('aria-hidden','false');
  });
});
if(modalClose) modalClose.addEventListener('click', ()=> modal.setAttribute('aria-hidden','true'));
modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.setAttribute('aria-hidden','true') });

// Smooth scroll for internal links
qsa('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e)=>{
    const href = a.getAttribute('href');
    if(href === '#' || href === '#!') return;
    const el = document.querySelector(href);
    if(el){
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth',block:'start'});
    }
  });
});

// lightweight consent for theme (Kaizen: try changes, keep what helps)
const currentTheme = localStorage.getItem('theme');
if(currentTheme === 'dark') document.documentElement.classList.add('theme-dark');

// Example: small guided kaizen prompt (first-time user)
if(!localStorage.getItem('seen-kaizen-welcome')){
  setTimeout(()=>{
    if(confirm('Try a small Kaizen today? Add a tiny improvement you can do in 5 minutes.')){
      const v = prompt('What will you improve today?');
      if(v) {
        kaizens.push(v);
        localStorage.setItem('kaizens', JSON.stringify(kaizens));
        renderKaizens();
      }
    }
    localStorage.setItem('seen-kaizen-welcome', '1');
  }, 1800);
}

// minimal form handling for contact
const contactForm = qs('#contact-form');
if(contactForm) contactForm.addEventListener('submit', e=>{
  e.preventDefault();
  alert('Thanks — your message is sent into the ether (demo).');
  contactForm.reset();
});

// small progressive enhancements: ensure accessible focus for keyboard users
qsa('a,button,input,textarea').forEach(el=> el.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') el.click && el.click() }));