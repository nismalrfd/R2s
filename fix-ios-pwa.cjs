const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.html'));

const pwaHTML = `
  <!-- PWA Install Banner -->
  <div id="pwaInstallBanner" class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-4 md:p-6 z-[1000] transform translate-y-full transition-transform duration-700 flex items-center justify-between gap-4 rounded-t-3xl md:rounded-none md:max-w-md md:left-1/2 md:-translate-x-1/2 md:bottom-6 md:border md:shadow-2xl md:rounded-2xl">
    <div class="flex items-center gap-3 md:gap-4">
      <div class="w-12 h-12 md:w-14 md:h-14 bg-gray-50 rounded-xl flex items-center justify-center p-1.5 border border-gray-100 shrink-0">
        <img src="/LOGO.png" alt="R2s App" class="w-full h-full object-contain">
      </div>
      <div>
        <h4 class="text-slate-950 font-extrabold text-sm md:text-base">R2s Realtors App</h4>
        <p class="text-[10px] md:text-xs text-gray-500 font-semibold mt-0.5 leading-tight">Install the app to your home screen for quick access.</p>
      </div>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <button onclick="dismissPwaBanner()" class="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-full text-gray-400 hover:text-slate-950 hover:bg-gray-100 transition-colors"><i data-lucide="x" class="w-4 h-4"></i></button>
      <button onclick="installPwa()" class="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5 whitespace-nowrap">
        <i data-lucide="download" class="w-4 h-4"></i> Install App
      </button>
    </div>
  </div>

  <!-- iOS Manual Install Banner -->
  <div id="iosInstallBanner" class="hidden fixed bottom-0 left-0 w-full bg-blue-600 text-white p-4 z-[1000] flex flex-col items-center justify-center text-center rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)] md:max-w-md md:left-1/2 md:-translate-x-1/2 md:bottom-6 md:rounded-2xl pb-8 md:pb-4 transition-all duration-300">
    <button onclick="document.getElementById('iosInstallBanner').classList.add('hidden')" class="absolute top-2 right-2 p-2 text-white/70 hover:text-white"><i data-lucide="x" class="w-5 h-5"></i></button>
    <div class="w-12 h-12 bg-white rounded-xl mb-3 flex items-center justify-center p-1">
        <img src="/LOGO.png" class="w-full h-full object-contain">
    </div>
    <h4 class="font-bold text-lg mb-1">Install R2s App</h4>
    <p class="text-sm text-blue-100 mb-4 px-4 font-medium">To install this app on your iPhone:<br><br>1. Tap the <span class="inline-block bg-white/20 p-1 rounded mx-1"><i data-lucide="share" class="w-3 h-3 inline"></i> Share</span> button at the bottom of your screen.<br>2. Scroll down and select <span class="font-bold text-white">"Add to Home Screen"</span> <i data-lucide="plus-square" class="w-3 h-3 inline text-white"></i></p>
  </div>

  <script>
    let deferredPrompt;
    const pwaBanner = document.getElementById('pwaInstallBanner');

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (!localStorage.getItem('pwaBannerDismissed')) {
        setTimeout(() => {
          if(pwaBanner) pwaBanner.classList.remove('translate-y-full');
        }, 1500);
      }
    });

    function dismissPwaBanner() {
      if(pwaBanner) pwaBanner.classList.add('translate-y-full');
      localStorage.setItem('pwaBannerDismissed', 'true');
    }

    async function installPwa() {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
        dismissPwaBanner();
      } else {
        // Fallback for iOS/unsupported devices
        const iosBanner = document.getElementById('iosInstallBanner');
        if(iosBanner) iosBanner.classList.remove('hidden');
        dismissPwaBanner();
      }
    }
    
    window.addEventListener('appinstalled', () => {
      dismissPwaBanner();
    });
  </script>
`;

const navButtons = `
        <!-- Install App Button (Always visible for all devices, handles iOS gracefully) -->
        <button onclick="installPwa()" class="hidden md:flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-bold transition-colors border border-blue-100 shadow-sm z-[950]">
          <i data-lucide="download" class="w-4 h-4"></i>
          Install App
        </button>
        <button onclick="installPwa()" class="md:hidden flex w-10 h-10 rounded-full bg-blue-50 items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors relative border border-blue-100 focus:outline-none z-[950] shadow-sm">
          <i data-lucide="download" class="w-5 h-5" aria-hidden="true"></i>
        </button>
`;

const navTarget = '<button onclick="toggleNotifications()" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-slate-600 hover:bg-gray-100 hover:text-slate-950 transition-colors relative border border-transparent hover:border-gray-200 focus:outline-none z-[950]">';
const fullNavTarget = navButtons + '\n        ' + navTarget;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Wipe old PWA install banner completely if it exists
    if (content.includes('<!-- PWA Install Banner -->')) {
        const parts = content.split('<!-- PWA Install Banner -->');
        // We know the banner is inserted right before </body>
        const beforeBanner = parts[0];
        // Strip everything after the banner up to </body>
        const regex = /<\/body>/;
        content = beforeBanner + '\n</body>' + (parts.length > 1 ? parts[1].replace(/[\s\S]*?<\/body>/, '') : '');
    }

    // 2. Wipe old navbar buttons completely if they exist
    const oldNavRegex = /<!-- Install App Button.*?<\/button>\s*<button id="navInstallBtnMobile".*?<\/button>\s*/gs;
    content = content.replace(oldNavRegex, '');

    // 3. Inject new Navbar buttons (always visible)
    if (content.includes(navTarget) && !content.includes('<!-- Install App Button (Always visible')) {
        content = content.replace(navTarget, fullNavTarget);
    }

    // 4. Inject new PWA Banner at the end
    content = content.replace('</body>', pwaHTML + '\n</body>');

    fs.writeFileSync(file, content);
    console.log('Fixed iOS compatibility in ' + file);
});
