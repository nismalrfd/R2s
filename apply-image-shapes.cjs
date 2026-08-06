const fs = require('fs');

let content = fs.readFileSync('dashboard.html', 'utf8');

// 1. Replace User Info Header in Sidebar
const oldSidebarHeader = `      <!-- User Info Header -->
      <div class="p-6 border-b border-gray-50 bg-gray-50/30">
        <h4 class="font-bold text-slate-950 text-lg">Rajesh Kumar</h4>
        <p class="text-xs font-medium text-gray-500 mt-1">rajesh@example.com</p>
        <div class="mt-3 inline-flex items-center gap-1.5 bg-red-100 px-2.5 py-1.5 rounded-md">
          <i data-lucide="building-2" class="w-3.5 h-3.5 text-red-600" aria-hidden="true"></i>
          <span class="text-[10px] font-bold text-red-700 uppercase tracking-wider">Builder</span>
        </div>
      </div>`;

const newSidebarHeader = `      <!-- User Info Header -->
      <div class="relative pt-12 pb-6 px-6 border-b border-gray-50 bg-white flex flex-col items-center text-center overflow-hidden">
        <!-- SVG Wave Background -->
        <div class="absolute top-0 left-0 w-full h-[120px] z-0">
          <svg viewBox="0 0 400 150" preserveAspectRatio="none" class="w-full h-full opacity-30">
            <path d="M0,0 L400,0 L400,100 C300,150 100,50 0,100 Z" fill="#2563EB"></path>
            <path d="M0,0 L400,0 L400,60 C250,120 150,20 0,80 Z" fill="#3B82F6"></path>
          </svg>
        </div>
        
        <!-- Avatar -->
        <div class="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white mb-4">
          <span class="text-3xl font-light text-blue-500">R</span>
          <!-- Online indicator -->
          <div class="absolute bottom-0 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        
        <!-- Details -->
        <h4 class="relative z-10 font-bold text-slate-950 text-lg">Rajesh Kumar</h4>
        <p class="relative z-10 text-xs font-medium text-gray-500 mt-1 mb-3">rajesh@example.com</p>
        <div class="relative z-10 inline-flex items-center gap-1.5 bg-red-50 border border-red-100 px-3 py-1 rounded-full">
          <i data-lucide="building-2" class="w-3 h-3 text-red-500" aria-hidden="true"></i>
          <span class="text-[10px] font-bold text-red-600 uppercase tracking-wider">Builder</span>
        </div>
      </div>`;

content = content.replace(oldSidebarHeader, newSidebarHeader);

// 2. Add Topographical background to the page header area (body bg)
// The user's image shows a subtle topographical wavy background behind the main "Welcome back, Rajesh Kumar".
// I'll add an SVG pattern to the absolute background mesh.
const topoPattern = `
    <!-- Topographical SVG Pattern -->
    <svg class="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="topo" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M0 100 Q 25 50 50 100 T 100 100 M0 50 Q 25 0 50 50 T 100 50" fill="none" stroke="#2563EB" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#topo)" />
    </svg>
`;
content = content.replace('<!-- Floating Outline Ring -->', topoPattern + '\n    <!-- Floating Outline Ring -->');


// 3. Convert Card styling to match the image: Bottom gradient border instead of top accent.
content = content.replace(/top-accent-blue/g, 'overflow-hidden border-b-0 relative');

// We need to inject the gradient line into the property cards.
// I will find the end of the property card (before the closing div of the card) and inject it.
// The easiest way via regex is to replace `onclick="openFullscreenModal()">` with `...>\n <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-red-500"></div>`
content = content.replace(/onclick="openFullscreenModal\(\)">/g, 'onclick="openFullscreenModal()">\n          <!-- Bottom Gradient Accent -->\n          <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500"></div>');

// 4. Update the layout title header slightly to match the "Welcome back, Rajesh Kumar \uD83D\uDC4B" from image
content = content.replace('<h1 class="text-3xl font-extrabold text-slate-950 mb-1">My Properties</h1>', '<p class="text-sm text-gray-500 font-medium mb-1">Welcome back,</p>\n          <h1 class="text-3xl font-extrabold text-slate-950 mb-2">Rajesh Kumar 👋</h1>');
content = content.replace('<p class="text-sm font-medium text-gray-500">Manage and view all your listed properties</p>', '<p class="text-sm font-medium text-gray-500">Manage and view all your listed properties</p>');

fs.writeFileSync('dashboard.html', content);

console.log('Applied exact layout updates from the image to dashboard.');
