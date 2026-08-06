const fs = require('fs');

let content = fs.readFileSync('dashboard.html', 'utf8');

const newEditProfileModal = `
  <!-- Edit Profile Modal -->
  <div id="editProfileModal" class="fixed inset-0 z-[3000] flex items-center justify-center p-4 sm:p-6 opacity-0 pointer-events-none transition-opacity duration-300">
    <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onclick="toggleEditProfile()"></div>
    <div class="relative bg-white w-full max-w-4xl rounded-[32px] shadow-2xl flex flex-col h-[90vh] md:h-[90vh] transform scale-95 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" id="editProfileContent">
      
      <!-- Header -->
      <div class="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white rounded-t-[32px]">
        <div>
          <h2 class="text-2xl font-extrabold text-slate-950 flex items-center gap-3"><i data-lucide="user-cog" class="w-6 h-6 text-red-600"></i> Update Profile</h2>
          <p class="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider">Manage your personal and professional details</p>
        </div>
        <button onclick="toggleEditProfile()" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>
      
      <!-- Body -->
      <div class="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc] p-6 md:p-8 flex flex-col gap-8 w-full">
        
        <!-- Contact Information -->
        <div class="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
          <div class="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
            <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center"><i data-lucide="user" class="w-6 h-6 text-red-500"></i></div>
            <div>
              <h3 class="text-lg font-bold text-slate-950">Personal Details</h3>
              <p class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Your name and contact numbers</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-2 relative md:col-span-2">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">Full Name <span class="text-red-500">*</span></label>
              <input type="text" value="Rajesh Kumar" class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm">
            </div>
            
            <div class="flex flex-col gap-2 relative">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">Phone Number <span class="text-red-500">*</span></label>
              <div class="flex">
                <div class="bg-gray-100 border border-gray-100 border-r-0 rounded-l-xl px-4 py-3 flex items-center gap-2 text-sm font-bold text-gray-500">
                  🇮🇳 <span>+91</span>
                </div>
                <input type="tel" value="98765 43210" class="w-full bg-gray-50 rounded-r-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm">
              </div>
            </div>

            <div class="flex flex-col gap-2 relative">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">WhatsApp</label>
              <div class="flex">
                <div class="bg-gray-100 border border-gray-100 border-r-0 rounded-l-xl px-4 py-3 flex items-center gap-2 text-sm font-bold text-gray-500">
                  🇮🇳 <span>+91</span>
                </div>
                <input type="tel" placeholder="Same as phone?" class="w-full bg-gray-50 rounded-r-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm">
              </div>
            </div>

            <div class="flex flex-col gap-2 relative md:col-span-2">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">Email Address <span class="text-red-500">*</span></label>
              <input type="email" value="rajesh@example.com" readonly class="w-full bg-gray-100 rounded-xl px-4 py-3 border border-gray-100 outline-none cursor-not-allowed text-gray-500 font-bold text-sm">
            </div>
          </div>
        </div>

        <!-- Professional Website -->
        <div class="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
          <div class="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
            <div class="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center"><i data-lucide="globe" class="w-6 h-6 text-indigo-500"></i></div>
            <div>
              <h3 class="text-lg font-bold text-slate-950">Professional Details</h3>
              <p class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Website and affiliations</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-2 relative">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Website / Profile URL</label>
              <input type="url" placeholder="https://www.yoursite.com" class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm">
            </div>
            <div class="flex flex-col gap-2 relative">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">NAR Member ID</label>
              <input type="text" placeholder="NAR-XXXXXXXX" class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm">
            </div>
          </div>
        </div>

        <!-- Channel Partner / Builder Details -->
        <div class="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
          <div class="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
            <div class="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center"><i data-lucide="briefcase" class="w-6 h-6 text-amber-500"></i></div>
            <div>
              <h3 class="text-lg font-bold text-slate-950">Business Credentials</h3>
              <p class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">RERA and Builder Info</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-2 relative">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">RERA Registered</label>
              <select class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm cursor-pointer appearance-none">
                <option value="">— Select —</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
            <div class="flex flex-col gap-2 relative">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">RERA Register Number</label>
              <input type="text" placeholder="KRERA-XXXX-00000" class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm">
            </div>
            <div class="flex flex-col gap-2 relative">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Builder Name</label>
              <input type="text" value="Rajesh Builders" class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm">
            </div>
            <div class="flex flex-col gap-2 relative">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Available Number of Flats</label>
              <input type="number" placeholder="e.g. 48" class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm">
            </div>
            <div class="flex flex-col gap-2 relative md:col-span-2">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Project Name</label>
              <textarea placeholder="List your current / upcoming project names..." class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm min-h-[80px] custom-scrollbar"></textarea>
            </div>
          </div>
        </div>

        <!-- Location Details -->
        <div class="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
          <div class="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
            <div class="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center"><i data-lucide="map-pin" class="w-6 h-6 text-emerald-500"></i></div>
            <div>
              <h3 class="text-lg font-bold text-slate-950">Location Details</h3>
              <p class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Address and operating area</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-2 relative md:col-span-2">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Full Address</label>
              <textarea placeholder="House / Flat No, Street, Area..." class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm min-h-[80px] custom-scrollbar"></textarea>
            </div>
            <div class="flex flex-col gap-2 relative">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">City</label>
              <input type="text" placeholder="e.g. Kozhikode" class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm">
            </div>
            <div class="flex flex-col gap-2 relative">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">State</label>
              <select class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm cursor-pointer appearance-none">
                <option value="">Select State</option>
                <option>Kerala</option>
                <option>Tamil Nadu</option>
                <option>Karnataka</option>
                <option>Maharashtra</option>
                <option>Other</option>
              </select>
            </div>
            <div class="flex flex-col gap-2 relative">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">PIN Code</label>
              <input type="text" placeholder="673001" maxlength="6" class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm">
            </div>
            <div class="flex flex-col gap-2 relative">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Area of Operation</label>
              <input type="text" placeholder="e.g. North Kerala" class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm">
            </div>
          </div>
        </div>

      </div>
      
      <!-- Footer -->
      <div class="p-6 md:p-8 border-t border-gray-100 bg-white shrink-0 rounded-b-[32px] flex items-center justify-between">
        <button onclick="toggleEditProfile()" class="px-6 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors">Cancel</button>
        <button id="btnSaveProfile" onclick="saveProfile()" class="px-8 py-3.5 bg-slate-950 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg flex items-center gap-2">
          <i data-lucide="save" class="w-4 h-4"></i> Save Changes
        </button>
      </div>
    </div>
  </div>`;

// Use the CORRECT comment to find the end of the block
const startIndex = content.indexOf('<!-- Edit Profile Modal -->');
const endIndex = content.indexOf('<!-- Terms & Conditions Popup Modal -->');

if (startIndex !== -1 && endIndex !== -1) {
    const before = content.substring(0, startIndex);
    const after = content.substring(endIndex);
    content = before + newEditProfileModal + '\n  ' + after;
    fs.writeFileSync('dashboard.html', content);
    console.log('Edit Profile modal injected successfully.');
} else {
    console.log('Failed to find markers.');
}
