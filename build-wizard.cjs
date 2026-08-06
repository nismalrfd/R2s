const fs = require('fs');

let content = fs.readFileSync('dashboard.html', 'utf8');

// The new HTML for the Wizard Add Property modal
const wizardHtml = `
  <!-- Add Property Modal (Wizard) -->
  <div id="addPropertyModal" class="fixed inset-0 z-[3000] flex items-center justify-center p-4 sm:p-6 opacity-0 pointer-events-none transition-opacity duration-300">
    <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onclick="toggleAddProperty()"></div>
    <div class="relative bg-white w-full max-w-4xl rounded-[32px] shadow-2xl flex flex-col h-[90vh] md:h-auto md:max-h-[95vh] transform scale-95 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" id="addPropertyContent">
      
      <!-- Wizard Header & Stepper -->
      <div class="p-6 md:p-8 border-b border-gray-100 flex flex-col gap-6 shrink-0 bg-white rounded-t-[32px]">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-extrabold text-slate-950 flex items-center gap-3"><i data-lucide="home" class="w-6 h-6 text-red-600"></i> Add New Property</h2>
            <p class="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider">Follow the steps to list your property</p>
          </div>
          <button onclick="toggleAddProperty()" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>
        
        <!-- Progress Stepper -->
        <div class="flex items-center justify-between relative px-2">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full -z-10"></div>
          <div id="progressLine" class="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-red-600 rounded-full -z-10 transition-all duration-500 w-[0%]"></div>
          
          <div class="flex flex-col items-center gap-2 cursor-pointer group" onclick="goToStep(1)">
            <div id="stepDot1" class="w-8 h-8 rounded-full bg-red-600 text-white font-bold text-sm flex items-center justify-center shadow-md transition-colors group-hover:scale-110">1</div>
            <span id="stepText1" class="text-[10px] font-bold text-red-600 uppercase tracking-wider transition-colors">Basic Info</span>
          </div>
          <div class="flex flex-col items-center gap-2 cursor-pointer group" onclick="goToStep(2)">
            <div id="stepDot2" class="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 font-bold text-sm flex items-center justify-center transition-colors group-hover:scale-110">2</div>
            <span id="stepText2" class="text-[10px] font-bold text-gray-400 uppercase tracking-wider transition-colors">Details</span>
          </div>
          <div class="flex flex-col items-center gap-2 cursor-pointer group" onclick="goToStep(3)">
            <div id="stepDot3" class="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 font-bold text-sm flex items-center justify-center transition-colors group-hover:scale-110">3</div>
            <span id="stepText3" class="text-[10px] font-bold text-gray-400 uppercase tracking-wider transition-colors">Media</span>
          </div>
        </div>
      </div>
      
      <!-- Wizard Body -->
      <div class="flex-1 relative overflow-hidden bg-[#f8fafc]">
        
        <!-- STEP 1: Basic Information -->
        <div id="wizardStep1" class="absolute inset-0 p-6 md:p-8 transition-all duration-500 transform translate-x-0 opacity-100 overflow-y-auto custom-scrollbar">
          <div class="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm max-w-3xl mx-auto">
            <h3 class="text-lg font-bold text-slate-950 mb-6 flex items-center gap-2"><i data-lucide="info" class="w-5 h-5 text-red-500"></i> Basic Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col gap-2 relative md:col-span-2">
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
        </div>

        <!-- STEP 2: Categorization -->
        <div id="wizardStep2" class="absolute inset-0 p-6 md:p-8 transition-all duration-500 transform translate-x-full opacity-0 pointer-events-none overflow-y-auto custom-scrollbar">
          <div class="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm max-w-3xl mx-auto">
            <h3 class="text-lg font-bold text-slate-950 mb-6 flex items-center gap-2"><i data-lucide="layers" class="w-5 h-5 text-red-500"></i> Property Categorization</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>

        <!-- STEP 3: Media Uploads -->
        <div id="wizardStep3" class="absolute inset-0 p-6 md:p-8 transition-all duration-500 transform translate-x-full opacity-0 pointer-events-none overflow-y-auto custom-scrollbar">
          <div class="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm max-w-4xl mx-auto">
            <h3 class="text-lg font-bold text-slate-950 mb-6 flex items-center gap-2"><i data-lucide="image" class="w-5 h-5 text-red-500"></i> Media Uploads</h3>
            
            <div class="flex flex-col md:flex-row gap-6 md:gap-8">
              <!-- Featured Image Zone -->
              <div class="w-full md:w-1/3 shrink-0">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3 block text-red-500">Featured Cover Image</label>
                <label class="w-full border-2 border-dashed border-red-200 rounded-3xl bg-red-50/50 hover:bg-red-50 hover:border-red-400 transition-all cursor-pointer group flex flex-col items-center justify-center p-2 text-center h-[240px] relative overflow-hidden" id="featuredZone">
                  <div id="featuredPlaceholder" class="flex flex-col items-center pointer-events-none p-4">
                    <div class="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <i data-lucide="image" class="w-6 h-6 text-red-500"></i>
                    </div>
                    <h4 class="font-bold text-slate-950 text-sm mb-1">Upload Featured Image</h4>
                    <p class="text-[10px] font-medium text-gray-500">1 Image Only (JPG, PNG)</p>
                  </div>
                  <img id="featuredPreview" class="absolute inset-0 w-full h-full object-cover hidden rounded-[22px]" src="" alt="Preview">
                  
                  <div id="featuredRemove" class="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-red-50 hover:text-red-600 hidden z-10 transition-colors" onclick="removeFeatured(event)">
                    <i data-lucide="x" class="w-4 h-4"></i>
                  </div>
                  <input type="file" id="featuredInput" accept="image/*" class="hidden" onchange="handleFeatured(this)">
                </label>
              </div>

              <!-- Property Gallery Zone -->
              <div class="flex-1 flex flex-col">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3 block">Property Gallery</label>
                <label class="w-full border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer group flex flex-col p-4 text-center min-h-[240px]" id="galleryZone">
                  <div id="galleryPlaceholder" class="flex flex-col items-center justify-center h-full pointer-events-none p-4 mt-8">
                    <div class="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <i data-lucide="images" class="w-6 h-6 text-gray-500"></i>
                    </div>
                    <h4 class="font-bold text-slate-950 text-sm mb-1">Upload Gallery Images</h4>
                    <p class="text-[10px] font-medium text-gray-500">Multiple Images Allowed</p>
                  </div>
                  
                  <!-- Grid for thumbnails -->
                  <div id="galleryPreviewContainer" class="w-full grid grid-cols-3 sm:grid-cols-4 gap-3 hidden items-start content-start"></div>
                  
                  <input type="file" id="galleryInput" multiple accept="image/*" class="hidden" onchange="handleGallery(this)">
                </label>
              </div>
            </div>
          </div>
        </div>

      </div>
      
      <!-- Wizard Footer -->
      <div class="p-4 md:p-6 md:px-8 border-t border-gray-100 bg-white shrink-0 rounded-b-[32px] flex items-center justify-between">
        <button id="btnPrevStep" onclick="prevStep()" class="px-5 py-3 md:px-6 md:py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors opacity-0 pointer-events-none flex items-center gap-2">
          <i data-lucide="arrow-left" class="w-4 h-4"></i> Back
        </button>
        <div class="flex gap-3 md:gap-4">
          <button onclick="toggleAddProperty()" class="px-5 py-3 md:px-6 md:py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors hidden sm:block">Cancel</button>
          
          <button id="btnNextStep" onclick="nextStep()" class="px-6 py-3 md:px-8 md:py-3.5 bg-slate-950 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg flex items-center gap-2">
            Next Step <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </button>
          
          <button id="btnSubmitProperty" onclick="toggleAddProperty()" class="px-6 py-3 md:px-8 md:py-3.5 bg-[#dc2626] text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg hidden items-center gap-2">
            <i data-lucide="check" class="w-4 h-4"></i> Create
          </button>
        </div>
      </div>
    </div>
  </div>
`;

// Extract existing file content
const startIndex = content.indexOf('<!-- Add Property Modal');
const endIndex = content.indexOf('<!-- Edit Profile Modal -->');

if (startIndex !== -1 && endIndex !== -1) {
    const before = content.substring(0, startIndex);
    const after = content.substring(endIndex);
    content = before + wizardHtml + '\n  ' + after;
}

// 2. Add Wizard Logic & Image Handler Logic to scripts section
const wizardJS = `
    let currentStep = 1;
    
    function updateStepperUI() {
      const pLine = document.getElementById('progressLine');
      
      // Update Line Width
      if(currentStep === 1) pLine.style.width = '0%';
      if(currentStep === 2) pLine.style.width = '50%';
      if(currentStep === 3) pLine.style.width = '100%';

      for(let i=1; i<=3; i++) {
        const dot = document.getElementById('stepDot'+i);
        const text = document.getElementById('stepText'+i);
        
        if (i < currentStep) {
          // Completed
          dot.className = "w-8 h-8 rounded-full bg-red-600 text-white font-bold text-sm flex items-center justify-center shadow-md transition-colors group-hover:scale-110";
          dot.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
          text.className = "text-[10px] font-bold text-red-600 uppercase tracking-wider transition-colors";
        } else if (i === currentStep) {
          // Current
          dot.className = "w-8 h-8 rounded-full bg-red-600 text-white font-bold text-sm flex items-center justify-center shadow-md transition-colors group-hover:scale-110";
          dot.innerHTML = i;
          text.className = "text-[10px] font-bold text-red-600 uppercase tracking-wider transition-colors";
        } else {
          // Future
          dot.className = "w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 font-bold text-sm flex items-center justify-center transition-colors group-hover:scale-110";
          dot.innerHTML = i;
          text.className = "text-[10px] font-bold text-gray-400 uppercase tracking-wider transition-colors";
        }
      }
      
      if(window.lucide) lucide.createIcons();
    }

    function goToStep(step) {
      if(step < 1 || step > 3) return;
      
      const currentEl = document.getElementById('wizardStep' + currentStep);
      const targetEl = document.getElementById('wizardStep' + step);
      
      // Determine direction for animation
      const movingForward = step > currentStep;
      
      // Hide current
      currentEl.classList.remove('translate-x-0', 'opacity-100');
      currentEl.classList.add(movingForward ? '-translate-x-full' : 'translate-x-full', 'opacity-0', 'pointer-events-none');
      
      // Show target
      targetEl.classList.remove('translate-x-full', '-translate-x-full', 'opacity-0', 'pointer-events-none');
      targetEl.classList.add('translate-x-0', 'opacity-100');
      
      currentStep = step;
      updateStepperUI();
      
      // Update Footer Buttons
      const btnPrev = document.getElementById('btnPrevStep');
      const btnNext = document.getElementById('btnNextStep');
      const btnSubmit = document.getElementById('btnSubmitProperty');
      
      if (currentStep === 1) {
        btnPrev.classList.add('opacity-0', 'pointer-events-none');
        btnNext.classList.remove('hidden');
        btnNext.classList.add('flex');
        btnSubmit.classList.add('hidden');
        btnSubmit.classList.remove('flex');
      } else if (currentStep === 2) {
        btnPrev.classList.remove('opacity-0', 'pointer-events-none');
        btnNext.classList.remove('hidden');
        btnNext.classList.add('flex');
        btnSubmit.classList.add('hidden');
        btnSubmit.classList.remove('flex');
      } else if (currentStep === 3) {
        btnPrev.classList.remove('opacity-0', 'pointer-events-none');
        btnNext.classList.add('hidden');
        btnNext.classList.remove('flex');
        btnSubmit.classList.remove('hidden');
        btnSubmit.classList.add('flex');
      }
    }
    
    function nextStep() {
      if (currentStep < 3) goToStep(currentStep + 1);
    }
    
    function prevStep() {
      if (currentStep > 1) goToStep(currentStep - 1);
    }

    // --- Image Upload Handlers ---
    function handleFeatured(input) {
      if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const preview = document.getElementById('featuredPreview');
          const placeholder = document.getElementById('featuredPlaceholder');
          const removeBtn = document.getElementById('featuredRemove');
          const zone = document.getElementById('featuredZone');
          
          preview.src = e.target.result;
          preview.classList.remove('hidden');
          placeholder.classList.add('hidden');
          removeBtn.classList.remove('hidden');
          zone.classList.remove('border-dashed', 'border-red-200');
          zone.classList.add('border-solid', 'border-red-600', 'p-1');
        }
        reader.readAsDataURL(input.files[0]);
      }
    }

    function removeFeatured(e) {
      e.stopPropagation();
      e.preventDefault();
      document.getElementById('featuredInput').value = '';
      document.getElementById('featuredPreview').classList.add('hidden');
      document.getElementById('featuredPreview').src = '';
      document.getElementById('featuredPlaceholder').classList.remove('hidden');
      document.getElementById('featuredRemove').classList.add('hidden');
      const zone = document.getElementById('featuredZone');
      zone.classList.add('border-dashed', 'border-red-200');
      zone.classList.remove('border-solid', 'border-red-600', 'p-1');
    }

    function handleGallery(input) {
      const container = document.getElementById('galleryPreviewContainer');
      const placeholder = document.getElementById('galleryPlaceholder');
      const zone = document.getElementById('galleryZone');
      
      if (input.files && input.files.length > 0) {
        placeholder.classList.add('hidden');
        container.classList.remove('hidden');
        zone.classList.remove('justify-center');
        
        // Loop through all selected files
        Array.from(input.files).forEach(file => {
          if (!file.type.match('image.*')) return;
          
          const reader = new FileReader();
          reader.onload = function(e) {
            const div = document.createElement('div');
            div.className = "w-full aspect-square rounded-xl overflow-hidden relative shadow-sm border border-gray-200 group";
            div.innerHTML = \`
              <img src="\${e.target.result}" class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <i data-lucide="trash-2" class="w-5 h-5 text-white"></i>
              </div>
            \`;
            
            // Add click-to-remove logic to the thumb
            div.onclick = (ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              div.remove();
              if(container.children.length === 0) {
                placeholder.classList.remove('hidden');
                container.classList.add('hidden');
                zone.classList.add('justify-center');
                input.value = '';
              }
            };
            
            container.appendChild(div);
            if(window.lucide) lucide.createIcons();
          }
          reader.readAsDataURL(file);
        });
      }
    }
`;

// Inject the JS
content = content.replace('if (typeof lucide !== \'undefined\') {', wizardJS + '\n    if (typeof lucide !== \'undefined\') {');

// Fix toggleAddProperty to reset wizard on close/open
const toggleAddPropertyJs = `
    function toggleAddProperty() {
      const modal = document.getElementById('addPropertyModal');
      const content = document.getElementById('addPropertyContent');
      if (modal.classList.contains('opacity-0')) {
        // Open
        goToStep(1); // Reset to step 1
        modal.classList.remove('opacity-0', 'pointer-events-none');
        setTimeout(() => content.classList.remove('scale-95'), 10);
      } else {
        // Close
        content.classList.add('scale-95');
        setTimeout(() => modal.classList.add('opacity-0', 'pointer-events-none'), 300);
      }
    }
`;
content = content.replace(/function toggleAddProperty\(\) \{[\s\S]*?\}/, toggleAddPropertyJs);

fs.writeFileSync('dashboard.html', content);
console.log('Wizard and Image preview logic injected successfully.');
