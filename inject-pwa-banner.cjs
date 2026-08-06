const fs = require('fs');
const path = require('path');

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

  <script>
    let deferredPrompt;
    const pwaBanner = document.getElementById('pwaInstallBanner');

    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e;
      
      // Unhide navbar install buttons
      const navBtn = document.getElementById('navInstallBtn');
      const navBtnMobile = document.getElementById('navInstallBtnMobile');
      if (navBtn) navBtn.classList.remove('hidden');
      // navInstallBtnMobile starts as hidden, so we remove hidden and add flex
      if (navBtnMobile) {
          navBtnMobile.classList.remove('hidden');
          navBtnMobile.classList.add('flex');
      }

      // Check if not already dismissed
      if (!localStorage.getItem('pwaBannerDismissed')) {
        // Show banner after a short delay for dramatic effect
        setTimeout(() => {
          if(pwaBanner) pwaBanner.classList.remove('translate-y-full');
        }, 1500);
      }
    });

    function dismissPwaBanner() {
      if(pwaBanner) pwaBanner.classList.add('translate-y-full');
      // Store in localStorage so it doesn't bother them for a while
      localStorage.setItem('pwaBannerDismissed', 'true');
    }

    async function installPwa() {
      if (deferredPrompt) {
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        // We no longer need the prompt
        deferredPrompt = null;
        dismissPwaBanner();
        
        // Hide navbar buttons after install
        const navBtn = document.getElementById('navInstallBtn');
        const navBtnMobile = document.getElementById('navInstallBtnMobile');
        if (navBtn) navBtn.classList.add('hidden');
        if (navBtnMobile) {
            navBtnMobile.classList.add('hidden');
            navBtnMobile.classList.remove('flex');
        }
      }
    }
    
    // Also track successful installation
    window.addEventListener('appinstalled', () => {
      dismissPwaBanner();
      const navBtn = document.getElementById('navInstallBtn');
      const navBtnMobile = document.getElementById('navInstallBtnMobile');
      if (navBtn) navBtn.classList.add('hidden');
      if (navBtnMobile) {
          navBtnMobile.classList.add('hidden');
          navBtnMobile.classList.remove('flex');
      }
    });
  </script>
`;

const swRegistrationHTML = `
  <!-- PWA Service Worker Registration -->
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('SW registered: ', registration.scope);
        }).catch(err => {
          console.log('SW registration failed: ', err);
        });
      });
    }
  </script>
`;

const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Check if manifest link exists in head
    if (!content.includes('href="/manifest.json"')) {
        content = content.replace('</head>', '  <link rel="manifest" href="/manifest.json" />\n</head>');
        changed = true;
    }

    // Check if SW registration exists
    if (!content.includes("navigator.serviceWorker.register('/sw.js')")) {
        content = content.replace('</body>', swRegistrationHTML + '\n</body>');
        changed = true;
    }

    // Check if PWA banner exists
    if (!content.includes('pwaInstallBanner')) {
        content = content.replace('</body>', pwaHTML + '\n</body>');
        changed = true;
    } else {
        // If it exists but doesn't have the download icon, replace the old banner logic
        if (!content.includes('data-lucide="download"')) {
            // Remove the old banner (crude way since we know it's at the bottom)
            const parts = content.split('<!-- PWA Install Banner -->');
            if (parts.length > 1) {
                content = parts[0] + pwaHTML + '\n</body>';
                // Note: The original file had </body> after, so this is safe assuming the banner was right before </body>
                changed = true;
            }
        } else {
            // Also update the script if it doesn't have the navBtn logic
            if (!content.includes('navInstallBtn')) {
                const parts = content.split('<!-- PWA Install Banner -->');
                if (parts.length > 1) {
                    content = parts[0] + pwaHTML + '\n</body>';
                    changed = true;
                }
            }
        }
    }

    // Inject into navbar if toggleNotifications exists
    const navTarget = '<button onclick="toggleNotifications()" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-slate-600 hover:bg-gray-100 hover:text-slate-950 transition-colors relative border border-transparent hover:border-gray-200 focus:outline-none z-[950]">';
    
    const navButtons = `
        <!-- Install App Button (Hidden by default, shown by JS when PWA is installable) -->
        <button id="navInstallBtn" onclick="installPwa()" class="hidden md:flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-bold transition-colors border border-blue-100 shadow-sm z-[950]">
          <i data-lucide="download" class="w-4 h-4"></i>
          Install App
        </button>
        <button id="navInstallBtnMobile" onclick="installPwa()" class="hidden md:hidden w-10 h-10 rounded-full bg-blue-50 items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors relative border border-blue-100 focus:outline-none z-[950] shadow-sm">
          <i data-lucide="download" class="w-5 h-5" aria-hidden="true"></i>
        </button>

        <button onclick="toggleNotifications()" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-slate-600 hover:bg-gray-100 hover:text-slate-950 transition-colors relative border border-transparent hover:border-gray-200 focus:outline-none z-[950] ">`;

    if (content.includes(navTarget) && !content.includes('navInstallBtn')) {
        content = content.replace(navTarget, navButtons);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content);
        console.log('Injected PWA features into ' + file);
    } else {
        console.log('PWA features already up to date in ' + file);
    }
});
