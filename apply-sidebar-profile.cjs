const fs = require('fs');

let content = fs.readFileSync('dashboard.html', 'utf8');

// 1. Remove Profile Dropdown from header
const profileDropdownStart = content.indexOf('<!-- Profile Dropdown Container -->');
const mobileOverlayStart = content.indexOf('<!-- Mobile Overlay for Dropdown -->');
const headerEnd = content.indexOf('</header>');

if (profileDropdownStart !== -1 && mobileOverlayStart !== -1) {
  // We want to replace everything from <!-- Profile Dropdown Container --> up to </header>
  // Wait, there's script tags for toggleProfileDropdown inside.
  // Actually, let's just find the exact block and replace it.
  const beforeProfile = content.substring(0, profileDropdownStart);
  
  // We need to inject the hamburger menu button here
  const hamburgerBtn = `
        <!-- Mobile Menu Toggle -->
        <button onclick="toggleRightSidebar()" class="w-10 h-10 rounded-lg bg-gray-50 flex md:hidden items-center justify-center text-slate-600 hover:bg-gray-100 transition-colors ml-2 relative z-[950]">
          <i data-lucide="menu" class="w-5 h-5"></i>
        </button>
      </div>
    </div>
  </header>`;

  content = beforeProfile + hamburgerBtn + content.substring(headerEnd + '</header>'.length);
}

// 2. Replace the Right Sidebar
const asideStart = content.indexOf('<!-- Left Persistent Sidebar (Desktop Only) -->');
const asideEnd = content.indexOf('</aside>') + '</aside>'.length;

if (asideStart !== -1 && asideEnd !== -1) {
  const beforeAside = content.substring(0, asideStart);
  const afterAside = content.substring(asideEnd);

  const newSidebar = `
    <!-- Right Sidebar (Profile Menu) -->
    <aside id="rightSidebar" class="flex flex-col fixed top-[80px] md:top-[90px] right-0 w-[260px] md:w-[280px] h-[calc(100vh-80px)] md:h-[calc(100vh-90px)] bg-white border-l border-gray-100 shadow-2xl md:shadow-[-10px_0_30px_rgba(0,0,0,0.02)] z-[100] transform translate-x-full md:translate-x-0 transition-transform duration-300">
      
      <!-- User Info Header -->
      <div class="p-6 border-b border-gray-50 bg-gray-50/30">
        <h4 class="font-bold text-slate-950 text-lg">Rajesh Kumar</h4>
        <p class="text-xs font-medium text-gray-500 mt-1">rajesh@example.com</p>
        <div class="mt-3 inline-flex items-center gap-1.5 bg-red-100 px-2.5 py-1.5 rounded-md">
          <i data-lucide="building-2" class="w-3.5 h-3.5 text-red-600"></i>
          <span class="text-[10px] font-bold text-red-700 uppercase tracking-wider">Builder</span>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="p-4 flex flex-col gap-2 flex-1 overflow-y-auto custom-scrollbar">
        <button onclick="toggleEditProfile()" class="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-gray-50 text-sm font-bold text-slate-700 hover:text-slate-950 transition-colors w-full text-left">
          <div class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm shrink-0">
            <i data-lucide="user-cog" class="w-5 h-5 text-slate-500"></i>
          </div>
          Update Profile
        </button>
        <a href="#" class="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-gray-50 text-sm font-bold text-slate-700 hover:text-slate-950 transition-colors">
          <div class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm shrink-0">
            <i data-lucide="check-circle" class="w-5 h-5 text-green-500"></i>
          </div>
          Approved Property
        </a>
        <a href="#" class="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-gray-50 text-sm font-bold text-slate-700 hover:text-slate-950 transition-colors">
          <div class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm shrink-0">
            <i data-lucide="x-circle" class="w-5 h-5 text-amber-500"></i>
          </div>
          Unapproved Property
        </a>
        <button class="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-gray-50 text-sm font-bold text-slate-700 hover:text-slate-950 transition-colors w-full text-left">
          <div class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm shrink-0">
            <i data-lucide="arrow-left-right" class="w-5 h-5 text-slate-500"></i>
          </div>
          Change Role
        </button>
        
        <div class="h-px bg-gray-100 my-2 mx-4"></div>
        
        <a href="/login.html" class="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-red-50 text-sm font-bold text-red-600 transition-colors w-full text-left">
          <div class="w-10 h-10 rounded-full bg-white border border-red-100 flex items-center justify-center shadow-sm shrink-0">
            <i data-lucide="log-out" class="w-5 h-5 text-red-500"></i>
          </div>
          Log Out
        </a>
        
        <!-- Duplicated Log out exactly as in image -->
        <a href="/login.html" class="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-red-50 text-sm font-bold text-red-600 transition-colors w-full text-left">
          <div class="w-10 h-10 rounded-full bg-white border border-red-100 flex items-center justify-center shadow-sm shrink-0">
            <i data-lucide="log-out" class="w-5 h-5 text-red-500"></i>
          </div>
          Log Out
        </a>
      </div>
    </aside>

    <!-- Mobile Overlay for Sidebar -->
    <div id="mobileSidebarOverlay" onclick="toggleRightSidebar()" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[90] opacity-0 pointer-events-none transition-opacity duration-300 md:hidden"></div>
`;

  content = beforeAside + newSidebar + afterAside;
}

// 3. Inject the JS toggle function
const jsToInject = `
    function toggleRightSidebar() {
      const sidebar = document.getElementById('rightSidebar');
      const overlay = document.getElementById('mobileSidebarOverlay');
      
      if (sidebar.classList.contains('translate-x-full')) {
        sidebar.classList.remove('translate-x-full');
        sidebar.classList.add('translate-x-0');
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        overlay.classList.add('opacity-100');
      } else {
        sidebar.classList.add('translate-x-full');
        sidebar.classList.remove('translate-x-0');
        overlay.classList.add('opacity-0', 'pointer-events-none');
        overlay.classList.remove('opacity-100');
      }
    }
`;

content = content.replace('if (typeof lucide !== \'undefined\') {', jsToInject + '\n\n    if (typeof lucide !== \'undefined\') {');

fs.writeFileSync('dashboard.html', content);
console.log('Sidebar replaced with profile menu successfully');
