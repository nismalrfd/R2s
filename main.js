// --- Global Page Transition Loader ---

const SVG_NS = 'http://www.w3.org/2000/svg';

function createParticleLoader(containerId, isMinimal = false) {
  const lerp = (a,b,t) => a + (b-a)*t;
  const clamp01 = t => Math.max(0, Math.min(1, t));
  const ease = t => t<0.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2;

  const CX = 150, CY = 150, R = 62;
  const RED_SLOTS = new Set([2, 5, 9, 13, 17]);
  const COUNT = 24;

  function targetXY(i){
    const golden = 137.508 * Math.PI/180;
    const angle = i * golden;
    const r = R * Math.sqrt((i+0.5)/COUNT);
    return { x: CX + Math.cos(angle)*r, y: CY + Math.sin(angle)*r*0.9 };
  }

  const particles = [];
  for (let i=0; i<COUNT; i++){
    const t = targetXY(i);
    const angle = Math.random()*Math.PI*2;
    const dist = 140 + Math.random()*40;
    particles.push({
      targetX: t.x, targetY: t.y,
      startX: CX + Math.cos(angle)*dist,
      startY: CY + Math.sin(angle)*dist,
      size: RED_SLOTS.has(i) ? 13 : 8 + (i%3)*2,
      color: RED_SLOTS.has(i) ? '#dc2626' : '#0f172a',
      delay: (i / COUNT) * 0.35
    });
  }

  const group = document.getElementById(containerId);
  if(!group) return null;
  
  particles.forEach(p => {
    const r = document.createElementNS(SVG_NS,'rect');
    r.setAttribute('width', p.size);
    r.setAttribute('height', p.size);
    r.setAttribute('rx', 3);
    r.setAttribute('fill', p.color);
    group.appendChild(r);
    p.el = r;
  });

  const DURATION = 2200;
  let start = null;
  let animationFrameId = null;

  function frame(ts){
    if (start === null) start = ts;
    const elapsed = (ts - start) % DURATION;
    const progress = elapsed / DURATION;
    update(progress, ts);
    animationFrameId = requestAnimationFrame(frame);
  }

  function update(progress, ts){
    particles.forEach(p => {
      let x, y, opacity = 1;
      if (progress <= 0.4){
        const t = ease(clamp01((progress) / (0.4 - p.delay*0.3)));
        x = lerp(p.startX, p.targetX, t);
        y = lerp(p.startY, p.targetY, t);
        opacity = lerp(0.15, 1, t);
      } else if (progress <= 0.75){
        const pulse = Math.sin(ts/380 + p.delay*6) * 1.5;
        x = p.targetX; y = p.targetY + pulse;
        opacity = 1;
      } else {
        const t = ease(clamp01((progress - 0.75) / 0.25));
        x = lerp(p.targetX, p.startX, t);
        y = lerp(p.targetY, p.startY, t);
        opacity = lerp(1, 0.15, t);
      }

      const half = p.size/2;
      p.el.setAttribute('x', x - half);
      p.el.setAttribute('y', y - half);
      p.el.setAttribute('opacity', opacity);
    });
  }

  animationFrameId = requestAnimationFrame(frame);
  
  return () => {
    cancelAnimationFrame(animationFrameId);
  };
}


// INITIAL BOOT LOADER (Full Screen White)
const _loaderHTML = `
  <div id="global-page-loader" class="fixed inset-0 bg-white z-[999999] flex flex-col items-center justify-center transition-opacity duration-500">
    <style>
      #global-page-loader .scene-wrap { width: min(46vw, 170px); aspect-ratio: 1/1; }
      #global-page-loader .scene-wrap svg { width: 100%; height: 100%; display: block; overflow: visible; }
    </style>
    <div class="scene-wrap">
      <svg viewBox="0 0 300 300" id="scene">
        <g id="particles-boot"></g>
      </svg>
    </div>
  </div>
`;
document.body.insertAdjacentHTML('afterbegin', _loaderHTML);
const stopAnim = createParticleLoader('particles-boot');

window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('global-page-loader');
    if(loader) {
      loader.classList.add('opacity-0');
      setTimeout(() => {
        loader.remove(); 
        if(stopAnim) stopAnim();
      }, 500);
    }
  }, 600);
});

// MINIMAL NAVIGATION LOADER
function showMinimalLoader(callback) {
  const _minimalHTML = `
    <div id="minimal-nav-loader" class="fixed inset-0 bg-white z-[999999] flex flex-col items-center justify-center opacity-0 transition-opacity duration-300 pointer-events-none">
      <style>
        #minimal-nav-loader .scene-wrap { width: min(46vw, 170px); aspect-ratio: 1/1; }
        #minimal-nav-loader .scene-wrap svg { width: 100%; height: 100%; display: block; overflow: visible; }
      </style>
      <div class="scene-wrap">
        <svg viewBox="0 0 300 300" id="scene-nav">
          <g id="particles-nav"></g>
        </svg>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', _minimalHTML);
  createParticleLoader('particles-nav', true);
  
  const loader = document.getElementById('minimal-nav-loader');
  
  // Trigger fade in
  requestAnimationFrame(() => {
    loader.classList.remove('opacity-0');
  });

  // Execute callback after small delay to let animation play
  setTimeout(() => {
    callback();
  }, 450);
}

document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href) {
        const href = link.getAttribute('href');
        if (!href.startsWith('#') && !href.startsWith('javascript') && link.target !== '_blank' && link.origin === window.location.origin) {
            e.preventDefault();
            showMinimalLoader(() => {
              window.location.href = link.href;
            });
        }
    }
});

// Initialize Lucide Icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// Global utility for page transitions
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-transition');
});

// --- Storage Utility for Testing ---
window.getProperties = function() {
  const props = localStorage.getItem('r2s_properties');
  return props ? JSON.parse(props) : [];
};

// Returns only the properties added by whoever is currently logged in.
window.getMyProperties = function() {
  const currentUser = localStorage.getItem('r2s_current_user');
  const all = window.getProperties();
  if (!currentUser) return all; // no login info yet — fall back to showing all
  return all.filter(p => p.addedBy === currentUser);
};

window.saveProperty = function(property) {
  const props = window.getProperties();
  property.id = Date.now().toString();
  property.addedBy = localStorage.getItem('r2s_current_user') || 'unknown';
  
  // Format date like '21 Jan 2026'
  const date = new Date();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  property.date = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  
  props.unshift(property);
  localStorage.setItem('r2s_properties', JSON.stringify(props));
};


// Req. 8: mask a buyer's contact number everywhere it's shown in general
// lists/dashboards/reports. Example from the spec: 91XXX88152 — keep the
// country code + first digit and the last 5 digits, mask the middle.
// NOTE: this is a display-layer convenience only. The real access control
// must happen server-side (see api/get-buyer-leads.js) — never rely on
// this function alone to keep a full number out of the page's data.
window.maskPhoneNumber = function(number) {
  const digits = String(number || '').replace(/\D/g, '');
  if (digits.length < 6) return 'XXXXXXXXXX';
  const head = digits.slice(0, digits.length - 8);
  const firstVisible = digits.slice(digits.length - 8, digits.length - 7);
  const last5 = digits.slice(-5);
  return `${head}${firstVisible}XXX${last5}`;
};

// FIX: this used to only ever show a bare checkmark/X for 1.5s with no
// text, so every failure (wrong field, duplicate name, network error,
// Zoho rejection, etc.) looked identical to the user and gave them
// nothing to act on. It now accepts an optional message, shown under
// the icon, and stays onscreen longer / until dismissed for errors so
// people actually have time to read why something failed.
window.showPremiumAlert = function(type, message) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/30 backdrop-blur-sm opacity-0 transition-opacity duration-300';
  
  const content = document.createElement('div');
  content.className = 'relative flex flex-col items-center text-center transform scale-95 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] max-w-sm';
  
  const messageHtml = message
    ? `<p class="mt-5 text-sm font-semibold text-slate-700 bg-white/90 px-4 py-2 rounded-xl shadow-md">${message}</p>`
    : '';

  const dismissHtml = type !== 'success'
    ? `<button type="button" class="alert-dismiss-btn mt-4 text-xs font-bold text-slate-500 hover:text-slate-800 underline">Dismiss</button>`
    : '';

  if (type === 'success') {
    content.innerHTML = `
      <div class="w-32 h-32 bg-white rounded-full flex items-center justify-center relative shadow-2xl">
        <div class="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500 relative z-10 transform transition-transform duration-500 hover:scale-110"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      ${messageHtml}
    `;
  } else {
    content.innerHTML = `
      <div class="w-32 h-32 bg-white rounded-full flex items-center justify-center relative shadow-2xl">
        <div class="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-20"></div>
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-red-500 relative z-10 transform transition-transform duration-500 hover:scale-110"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </div>
      ${messageHtml}
      ${dismissHtml}
    `;
  }
  
  overlay.appendChild(content);
  document.body.appendChild(overlay);
  
  requestAnimationFrame(() => {
    overlay.classList.remove('opacity-0');
    content.classList.remove('scale-95');
    content.classList.add('scale-100');
  });

  const dismiss = () => {
    overlay.classList.add('opacity-0');
    content.classList.remove('scale-100');
    content.classList.add('scale-95');
    setTimeout(() => {
      if (document.body.contains(overlay)) {
        overlay.remove();
      }
    }, 300);
  };

  const dismissBtn = content.querySelector('.alert-dismiss-btn');
  if (dismissBtn) dismissBtn.addEventListener('click', dismiss);

  // Success still auto-dismisses quickly. Errors with a message stay up
  // long enough to actually read (or until the user dismisses them);
  // errors with no message fall back to the old short auto-dismiss.
  const autoDismissMs = type === 'success' ? 1500 : (message ? 5000 : 1500);
  setTimeout(dismiss, autoDismissMs);
};