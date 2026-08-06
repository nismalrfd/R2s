const fs = require('fs');

let content = fs.readFileSync('dashboard.html', 'utf8');

// 1. Remove Settings icon
const settingsRegex = /<button class="hidden md:flex w-10 h-10 rounded-full bg-gray-50 items-center justify-center text-slate-600 hover:bg-gray-100 hover:text-slate-950 transition-colors relative group border border-transparent hover:border-gray-200">[\s\S]*?<\/button>/;
content = content.replace(settingsRegex, '');

// 2. Remove Change Role button
const changeRoleRegex = /<button class="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-gray-50 text-sm font-bold text-slate-700 hover:text-slate-950 transition-colors w-full text-left">[\s\S]*?Change Role\s*<\/button>/;
content = content.replace(changeRoleRegex, '');

// 3. Modals HTML
const modalsHtml = `
  <!-- Notifications Slide-Over -->
  <div id="notificationsPanel" class="fixed top-0 right-0 h-full w-full sm:w-[380px] bg-white shadow-2xl z-[4000] transform translate-x-full transition-transform duration-300 flex flex-col border-l border-gray-100">
    <div class="p-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
      <h2 class="text-xl font-extrabold text-slate-950 flex items-center gap-2"><i data-lucide="bell" class="w-5 h-5 text-red-600"></i> Notifications</h2>
      <button onclick="toggleNotifications()" class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
    </div>
    <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar bg-[#f8fafc]">
      <!-- Notification Item -->
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow">
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0 mt-1">
            <i data-lucide="check-circle" class="w-4 h-4 text-green-600"></i>
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-950">Property Approved</h4>
            <p class="text-xs font-medium text-gray-500 mt-0.5 leading-relaxed">Your property "Marina One" has been verified and approved by the admin.</p>
            <span class="text-[10px] font-bold text-gray-400 mt-2 block">2 hours ago</span>
          </div>
        </div>
      </div>
      <!-- Notification Item -->
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow">
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-1">
            <i data-lucide="message-square" class="w-4 h-4 text-blue-600"></i>
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-950">New Inquiry Received</h4>
            <p class="text-xs font-medium text-gray-500 mt-0.5 leading-relaxed">You have a new message regarding "Ocean View Villa". Check your messages.</p>
            <span class="text-[10px] font-bold text-gray-400 mt-2 block">5 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="notificationsOverlay" onclick="toggleNotifications()" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[3900] opacity-0 pointer-events-none transition-opacity duration-300"></div>

  <!-- Edit Profile Modal -->
  <div id="editProfileModal" class="fixed inset-0 z-[3000] flex items-center justify-center p-4 sm:p-6 opacity-0 pointer-events-none transition-opacity duration-300">
    <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onclick="toggleEditProfile()"></div>
    <div class="relative bg-white w-full max-w-3xl rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] transform scale-95 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" id="editProfileContent">
      
      <div class="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white rounded-t-[32px]">
        <div>
          <h2 class="text-2xl font-extrabold text-slate-950 flex items-center gap-3"><i data-lucide="user-cog" class="w-6 h-6 text-red-600"></i> Update Profile</h2>
          <p class="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider">Edit your personal details</p>
        </div>
        <button onclick="toggleEditProfile()" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>
      
      <div class="p-6 md:p-8 overflow-y-auto custom-scrollbar bg-white">
        <!-- Form Fields identical to Signup Page -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div class="flex flex-col gap-2 relative">
            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">First Name</label>
            <input type="text" value="Rajesh" class="w-full bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm">
          </div>
          
          <div class="flex flex-col gap-2 relative">
            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Last Name</label>
            <input type="text" value="Kumar" class="w-full bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm">
          </div>

          <div class="flex flex-col gap-2 relative">
            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-red-500 flex justify-between">Mobile Number <span>(Cannot be changed)</span></label>
            <div class="flex bg-gray-100/60 rounded-xl border border-gray-200 overflow-hidden cursor-not-allowed opacity-80">
              <span class="px-3 py-2.5 border-r border-gray-200 font-bold text-gray-500 text-xs flex items-center gap-1.5 bg-gray-100/60">IN +91</span>
              <input type="tel" value="9876543210" readonly disabled class="flex-1 px-3 py-2.5 bg-transparent outline-none font-bold text-gray-500 text-sm cursor-not-allowed">
            </div>
          </div>

          <div class="flex flex-col gap-2 relative">
            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-red-500 flex justify-between">Email Address <span>(Cannot be changed)</span></label>
            <input type="email" value="rajesh@example.com" readonly disabled class="w-full bg-gray-100/60 rounded-xl px-3 py-2.5 border border-gray-200 outline-none text-gray-500 font-bold text-sm cursor-not-allowed opacity-80">
          </div>

          <div class="flex flex-col gap-2 relative">
            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">WhatsApp Number</label>
            <div class="flex bg-gray-50 rounded-xl border border-gray-100 focus-within:border-slate-950 focus-within:ring-4 focus-within:ring-slate-950/5 focus-within:bg-white transition-all overflow-hidden">
              <span class="px-3 py-2.5 border-r border-gray-100 font-bold text-gray-500 text-xs flex items-center gap-1.5">IN +91</span>
              <input type="tel" value="9876543210" class="flex-1 px-3 py-2.5 bg-transparent outline-none font-bold text-slate-950 text-sm">
            </div>
          </div>

          <div class="flex flex-col gap-2 relative">
            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">City</label>
            <input type="text" value="Kozhikode" class="w-full bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm">
          </div>

        </div>
      </div>
      
      <div class="p-6 md:p-8 border-t border-gray-100 bg-white shrink-0 rounded-b-[32px] flex justify-end gap-4">
        <button onclick="toggleEditProfile()" class="px-6 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors">Cancel</button>
        <button onclick="toggleEditProfile()" class="px-8 py-3.5 bg-[#dc2626] text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg">Save Changes</button>
      </div>
    </div>
  </div>
`;

// Insert Modals HTML right before <!-- Terms & Conditions Popup Modal -->
content = content.replace('<!-- Terms & Conditions Popup Modal -->', modalsHtml + '\n  <!-- Terms & Conditions Popup Modal -->');


// 4. Update JS functions
const notificationsJs = `
    function toggleNotifications() {
      const panel = document.getElementById('notificationsPanel');
      const overlay = document.getElementById('notificationsOverlay');
      
      if (panel.classList.contains('translate-x-full')) {
        panel.classList.remove('translate-x-full');
        panel.classList.add('translate-x-0');
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        overlay.classList.add('opacity-100');
      } else {
        panel.classList.add('translate-x-full');
        panel.classList.remove('translate-x-0');
        overlay.classList.add('opacity-0', 'pointer-events-none');
        overlay.classList.remove('opacity-100');
      }
    }
`;

const editProfileJs = `
    function toggleEditProfile() {
      const modal = document.getElementById('editProfileModal');
      const content = document.getElementById('editProfileContent');
      if (modal.classList.contains('opacity-0')) {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        setTimeout(() => content.classList.remove('scale-95'), 10);
      } else {
        content.classList.add('scale-95');
        setTimeout(() => modal.classList.add('opacity-0', 'pointer-events-none'), 300);
      }
    }
`;

// Replace existing stub functions
content = content.replace(/function toggleNotifications\(\) \{[\s\S]*?\}/, notificationsJs);
content = content.replace(/function toggleEditProfile\(\) \{[\s\S]*?\}/, editProfileJs);


fs.writeFileSync('dashboard.html', content);
console.log('Modals built successfully');
