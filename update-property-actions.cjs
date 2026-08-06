const fs = require('fs');

let content = fs.readFileSync('dashboard.html', 'utf8');

// The block to replace
const oldBlock = `            <!-- Price Card -->
            <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Price</p>
              <h2 class="text-3xl font-black text-slate-950 mb-1">₹4,65,00,000</h2>
              <p class="text-xs font-semibold text-gray-400 mb-6">Inclusive of all charges</p>
              <button class="w-full bg-[#1e293b] text-white py-4 rounded-2xl font-bold shadow-md hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 mb-2">
                <i data-lucide="eye" class="w-5 h-5"></i> View property
              </button>
            </div>`;

const newBlock = `            <!-- Price Card -->
            <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Price</p>
              <h2 class="text-3xl font-black text-slate-950 mb-1">₹4,65,00,000</h2>
              <p class="text-xs font-semibold text-gray-400">Inclusive of all charges</p>
            </div>

            <!-- Status Card -->
            <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
              <h3 class="text-lg font-bold text-slate-950 mb-4">Property Status</h3>
              <div class="relative">
                <select class="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold text-sm text-slate-700 outline-none focus:ring-4 focus:ring-slate-950/5 appearance-none cursor-pointer">
                  <option value="available" selected>Available (For Sale)</option>
                  <option value="sold">Sold</option>
                  <option value="hidden">Hidden / Unlisted</option>
                </select>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <i data-lucide="chevron-down" class="w-4 h-4 text-gray-400"></i>
                </div>
              </div>
            </div>

            <!-- Actions Card -->
            <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
              <h3 class="text-lg font-bold text-slate-950 mb-4">Actions</h3>
              <div class="flex flex-col gap-1 -mx-2">
                <button onclick="editPropertyAction()" class="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 text-slate-700 font-bold text-sm transition-colors text-left group">
                  <i data-lucide="pencil" class="w-5 h-5 text-gray-400 group-hover:text-slate-700 transition-colors"></i> Edit Property
                </button>
                <button class="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 text-slate-700 font-bold text-sm transition-colors text-left group">
                  <i data-lucide="share-2" class="w-5 h-5 text-gray-400 group-hover:text-slate-700 transition-colors"></i> Share Property
                </button>
                <button class="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-50 text-red-600 font-bold text-sm transition-colors text-left group mt-2 border-t border-gray-50 pt-3 rounded-t-none">
                  <i data-lucide="trash-2" class="w-5 h-5 text-red-500 group-hover:text-red-600 transition-colors"></i> Delete Property
                </button>
              </div>
            </div>`;

content = content.replace(oldBlock, newBlock);

// Add the editPropertyAction function right before lucide.createIcons() init
const editScript = `
    function editPropertyAction() {
      // 1. Close the fullscreen modal
      closeFullscreenModal();
      
      // 2. Open the Add/Edit Property wizard after a slight delay for the closing animation
      setTimeout(() => {
        toggleAddProperty();
      }, 300);
    }
`;

content = content.replace('if (typeof lucide !== \'undefined\') {', editScript + '\n    if (typeof lucide !== \'undefined\') {');

fs.writeFileSync('dashboard.html', content);
console.log('Successfully updated the property actions sidebar.');
