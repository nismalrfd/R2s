const fs = require('fs');

let content = fs.readFileSync('dashboard.html', 'utf8');

// 1. Move sidebar to Right
content = content.replace(
  'fixed top-[90px] left-0 w-[260px] h-[calc(100vh-90px)] bg-white border-r border-gray-100 shadow-[10px_0_30px_rgba(0,0,0,0.02)]',
  'fixed top-[90px] right-0 w-[260px] h-[calc(100vh-90px)] bg-white border-l border-gray-100 shadow-[-10px_0_30px_rgba(0,0,0,0.02)]'
);

// 2. Adjust main content padding for Right Sidebar
content = content.replace(
  'md:pl-[290px] md:pr-8 py-8',
  'md:pr-[290px] md:pl-8 py-8'
);

// 3. Remove Links from Sidebar (Discover, My Properties, Message, My Profile)
const sidebarLinksToRemoveRegex = /<a href="#" class="flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-500 font-bold hover:bg-gray-50 hover:text-slate-950 transition-colors">\s*<i data-lucide="compass"[^>]*><\/i> Discover\s*<\/a>\s*<a href="\/properties\.html" class="flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-500 font-bold hover:bg-gray-50 hover:text-slate-950 transition-colors">\s*<i data-lucide="package"[^>]*><\/i> My Properties\s*<\/a>\s*<a href="#" class="flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-500 font-bold hover:bg-gray-50 hover:text-slate-950 transition-colors">\s*<i data-lucide="message-square"[^>]*><\/i> Message\s*<\/a>\s*<button onclick="toggleEditProfile\(\)" class="flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-500 font-bold hover:bg-gray-50 hover:text-slate-950 transition-colors text-left">\s*<i data-lucide="user"[^>]*><\/i> My Profile\s*<\/button>/g;
content = content.replace(sidebarLinksToRemoveRegex, '');

// 4. Update Profile Dropdown to match Image 4 (Add Log out)
const logOutItem = `
              <div class="h-px bg-gray-100 my-2"></div>
              <a href="/login.html" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-sm font-bold text-red-600 transition-colors w-full text-left">
                <div class="w-8 h-8 rounded-full bg-white border border-red-100 flex items-center justify-center shadow-sm">
                  <i data-lucide="log-out" class="w-4 h-4 text-red-500"></i>
                </div>
                Log Out
              </a>`;

if (!content.includes('Log Out</a>') || content.indexOf('Log Out</a>') > content.indexOf('Terms & Conditions')) {
  content = content.replace(
    'Change Role\n              </button>\n            </div>\n            <!-- Logout -->',
    'Change Role\n              </button>' + logOutItem + '\n            </div>\n            <!-- Logout -->'
  );
}

// 5. Hide Stats Cards on Desktop (Image 1 request)
content = content.replace(
  '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">',
  '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 md:hidden">'
);

// 6. Grid / List Toggle Implementation
// Add id to container
content = content.replace(
  '<div class="flex flex-col gap-4">',
  '<div id="propertyListContainer" class="flex flex-col gap-4 transition-all duration-500">'
);
// Add toggle functions to buttons
content = content.replace(
  '<button class="p-2 rounded-lg bg-gray-100 text-slate-950"><i data-lucide="layout-grid" class="w-4 h-4"></i></button>',
  '<button onclick="setGridView()" id="btnGrid" class="p-2 rounded-lg text-gray-400 hover:text-slate-950 transition-colors"><i data-lucide="layout-grid" class="w-4 h-4"></i></button>'
);
content = content.replace(
  '<button class="p-2 rounded-lg text-gray-400 hover:text-slate-950"><i data-lucide="list" class="w-4 h-4"></i></button>',
  '<button onclick="setListView()" id="btnList" class="p-2 rounded-lg bg-gray-100 text-slate-950 transition-colors"><i data-lucide="list" class="w-4 h-4"></i></button>'
);

// 7. Inject CSS and JS for the Grid/List Toggle
const toggleLogic = `
  <style>
    /* Grid View Overrides */
    .grid-view {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1.5rem;
    }
    
    .grid-view .property-card {
      flex-direction: column !important;
    }
    
    .grid-view .property-card > div:first-child {
      width: 100% !important;
      height: 250px !important;
    }
    
    .grid-view .property-card .price-section {
      width: 100% !important;
      border-left: none !important;
      border-top: 1px solid #f3f4f6 !important;
      align-items: flex-start !important;
      text-align: left !important;
      padding-top: 1rem !important;
      padding-right: 0 !important;
    }
    
    .grid-view .property-card .price-section > div {
      margin-left: 0 !important;
      margin-bottom: 0.5rem !important;
    }
    
    @media (max-width: 1279px) {
      .grid-view {
        grid-template-columns: 1fr;
      }
    }
  </style>

  <script>
    function setGridView() {
      const container = document.getElementById('propertyListContainer');
      const btnGrid = document.getElementById('btnGrid');
      const btnList = document.getElementById('btnList');
      
      container.classList.add('grid-view');
      container.classList.remove('flex', 'flex-col');
      
      btnGrid.classList.add('bg-gray-100', 'text-slate-950');
      btnGrid.classList.remove('text-gray-400');
      
      btnList.classList.remove('bg-gray-100', 'text-slate-950');
      btnList.classList.add('text-gray-400');
    }

    function setListView() {
      const container = document.getElementById('propertyListContainer');
      const btnGrid = document.getElementById('btnGrid');
      const btnList = document.getElementById('btnList');
      
      container.classList.remove('grid-view');
      container.classList.add('flex', 'flex-col');
      
      btnList.classList.add('bg-gray-100', 'text-slate-950');
      btnList.classList.remove('text-gray-400');
      
      btnGrid.classList.remove('bg-gray-100', 'text-slate-950');
      btnGrid.classList.add('text-gray-400');
    }
  </script>
`;

// Add class property-card to the card divs
content = content.replace(/class="bg-white rounded-\[20px\] p-3 md:p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col xl:flex-row gap-6 items-start xl:items-center relative cursor-pointer group"/g, 'class="property-card bg-white rounded-[20px] p-3 md:p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col xl:flex-row gap-6 items-start xl:items-center relative cursor-pointer group"');

// Add class price-section to the price section
content = content.replace(/class="xl:w-\[220px\] shrink-0 flex flex-col xl:items-end justify-center py-2 xl:pr-6 border-t xl:border-t-0 xl:border-l border-gray-100 pt-4 xl:pt-0 w-full text-left xl:text-right"/g, 'class="price-section xl:w-[220px] shrink-0 flex flex-col xl:items-end justify-center py-2 xl:pr-6 border-t xl:border-t-0 xl:border-l border-gray-100 pt-4 xl:pt-0 w-full text-left xl:text-right"');


// Inject scripts and styles before </body>
content = content.replace('</body>', toggleLogic + '\n</body>');

fs.writeFileSync('dashboard.html', content);
console.log('Layout updated successfully');
