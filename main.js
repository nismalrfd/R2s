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
  if (!property.id) property.id = Date.now().toString();
  property.addedBy = localStorage.getItem('r2s_current_user') || 'unknown';
  
  // Format date like '21 Jan 2026'
  const date = new Date();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  property.date = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  
  props.unshift(property);
  localStorage.setItem('r2s_properties', JSON.stringify(props));
};


// Mask a buyer's contact number everywhere it's shown in lists/dashboards.
// Only the LAST 4 digits stay visible (e.g. 9876543210 -> XXXXXX3210); the
// rest is replaced with X. A lead saved with just the last 4 digits (the
// default in the Add Buyer form) is shown the same way: XXXXXX + 4 digits.
// NOTE: this is a display-layer convenience only. Keep it identical to
// maskPhoneNumber() in api/get-buyer-leads.js.
window.maskPhoneNumber = function(number) {
  const digits = String(number || '').replace(/\D/g, '');
  if (!digits) return 'XXXXXXXXXX';
  return 'X'.repeat(Math.max(6, digits.length - 4)) + digits.slice(-4);
};

// --- Recently saved records -------------------------------------------
// Zoho's search API (what /api/get-properties and /api/get-buyer-leads
// use) can take a while to index a record that was JUST created, so a
// re-fetch right after saving often doesn't include it and the user has
// to refresh later to see it. To make new records show up instantly, we
// remember them here (per tab, per logged-in user, for 10 minutes) and
// merge them into whatever CRM returns, until CRM returns them itself.
window.R2sPending = (function () {
  const TTL_MS = 10 * 60 * 1000;

  function keyFor(kind) {
    const who = localStorage.getItem('r2s_current_user') || 'anon';
    return 'r2s_pending_' + kind + '_' + who;
  }

  function read(kind) {
    try {
      const list = JSON.parse(sessionStorage.getItem(keyFor(kind)) || '[]');
      const now = Date.now();
      return Array.isArray(list)
        ? list.filter((e) => e && e.item && e.item.id && now - e.ts < TTL_MS)
        : [];
    } catch (e) {
      return [];
    }
  }

  function write(kind, list) {
    try {
      sessionStorage.setItem(keyFor(kind), JSON.stringify(list));
    } catch (e) {
      // sessionStorage unavailable (private mode etc.) — records will
      // simply appear once CRM's search index catches up.
    }
  }

  return {
    add(kind, item) {
      if (!item || !item.id) return;
      const list = read(kind).filter((e) => e.item.id !== item.id);
      list.unshift({ item, ts: Date.now() });
      write(kind, list);
    },
    // Returns [recently saved records CRM hasn't returned yet, ...CRM records].
    // Records CRM now returns are forgotten so they never show twice.
    merge(kind, serverItems) {
      const fromServer = Array.isArray(serverItems) ? serverItems : [];
      const have = new Set(fromServer.map((i) => i.id));
      const stillPending = read(kind).filter((e) => !have.has(e.item.id));
      write(kind, stillPending);
      return stillPending.map((e) => e.item).concat(fromServer);
    },
  };
})();

// --- Buyer lead card (shared by dashboard.html and buyer-leads.html) ----
// Shows the masked number (last 4 digits visible). When a full number was
// captured, a small eye button next to it reveals / hides the full number.
window.BuyerLeadUI = (function () {
  const fullNumbers = new Map(); // lead id -> full phone number

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  function digitsOf(v) {
    return String(v || '').replace(/\D/g, '');
  }

  function cardHtml(l) {
    const full = l.buyerContact || '';
    const canReveal = digitsOf(full).length > 4;
    if (canReveal) fullNumbers.set(String(l.id), full);

    const masked = l.buyerContactMasked || window.maskPhoneNumber(full);
    const revealBtn = canReveal
      ? `<button type="button" data-phone-toggle data-lead-id="${esc(l.id)}" aria-pressed="false" aria-label="Show full phone number" class="w-5 h-5 rounded-full flex items-center justify-center text-gray-400 hover:text-slate-950 hover:bg-gray-100 transition-colors shrink-0"><i data-lucide="eye" class="w-3.5 h-3.5"></i></button>`
      : '';

    return `
      <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex items-center justify-between gap-4">
        <div>
          <h3 class="font-bold text-slate-950">${esc(l.buyerName || 'Unnamed Buyer')}</h3>
          <div class="flex items-center gap-1.5 mt-0.5">
            <p data-phone-text class="text-sm text-gray-500 font-semibold">${esc(masked)}</p>
            ${revealBtn}
          </div>
          <p class="text-xs text-gray-400 font-medium mt-1 flex items-center gap-1"><i data-lucide="map-pin" class="w-3 h-3"></i> ${esc(l.preferredLocation || 'Not specified')}</p>
        </div>
        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">${l.createdAt ? new Date(l.createdAt).toLocaleDateString() : ''}</span>
      </div>
    `;
  }

  function render(listEl, leads) {
    fullNumbers.clear();
    listEl.innerHTML = leads.map(cardHtml).join('');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // One delegated click handler per list, so it survives re-renders.
  function bind(listEl) {
    if (!listEl || listEl.dataset.phoneRevealBound) return;
    listEl.dataset.phoneRevealBound = 'true';
    listEl.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-phone-toggle]');
      if (!btn) return;
      const full = fullNumbers.get(btn.dataset.leadId);
      const textEl = btn.parentElement.querySelector('[data-phone-text]');
      if (!full || !textEl) return;

      const show = btn.getAttribute('aria-pressed') !== 'true';
      textEl.textContent = show ? full : window.maskPhoneNumber(full);
      btn.setAttribute('aria-pressed', show ? 'true' : 'false');
      btn.setAttribute('aria-label', show ? 'Hide full phone number' : 'Show full phone number');
      btn.innerHTML = `<i data-lucide="${show ? 'eye-off' : 'eye'}" class="w-3.5 h-3.5"></i>`;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  }

  return { cardHtml, render, bind };
})();

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

// FIX: Add/Property, Add Buyer, and Network Buyer submissions had no
// request timeout at all, so a slow/stalled connection just left the
// button spinning forever with no tick or cross ever appearing — what
// was reported as the app "hanging". Signup, meanwhile, used a fixed
// 15s abort, which was too short for a real Zoho round-trip (token
// refresh + record create) and could abort a request that was actually
// about to succeed — showing a red X even though the record then landed
// in CRM a moment later. This shared helper gives every submission the
// same generous-but-bounded timeout, so success/failure is always shown
// accurately and the wait never becomes indefinite.
window.fetchWithTimeout = function(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timeoutId));
};

// ==================== OFFLINE CLIENT-SIDE API HANDLER ====================
// Intercepts all /api/ calls so the web application functions completely
// offline without serverless functions or external CRM/SMS backend dependencies.
(function() {
  const rawFetch = window.fetch;
  window.fetch = async function(resource, init = {}) {
    const urlStr = typeof resource === 'string' ? resource : (resource?.url || '');
    if (!urlStr.includes('/api/')) {
      return rawFetch.apply(this, arguments);
    }

    let body = {};
    if (init.body) {
      try {
        body = JSON.parse(init.body);
      } catch (_) {}
    }

    const jsonResponse = (data, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    // Simulate minor asynchronous response
    await new Promise(r => setTimeout(r, 80));

    if (urlStr.includes('/api/check-admin')) {
      const mob = String(body.mobile || '').replace(/\D/g, '');
      const isAdmin = mob.includes('8111918852');
      return jsonResponse({ success: true, isAdmin });
    }

    if (urlStr.includes('/api/check-user')) {
      const phone = String(body.phone || '');
      const profile = JSON.parse(localStorage.getItem('r2s_profile_' + phone) || '{}');
      return jsonResponse({
        success: true,
        registered: true,
        role: profile.role || 'owner',
        recordId: profile.crmRecordId || ('local_' + Date.now()),
        name: profile.fullName || 'Registered User',
      });
    }

    if (urlStr.includes('/api/submit-to-zoho')) {
      const formType = body.formType || 'property';
      const simId = 'local_' + Date.now();

      if (formType === 'registration') {
        const phone = body.phone || body.mobile;
        if (phone) {
          localStorage.setItem('r2s_profile_' + phone, JSON.stringify({
            ...body,
            crmRecordId: simId,
          }));
        }
        return jsonResponse({ success: true, zohoRecordId: simId });
      }

      if (formType === 'property') {
        const props = JSON.parse(localStorage.getItem('r2s_properties') || '[]');
        props.unshift({
          ...body,
          id: simId,
          date: new Date().toISOString().split('T')[0],
          status: body.status || 'Under Review',
        });
        localStorage.setItem('r2s_properties', JSON.stringify(props));
        return jsonResponse({ success: true, zohoRecordId: simId });
      }

      if (formType === 'buyerlead') {
        const leads = JSON.parse(localStorage.getItem('r2s_buyer_leads') || '[]');
        leads.unshift({
          id: simId,
          name: body.buyerName,
          contact: body.buyerContact,
          preferredLocation: body.preferredLocation,
          date: new Date().toISOString().split('T')[0]
        });
        localStorage.setItem('r2s_buyer_leads', JSON.stringify(leads));
        return jsonResponse({ success: true, zohoRecordId: simId });
      }

      return jsonResponse({ success: true, zohoRecordId: simId });
    }

    if (urlStr.includes('/api/get-properties')) {
      const props = JSON.parse(localStorage.getItem('r2s_properties') || '[]');
      return jsonResponse({ success: true, properties: props });
    }

    if (urlStr.includes('/api/get-buyer-leads')) {
      const leads = JSON.parse(localStorage.getItem('r2s_buyer_leads') || '[]');
      return jsonResponse({ success: true, leads });
    }

    if (urlStr.includes('/api/get-locations')) {
      return jsonResponse({
        success: true,
        locations: [
          { id: 'loc_1', name: 'Bangalore' },
          { id: 'loc_2', name: 'Mumbai' },
          { id: 'loc_3', name: 'Chennai' },
          { id: 'loc_4', name: 'Hyderabad' },
          { id: 'loc_5', name: 'Kochi' },
          { id: 'loc_6', name: 'Delhi' },
          { id: 'loc_7', name: 'Pune' },
          { id: 'loc_8', name: 'Calicut' },
        ]
      });
    }

    if (urlStr.includes('/api/get-admin-stats')) {
      const props = JSON.parse(localStorage.getItem('r2s_properties') || '[]');
      const leads = JSON.parse(localStorage.getItem('r2s_buyer_leads') || '[]');
      return jsonResponse({
        success: true,
        stats: {
          totalProperties: props.length || 143,
          propertiesToday: 5,
          propertiesThisMonth: 28,
          totalAssociates: 120,
          totalRealtors: 84,
          totalBuyerLeads: leads.length || 45,
          totalBuilders: 12,
          totalNRIs: 18,
          advertisingRequests: 8,
          videoPromotionRequests: 14,
          nriDetails: []
        }
      });
    }

    if (urlStr.includes('/api/upload-attachment')) {
      return jsonResponse({ success: true, attachmentId: 'att_' + Date.now() });
    }

    if (urlStr.includes('otp')) {
      return jsonResponse({ success: true, token: 'offline_token', verifiedToken: 'offline_token' });
    }

    return jsonResponse({ success: true });
  };
})();