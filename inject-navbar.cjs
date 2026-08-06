const fs = require('fs');
const files = ['add-property.html', 'dashboard.html', 'edit-profile.html', 'index.html', 'properties.html', 'property-detail.html'];

const newHeader = `
  <!-- Global Navigation Bar -->
  <header class="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-[900] transition-all duration-300">
    <div class="max-w-[1600px] mx-auto px-4 md:px-8 h-[70px] md:h-[80px] flex items-center justify-between">
      
      <!-- Left: Logo & Brand -->
      <a href="/dashboard.html" class="flex items-center gap-3 group z-[910]">
        <div class="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl group-hover:bg-red-50 transition-colors border border-gray-100 group-hover:border-red-100 shrink-0">
          <img src="/LOGO.png" alt="R2s" class="w-full h-full object-contain p-1.5">
        </div>
        <span class="text-lg md:text-xl font-extrabold tracking-tight text-slate-950 hidden sm:block">R2s Realtors</span>
      </a>

      <!-- Center: Location Pin (Hidden on small mobile) -->
      <div class="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100 cursor-pointer hover:bg-white hover:shadow-sm transition-all group z-[910]">
        <i data-lucide="map-pin" class="w-4 h-4 text-red-600 group-hover:animate-bounce"></i>
        <span class="text-sm font-semibold text-slate-700">Kozhikode, Kerala</span>
      </div>

      <!-- Center-Right: Navigation Links (Desktop) -->
      <nav class="hidden lg:flex items-center gap-8 ml-8 z-[910]">
        <a href="/dashboard.html" class="text-sm font-bold text-slate-950 hover:text-red-600 transition-colors">Find Property</a>
        <div class="relative group cursor-pointer flex items-center gap-1">
          <span class="text-sm font-bold text-slate-500 group-hover:text-red-600 transition-colors">My Properties</span>
          <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-transform group-hover:rotate-180"></i>
        </div>
        <a href="/properties.html" class="text-sm font-bold text-slate-500 hover:text-red-600 transition-colors">Agents</a>
      </nav>

      <!-- Right: Actions & Profile -->
      <div class="flex items-center gap-3 md:gap-4 ml-auto z-[910]">
        <button class="hidden md:flex w-10 h-10 rounded-full bg-gray-50 items-center justify-center text-slate-600 hover:bg-gray-100 hover:text-slate-950 transition-colors relative group border border-transparent hover:border-gray-200">
          <i data-lucide="settings" class="w-5 h-5 group-hover:rotate-45 transition-transform duration-300"></i>
        </button>
        <button class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-slate-600 hover:bg-gray-100 hover:text-slate-950 transition-colors relative border border-transparent hover:border-gray-200">
          <i data-lucide="bell" class="w-5 h-5"></i>
          <span class="absolute top-2 right-2.5 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
        </button>
        
        <!-- Profile Dropdown Container -->
        <div class="relative ml-1 md:ml-2">
          <button onclick="toggleProfileDropdown()" class="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-red-500 transition-all focus:outline-none focus:border-red-500 shadow-sm relative z-[950]">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" class="w-full h-full object-cover">
          </button>

          <!-- Dropdown Menu (Becomes Bottom Sheet on Mobile) -->
          <div id="profileDropdown" class="absolute right-0 top-[calc(100%+15px)] w-72 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 opacity-0 translate-y-4 pointer-events-none transition-all duration-300 z-[940] transform origin-top-right">
            <!-- User Info Header -->
            <div class="p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl mobile-rounded-top">
              <h4 class="font-bold text-slate-950">Rajesh Kumar</h4>
              <p class="text-xs font-medium text-gray-500 mt-0.5">rajesh@example.com</p>
              <div class="mt-2 inline-flex items-center gap-1.5 bg-red-100 px-2 py-1 rounded-md">
                <i data-lucide="building-2" class="w-3 h-3 text-red-600"></i>
                <span class="text-[10px] font-bold text-red-700 uppercase tracking-wider">Builder</span>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="p-2 flex flex-col gap-1">
              <a href="/edit-profile.html" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-bold text-slate-700 hover:text-slate-950 transition-colors">
                <div class="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                  <i data-lucide="user-cog" class="w-4 h-4 text-slate-500"></i>
                </div>
                Update Profile
              </a>
              <button class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-bold text-slate-700 hover:text-slate-950 transition-colors w-full text-left">
                <div class="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                  <i data-lucide="arrow-left-right" class="w-4 h-4 text-slate-500"></i>
                </div>
                Change Role
              </button>
            </div>
            
            <!-- Logout -->
            <div class="p-2 border-t border-gray-100">
              <a href="/login.html" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-sm font-bold text-red-600 transition-colors group pb-4 md:pb-2.5">
                <div class="w-8 h-8 rounded-full bg-white border border-red-100 flex items-center justify-center shadow-sm group-hover:bg-red-600 transition-colors">
                  <i data-lucide="log-out" class="w-4 h-4 text-red-500 group-hover:text-white transition-colors"></i>
                </div>
                Log Out
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Mobile Overlay for Dropdown -->
    <div id="mobileOverlay" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[930] opacity-0 pointer-events-none transition-opacity duration-300"></div>

    <script>
      function toggleProfileDropdown() {
        const dropdown = document.getElementById('profileDropdown');
        const overlay = document.getElementById('mobileOverlay');
        const isOpen = !dropdown.classList.contains('pointer-events-none');

        if (isOpen) {
          // Close
          dropdown.classList.add('opacity-0', 'pointer-events-none');
          dropdown.classList.remove('opacity-100');
          
          if (window.innerWidth < 768) {
            dropdown.classList.add('translate-y-full');
            dropdown.classList.remove('translate-y-0');
          } else {
            dropdown.classList.add('translate-y-4');
            dropdown.classList.remove('translate-y-0');
          }
        } else {
          // Open
          dropdown.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4', 'translate-y-full');
          dropdown.classList.add('opacity-100', 'translate-y-0');
          overlay.classList.remove('opacity-0', 'pointer-events-none');
          overlay.classList.add('opacity-100');
          
          // Apply mobile bottom-sheet styling dynamically if on small screen
          if (window.innerWidth < 768) {
             dropdown.classList.add('!fixed', '!bottom-0', '!top-auto', '!left-0', '!w-full', '!rounded-b-none', '!rounded-t-[32px]');
             dropdown.querySelector('.mobile-rounded-top').classList.add('!rounded-t-[32px]');
          }
        }
      }

      // Close on overlay click
      document.getElementById('mobileOverlay')?.addEventListener('click', toggleProfileDropdown);
    </script>
  </header>
`;

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    const headerStartIdx = content.indexOf('<header class="hidden md:flex fixed top-0');
    if (headerStartIdx !== -1) {
      const headerEndIdx = content.indexOf('</header>', headerStartIdx);
      if (headerEndIdx !== -1) {
        const oldHeaderBlock = content.substring(headerStartIdx, headerEndIdx + '</header>'.length);
        
        content = content.replace(oldHeaderBlock, newHeader);
        content = content.replace(/md:mt-\[110px\]/g, 'mt-[80px] md:mt-[90px]');
        
        fs.writeFileSync(file, content);
        console.log('Updated ' + file);
      }
    }
  }
});
