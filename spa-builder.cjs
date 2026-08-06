const fs = require('fs');

let content = fs.readFileSync('dashboard.html', 'utf8');

// We need to keep everything up to <header... and including the header block (which ends at </header>)
const headerStartIdx = content.indexOf('<header');
const headerEndIdx = content.indexOf('</header>', headerStartIdx);

let newContent = content.substring(0, headerEndIdx + '</header>'.length);

// Now we need to modify the header string to add id="bellBtn" to the notification button and fix dropdown items
newContent = newContent.replace(
  '<button class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-slate-600 hover:bg-gray-100 hover:text-slate-950 transition-colors relative border border-transparent hover:border-gray-200">',
  '<button onclick="toggleNotifications()" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-slate-600 hover:bg-gray-100 hover:text-slate-950 transition-colors relative border border-transparent hover:border-gray-200 focus:outline-none z-[950]">'
);

// Add missing links in the profile dropdown
const profileDropdownActions = `            <!-- Actions -->
            <div class="p-2 flex flex-col gap-1">
              <button onclick="toggleEditProfile()" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-bold text-slate-700 hover:text-slate-950 transition-colors w-full text-left">
                <div class="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                  <i data-lucide="user-cog" class="w-4 h-4 text-slate-500"></i>
                </div>
                Update Profile
              </button>
              <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-bold text-slate-700 hover:text-slate-950 transition-colors">
                <div class="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                  <i data-lucide="home" class="w-4 h-4 text-slate-500"></i>
                </div>
                My Properties
              </a>
              <button class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-bold text-slate-700 hover:text-slate-950 transition-colors w-full text-left">
                <div class="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                  <i data-lucide="arrow-left-right" class="w-4 h-4 text-slate-500"></i>
                </div>
                Change Role
              </button>
              <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-bold text-slate-700 hover:text-slate-950 transition-colors">
                <div class="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                  <i data-lucide="file-text" class="w-4 h-4 text-slate-500"></i>
                </div>
                Terms & Conditions
              </a>
            </div>`;

newContent = newContent.replace(/<!-- Actions -->[\s\S]*?<!-- Logout -->/, profileDropdownActions + '\n            <!-- Logout -->');

// Build the new SPA body
const spaBody = `

  <!-- Main Content Area -->
  <div class="mt-[80px] md:mt-[90px] px-4 sm:px-6 md:px-12 py-8 pb-32 md:pb-12 md:h-[calc(100vh-90px)] md:overflow-y-auto hide-scrollbar custom-scrollbar w-full relative z-0">
    
    <!-- Advanced Search & Filters -->
    <div class="bg-white rounded-[24px] p-4 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center gap-4 relative z-10">
      <div class="relative flex-1 w-full">
        <i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"></i>
        <input type="text" placeholder="Search by location, title, or code..." class="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/5 font-medium text-sm transition-all text-slate-950">
      </div>
      
      <div class="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
        <select class="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none font-bold text-sm text-slate-700 cursor-pointer hover:bg-gray-100 transition-colors shrink-0">
          <option>Property Type</option>
          <option>Apartment</option>
          <option>Villa</option>
          <option>Commercial</option>
        </select>
        <select class="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none font-bold text-sm text-slate-700 cursor-pointer hover:bg-gray-100 transition-colors shrink-0">
          <option>Status</option>
          <option>For Sale</option>
          <option>For Rent</option>
          <option>Sold</option>
        </select>
        <button class="bg-slate-950 text-white rounded-xl px-6 py-3 font-bold text-sm hover:bg-slate-800 transition-colors shrink-0 flex items-center gap-2">
          <i data-lucide="filter" class="w-4 h-4"></i> Filters
        </button>
      </div>
    </div>

    <!-- Dynamic Properties Grid: auto-fit with minmax perfectly expands 1 item, balances 2, and grids 3+ -->
    <div class="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-8">
      
      <!-- Card 1 -->
      <div class="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col group relative cursor-pointer hover:shadow-xl transition-all duration-300" onclick="openPropertyModal()">
        <div class="relative w-full h-[260px] overflow-hidden">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
          
          <div class="absolute top-4 left-4 bg-[#0a192f]/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide shadow-sm uppercase border border-white/10">Residential</div>
          <div class="absolute top-4 right-4 bg-[#dc2626]/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide shadow-sm uppercase border border-white/10">Sell</div>
          <div class="absolute bottom-4 left-4 bg-[#0a192f]/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide shadow-sm uppercase border border-white/10">Apartment</div>
        </div>
        <div class="p-6 flex flex-col flex-1 bg-white">
          <h3 class="font-extrabold text-xl text-slate-900 mb-1">Marina One - R2S00000177</h3>
          <p class="text-sm font-semibold text-gray-500 mb-6 flex items-center gap-1.5"><i data-lucide="map-pin" class="w-3.5 h-3.5"></i> Marine Drive-Menaka-Kochi</p>
          
          <div class="grid grid-cols-2 gap-y-4 gap-x-2 mb-6">
            <div class="flex items-center gap-2 text-slate-700"><i data-lucide="bed-double" class="w-5 h-5 opacity-60 text-slate-950"></i><span class="text-sm font-bold">3 Bedrooms</span></div>
            <div class="flex items-center gap-2 text-slate-700"><i data-lucide="bath" class="w-5 h-5 opacity-60 text-slate-950"></i><span class="text-sm font-bold">4 Bathrooms</span></div>
            <div class="flex items-center gap-2 text-slate-700"><i data-lucide="ruler" class="w-5 h-5 opacity-60 text-slate-950"></i><span class="text-sm font-bold">2550 sq ft</span></div>
            <div class="flex items-center gap-2 text-slate-700"><i data-lucide="warehouse" class="w-5 h-5 opacity-60 text-slate-950"></i><span class="text-sm font-bold flex flex-col leading-tight"><span class="text-[10px] text-gray-400 uppercase tracking-wider">Code</span>R2S00000177</span></div>
          </div>
          <hr class="border-gray-100 mb-5">
          <div class="flex items-center justify-between mt-auto">
            <span class="font-black text-xl text-slate-950">INR 4,65,00,000</span>
            <button class="bg-[#dc2626] hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_4px_15px_rgba(220,38,38,0.3)] group-hover:shadow-[0_8px_20px_rgba(220,38,38,0.4)] group-hover:-translate-y-0.5">View property</button>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- SPA MODALS & SLIDE-OVERS -->

  <!-- Notification Dropdown -->
  <div id="notificationDropdown" class="fixed top-[80px] md:top-[90px] right-4 md:right-8 w-[90%] md:w-96 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 z-[940] transition-all duration-300 transform -translate-y-4 opacity-0 pointer-events-none">
    <div class="p-4 border-b border-gray-100 flex items-center justify-between">
      <h3 class="font-bold text-slate-950">Notifications</h3>
      <button class="text-xs font-bold text-red-600 hover:underline">Mark all read</button>
    </div>
    <div class="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
      <!-- Item -->
      <div class="p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors flex gap-3 relative">
        <div class="w-2 h-2 rounded-full bg-red-600 absolute top-5 left-1"></div>
        <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 ml-2">
          <i data-lucide="home" class="w-4 h-4 text-red-600"></i>
        </div>
        <div>
          <h4 class="text-sm font-bold text-slate-950">New Lead on Marina One</h4>
          <p class="text-xs font-medium text-gray-500 mt-0.5">Rajesh contacted you regarding the apartment in Kochi.</p>
          <span class="text-[10px] font-bold text-gray-400 mt-1 block">2 mins ago</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Edit Profile Slide-Over -->
  <div id="editProfileSlide" class="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-[1000] transform translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col">
    <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
      <h2 class="text-xl font-bold text-slate-950">Update Profile</h2>
      <button onclick="toggleEditProfile()" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
        <i data-lucide="x" class="w-5 h-5 text-slate-600"></i>
      </button>
    </div>
    <div class="p-6 overflow-y-auto flex-1 custom-scrollbar">
      <div class="flex flex-col gap-6">
        <!-- Avatar Edit -->
        <div class="flex items-center gap-4">
          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" class="w-20 h-20 rounded-full object-cover border-4 border-gray-50">
          <button class="bg-gray-50 px-4 py-2 rounded-xl text-sm font-bold text-slate-950 border border-gray-200 hover:bg-white transition-colors">Change Photo</button>
        </div>

        <!-- Dynamic Role selection like Signup -->
        <div class="flex flex-col gap-2">
           <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Account Role</label>
           <select class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 outline-none font-bold text-sm text-slate-950 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all cursor-pointer">
             <option>Owner</option>
             <option selected>Builder</option>
             <option>Agent</option>
             <option>Partner</option>
             <option>NAR Realtor</option>
           </select>
        </div>

        <div class="flex flex-col gap-2">
           <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
           <input type="text" value="Rajesh Kumar" class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 outline-none font-bold text-sm text-slate-950 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all">
        </div>

        <!-- Builder specific dynamic fields -->
        <div class="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col gap-4">
          <h4 class="text-sm font-bold text-slate-950 flex items-center gap-2"><i data-lucide="building-2" class="w-4 h-4 text-emerald-600"></i> Builder Details</h4>
          <div class="flex flex-col gap-2">
             <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Company Name</label>
             <input type="text" value="Skyline Developers" class="w-full bg-white rounded-lg px-3 py-2 border border-gray-200 outline-none font-bold text-sm text-slate-950">
          </div>
        </div>

      </div>
    </div>
    <div class="p-6 border-t border-gray-100 bg-white shrink-0">
      <button class="w-full bg-[#dc2626] text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl">Save Changes</button>
    </div>
  </div>

  <!-- Advanced Edit Property Modal -->
  <div id="propertyModal" class="fixed inset-0 z-[1100] flex items-center justify-center p-4 sm:p-6 opacity-0 pointer-events-none transition-opacity duration-300">
    <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onclick="closePropertyModal()"></div>
    
    <div class="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden transform scale-95 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" id="propertyModalContent">
      <!-- Header -->
      <div class="p-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
        <h2 class="text-2xl font-extrabold text-slate-950">Update Property</h2>
        <button onclick="closePropertyModal()" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Scrollable Body -->
      <div class="p-6 overflow-y-auto flex-1 custom-scrollbar bg-gray-50/30">
        
        <!-- Interactive Tabs -->
        <div class="flex items-center gap-2 mb-8 bg-gray-100 p-1 rounded-xl w-fit">
          <button class="px-5 py-2 bg-white rounded-lg shadow-sm text-sm font-bold text-slate-950">Details</button>
          <button class="px-5 py-2 rounded-lg text-sm font-bold text-gray-500 hover:text-slate-950 hover:bg-white/50 transition-colors">Images</button>
          <button class="px-5 py-2 rounded-lg text-sm font-bold text-gray-500 hover:text-slate-950 hover:bg-white/50 transition-colors">Pricing</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- Left Col -->
          <div class="flex flex-col gap-5">
            <div class="flex flex-col gap-2">
               <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Property Title</label>
               <input type="text" value="Marina One - R2S00000177" class="w-full bg-white rounded-xl px-4 py-3 border border-gray-200 outline-none font-bold text-sm text-slate-950 focus:border-red-500 focus:ring-2">
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                 <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                 <select class="w-full bg-white rounded-xl px-4 py-3 border border-gray-200 outline-none font-bold text-sm text-slate-950 focus:border-red-500 focus:ring-2">
                   <option selected>Residential</option>
                   <option>Commercial</option>
                 </select>
              </div>
              <div class="flex flex-col gap-2">
                 <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Type</label>
                 <select class="w-full bg-white rounded-xl px-4 py-3 border border-gray-200 outline-none font-bold text-sm text-slate-950 focus:border-red-500 focus:ring-2">
                   <option selected>Apartment</option>
                   <option>Villa</option>
                 </select>
              </div>
            </div>

            <div class="flex flex-col gap-2">
               <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Property Status</label>
               <!-- Advanced Status Toggle -->
               <label class="relative inline-flex items-center cursor-pointer bg-white p-2 rounded-xl border border-gray-200 w-full group">
                 <input type="checkbox" value="" class="sr-only peer">
                 <div class="w-12 h-6 bg-green-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[10px] after:left-[10px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600 shadow-inner"></div>
                 <span class="ml-4 text-sm font-bold text-slate-950 group-hover:text-red-600 transition-colors peer-checked:text-red-600">Mark as Sold</span>
               </label>
            </div>
          </div>

          <!-- Right Col -->
          <div class="flex flex-col gap-5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Featured Image</label>
            <div class="relative w-full h-[200px] rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 group cursor-pointer hover:border-red-500 transition-colors">
              <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" class="w-full h-full object-cover group-hover:opacity-50 transition-opacity">
              <div class="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg mb-2">
                  <i data-lucide="upload-cloud" class="w-6 h-6 text-red-600"></i>
                </div>
                <span class="text-sm font-bold text-white drop-shadow-md">Change Image</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      
      <!-- Footer -->
      <div class="p-6 border-t border-gray-100 bg-white shrink-0 flex items-center justify-end gap-3">
        <button onclick="closePropertyModal()" class="px-6 py-3 rounded-xl font-bold text-slate-700 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
        <button onclick="closePropertyModal()" class="px-6 py-3 rounded-xl font-bold text-white bg-[#dc2626] hover:bg-red-700 transition-colors shadow-lg">Save Changes</button>
      </div>
    </div>
  </div>


  <!-- Floating Bottom Nav (Mobile Only) -->
  <nav class="md:hidden fixed bottom-4 left-4 right-4 bg-slate-950 rounded-full px-6 py-3.5 flex items-center justify-between z-[800] shadow-2xl border border-white/10">
    <a href="/dashboard.html" class="flex flex-col items-center gap-1 text-white group relative">
      <i data-lucide="home" class="w-5 h-5"></i>
      <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"></span>
    </a>
    <a href="#" class="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors">
      <i data-lucide="search" class="w-5 h-5"></i>
    </a>
    <a href="/add-property.html" class="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center -mt-8 border-4 border-white shadow-[0_4px_15px_rgba(220,38,38,0.4)] text-white hover:scale-105 transition-transform">
      <i data-lucide="plus" class="w-6 h-6"></i>
    </a>
    <a href="/properties.html" class="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors">
      <i data-lucide="building" class="w-5 h-5"></i>
    </a>
    <button onclick="toggleEditProfile()" class="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors">
      <i data-lucide="user" class="w-5 h-5"></i>
    </button>
  </nav>

  <!-- SPA Scripts -->
  <script>
    function toggleNotifications() {
      const panel = document.getElementById('notificationDropdown');
      if (panel.classList.contains('opacity-0')) {
        panel.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-4');
        panel.classList.add('opacity-100', 'translate-y-0');
      } else {
        panel.classList.add('opacity-0', 'pointer-events-none', '-translate-y-4');
        panel.classList.remove('opacity-100', 'translate-y-0');
      }
    }

    function toggleEditProfile() {
      // Close dropdown if open
      document.getElementById('profileDropdown').classList.add('opacity-0', 'pointer-events-none');
      document.getElementById('mobileOverlay')?.classList.add('opacity-0', 'pointer-events-none');
      
      const slide = document.getElementById('editProfileSlide');
      if (slide.classList.contains('translate-x-full')) {
        slide.classList.remove('translate-x-full');
      } else {
        slide.classList.add('translate-x-full');
      }
    }

    function openPropertyModal() {
      const modal = document.getElementById('propertyModal');
      const content = document.getElementById('propertyModalContent');
      modal.classList.remove('opacity-0', 'pointer-events-none');
      setTimeout(() => content.classList.remove('scale-95'), 10);
    }

    function closePropertyModal() {
      const modal = document.getElementById('propertyModal');
      const content = document.getElementById('propertyModalContent');
      content.classList.add('scale-95');
      setTimeout(() => modal.classList.add('opacity-0', 'pointer-events-none'), 300);
    }
  </script>
</body>
</html>
`;

newContent += spaBody;

fs.writeFileSync('dashboard.html', newContent);
console.log('Dashboard transformed to SPA successfully.');
