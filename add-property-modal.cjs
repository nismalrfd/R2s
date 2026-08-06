const fs = require('fs');

let content = fs.readFileSync('dashboard.html', 'utf8');

// The HTML for the new Add Property modal
const addPropertyModalHtml = `
  <!-- Add Property Modal -->
  <div id="addPropertyModal" class="fixed inset-0 z-[3000] flex items-center justify-center p-4 sm:p-6 opacity-0 pointer-events-none transition-opacity duration-300">
    <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onclick="toggleAddProperty()"></div>
    <div class="relative bg-white w-full max-w-5xl rounded-[32px] shadow-2xl flex flex-col max-h-[95vh] transform scale-95 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" id="addPropertyContent">
      
      <div class="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white rounded-t-[32px]">
        <div>
          <h2 class="text-2xl font-extrabold text-slate-950 flex items-center gap-3"><i data-lucide="home" class="w-6 h-6 text-red-600"></i> Add New Property</h2>
          <p class="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider">Fill in the property details</p>
        </div>
        <button onclick="toggleAddProperty()" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>
      
      <div class="p-6 md:p-8 overflow-y-auto custom-scrollbar bg-[#f8fafc]">
        
        <div class="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm mb-6">
          <h3 class="text-lg font-bold text-slate-950 mb-6">Basic Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="flex flex-col gap-2 relative lg:col-span-3">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">Property Name <span class="text-red-500">*</span></label>
              <input type="text" placeholder="Enter property name" class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm">
            </div>
            
            <div class="flex flex-col gap-2 relative">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Service Type</label>
              <select class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm cursor-pointer appearance-none">
                <option value="">Select</option>
                <option>Sale</option>
                <option>Rent</option>
                <option>Lease</option>
              </select>
            </div>
            
            <div class="flex flex-col gap-2 relative">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Expecting Price</label>
              <input type="number" placeholder="Enter Price" class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm">
            </div>

            <div class="flex flex-col gap-2 relative">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Unit</label>
              <input type="text" placeholder="Sq Ft / Cent / Acre" class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm">
            </div>

            <div class="flex flex-col gap-2 relative">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Floors</label>
              <input type="number" placeholder="Total Floors" class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm">
            </div>
          </div>
        </div>

        <div class="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm mb-6">
          <h3 class="text-lg font-bold text-slate-950 mb-6">Property Categorization</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="flex flex-col gap-2 relative">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Property Kind</label>
              <select class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm cursor-pointer appearance-none">
                <option value="">Select</option>
                <option>Residential</option>
                <option>Commercial</option>
                <option>Estate</option>
              </select>
            </div>

            <div class="flex flex-col gap-2 relative">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Residential Type</label>
              <select class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm cursor-pointer appearance-none">
                <option value="">Select</option>
                <option>Apartment</option>
                <option>Villa</option>
                <option>House</option>
                <option>Flat</option>
                <option>Plot</option>
              </select>
            </div>

            <div class="flex flex-col gap-2 relative">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Commercial Type</label>
              <select class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm cursor-pointer appearance-none">
                <option value="">Select</option>
                <option>Office</option>
                <option>Shop</option>
                <option>Showroom</option>
                <option>Warehouse</option>
                <option>Building</option>
              </select>
            </div>

            <div class="flex flex-col gap-2 relative">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Estate Type</label>
              <select class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm cursor-pointer appearance-none">
                <option value="">Select</option>
                <option>Tea Estate</option>
                <option>Coffee Estate</option>
                <option>Rubber Plantation</option>
                <option>Agricultural Land</option>
                <option>Farm Land</option>
              </select>
            </div>

            <div class="flex flex-col gap-2 relative">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Property Status</label>
              <select class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm cursor-pointer appearance-none">
                <option value="">Select</option>
                <option>Ready to Move</option>
                <option>Under Construction</option>
                <option>New Launch</option>
                <option>Resale</option>
              </select>
            </div>

            <div class="flex flex-col gap-2 relative">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Date of Completion</label>
              <input type="date" class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm cursor-text">
            </div>
          </div>
        </div>

        <div class="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
          <h3 class="text-lg font-bold text-slate-950 mb-6">Media Uploads</h3>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <!-- Featured Image Zone -->
            <div>
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3 block text-red-500">Featured Cover Image (First Image)</label>
              <div class="w-full border-2 border-dashed border-red-200 rounded-3xl bg-red-50/50 hover:bg-red-50 hover:border-red-400 transition-colors cursor-pointer group flex flex-col items-center justify-center p-8 text-center h-[200px]">
                <div class="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <i data-lucide="image" class="w-6 h-6 text-red-500"></i>
                </div>
                <h4 class="font-bold text-slate-950 text-sm mb-1">Upload Featured Image</h4>
                <p class="text-xs font-medium text-gray-500">Click or drag and drop<br><span class="text-[10px] text-gray-400 mt-1 block">JPG, PNG, WEBP — 1 Image Only</span></p>
                <input type="file" accept="image/*" class="hidden">
              </div>
            </div>

            <!-- Property Gallery Zone -->
            <div>
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3 block">Property Gallery</label>
              <div class="w-full border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group flex flex-col items-center justify-center p-8 text-center h-[200px]">
                <div class="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <i data-lucide="images" class="w-6 h-6 text-gray-500"></i>
                </div>
                <h4 class="font-bold text-slate-950 text-sm mb-1">Upload Gallery Images</h4>
                <p class="text-xs font-medium text-gray-500">Click or drag and drop<br><span class="text-[10px] text-gray-400 mt-1 block">Multiple Images Allowed</span></p>
                <input type="file" multiple accept="image/*" class="hidden">
              </div>
            </div>

          </div>
        </div>

      </div>
      
      <div class="p-6 md:p-8 border-t border-gray-100 bg-white shrink-0 rounded-b-[32px] flex justify-end gap-4">
        <button onclick="toggleAddProperty()" class="px-6 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors">Cancel</button>
        <button onclick="toggleAddProperty()" class="px-8 py-3.5 bg-[#dc2626] text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg flex items-center gap-2">
          <i data-lucide="plus" class="w-4 h-4"></i> Create Property
        </button>
      </div>
    </div>
  </div>
`;

// Insert the HTML right before the <!-- Edit Profile Modal -->
content = content.replace('<!-- Edit Profile Modal -->', addPropertyModalHtml + '\n  <!-- Edit Profile Modal -->');

// Link the Add Property button to toggle function
content = content.replace(
  '<button class="bg-[#dc2626] hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-[0_4px_15px_rgba(220,38,38,0.3)] transition-colors flex items-center gap-2">',
  '<button onclick="toggleAddProperty()" class="bg-[#dc2626] hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-[0_4px_15px_rgba(220,38,38,0.3)] transition-colors flex items-center gap-2">'
);

// Add the JS function
const toggleAddPropertyJs = `
    function toggleAddProperty() {
      const modal = document.getElementById('addPropertyModal');
      const content = document.getElementById('addPropertyContent');
      if (modal.classList.contains('opacity-0')) {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        setTimeout(() => content.classList.remove('scale-95'), 10);
      } else {
        content.classList.add('scale-95');
        setTimeout(() => modal.classList.add('opacity-0', 'pointer-events-none'), 300);
      }
    }
`;

content = content.replace('if (typeof lucide !== \'undefined\') {', toggleAddPropertyJs + '\n    if (typeof lucide !== \'undefined\') {');

fs.writeFileSync('dashboard.html', content);
console.log('Add Property Modal created and injected');
