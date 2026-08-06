const fs = require('fs');

const signupPath = 'signup.html';
const content = fs.readFileSync(signupPath, 'utf8');

const splitMarker = '<!-- ==================== RIGHT SIDE: SIGNUP FLOW ==================== -->';
const parts = content.split(splitMarker);

if (parts.length !== 2) {
  console.error("Marker not found in signup.html!");
  process.exit(1);
}

// Ensure our animation css is in the head
let leftSide = parts[0];
const animationCss = `
    /* Staggered form animations */
    @keyframes slideUpFade {
      0% { opacity: 0; transform: translateY(15px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .step-container:not(.step-hidden-right):not(.step-hidden-left) .animate-stagger-1 { animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; opacity: 0; }
    .step-container:not(.step-hidden-right):not(.step-hidden-left) .animate-stagger-2 { animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
    .step-container:not(.step-hidden-right):not(.step-hidden-left) .animate-stagger-3 { animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
`;
if (!leftSide.includes('slideUpFade')) {
  leftSide = leftSide.replace('</style>', animationCss + '\n  </style>');
}

const rightSide = `
  <div class="w-full md:w-1/2 h-screen flex flex-col p-4 sm:p-8 bg-white overflow-hidden relative" style="view-transition-name: auth-right;">
    
    <!-- Mobile Logo -->
    <div class="md:hidden flex items-center justify-center w-12 h-12 mb-2 shrink-0">
      <img src="/LOGO.png" alt="R2s Realtors" class="w-full h-full object-contain p-1">
    </div>

    <!-- Top Navigation / Back to Login -->
    <div class="w-full max-w-lg mx-auto flex items-center justify-between mb-4 shrink-0">
      <a href="/login.html" class="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full shadow-sm hover:bg-white hover:-translate-x-1 hover:shadow-md transition-all duration-300 border border-gray-100">
        <i data-lucide="arrow-left" class="w-5 h-5 text-slate-950"></i>
      </a>
      
      <!-- Progress Indicator -->
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2">
          <div id="dot1" class="w-2 h-2 rounded-full bg-slate-950 transition-colors duration-500"></div>
          <div id="dot2" class="w-2 h-2 rounded-full bg-gray-200 transition-colors duration-500"></div>
          <div id="dot3" class="w-2 h-2 rounded-full bg-gray-200 transition-colors duration-500"></div>
          <div id="dot4" class="w-2 h-2 rounded-full bg-gray-200 transition-colors duration-500"></div>
          <div id="dot5" class="w-2 h-2 rounded-full bg-gray-200 transition-colors duration-500"></div>
        </div>
        <span id="stepText" class="text-xs font-bold text-gray-500 uppercase tracking-widest transition-all">Step 1 of 5</span>
      </div>
    </div>

    <!-- Signup Container: Absolute boundary for all steps -->
    <div class="w-full max-w-lg mx-auto flex-1 relative">
      <form id="signupForm" class="w-full h-full relative" onsubmit="handleGenericForm(event)" novalidate>
        
        <!-- STEP 1: Role Selection -->
        <div id="step1" class="absolute inset-0 w-full step-container flex flex-col justify-center pb-12">
          <h2 class="text-2xl font-bold text-slate-950 mb-1 tracking-tight">What brings you to R2s?</h2>
          <p class="text-gray-500 font-medium text-sm mb-4">Choose your registration type to adapt your profile.</p>
          
          <div class="grid grid-cols-2 gap-3 mb-6">
            
            <!-- 1. Owner -->
            <label class="radio-card cursor-pointer relative h-full group">
              <input type="radio" name="role" value="owner" class="absolute opacity-0 w-0 h-0" checked>
              <div class="w-full h-full bg-white border border-gray-200 rounded-[16px] p-3 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-gray-300 hover:-translate-y-1 hover:shadow-md">
                <div class="relative w-10 h-10 mx-auto mb-2 transition-transform duration-300 group-hover:scale-110">
                  <div class="absolute right-0 top-0 w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-sm"></div>
                  <div class="absolute left-0 bottom-0 w-9 h-9 bg-white/60 backdrop-blur-md border border-white/80 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center">
                    <i data-lucide="home" class="w-4 h-4 text-red-600"></i>
                  </div>
                </div>
                <h3 class="font-bold text-slate-950 text-xs mb-0.5">Owner</h3>
                <p class="text-[10px] font-medium text-gray-400">List own properties</p>
              </div>
            </label>

            <!-- 2. NAR Realtor -->
            <label class="radio-card cursor-pointer relative h-full group">
              <input type="radio" name="role" value="nar" class="absolute opacity-0 w-0 h-0">
              <div class="w-full h-full bg-white border border-gray-200 rounded-[16px] p-3 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-gray-300 hover:-translate-y-1 hover:shadow-md">
                <div class="relative w-10 h-10 mx-auto mb-2 transition-transform duration-300 group-hover:scale-110">
                  <div class="absolute right-0 top-0 w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-lg rotate-12 shadow-sm"></div>
                  <div class="absolute left-0 bottom-0 w-9 h-9 bg-white/60 backdrop-blur-md border border-white/80 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center">
                    <i data-lucide="award" class="w-4 h-4 text-red-600"></i>
                  </div>
                </div>
                <h3 class="font-bold text-slate-950 text-xs mb-0.5">NAR Realtor</h3>
                <p class="text-[10px] font-medium text-gray-400">Association Member</p>
              </div>
            </label>

            <!-- 3. Partner -->
            <label class="radio-card cursor-pointer relative h-full group">
              <input type="radio" name="role" value="partner" class="absolute opacity-0 w-0 h-0">
              <div class="w-full h-full bg-white border border-gray-200 rounded-[16px] p-3 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-gray-300 hover:-translate-y-1 hover:shadow-md">
                <div class="relative w-10 h-10 mx-auto mb-2 transition-transform duration-300 group-hover:scale-110">
                  <div class="absolute right-1 top-0 w-7 h-7 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-sm"></div>
                  <div class="absolute right-4 top-2 w-4 h-4 bg-gradient-to-br from-red-300 to-red-500 rounded-full shadow-sm"></div>
                  <div class="absolute left-0 bottom-0 w-9 h-9 bg-white/60 backdrop-blur-md border border-white/80 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center">
                    <i data-lucide="users" class="w-4 h-4 text-red-600"></i>
                  </div>
                </div>
                <h3 class="font-bold text-slate-950 text-xs mb-0.5">Partner</h3>
                <p class="text-[10px] font-medium text-gray-400">Referral & co-broking</p>
              </div>
            </label>

            <!-- 4. Builder -->
            <label class="radio-card cursor-pointer relative h-full group">
              <input type="radio" name="role" value="builder" class="absolute opacity-0 w-0 h-0">
              <div class="w-full h-full bg-white border border-gray-200 rounded-[16px] p-3 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-gray-300 hover:-translate-y-1 hover:shadow-md">
                <div class="relative w-10 h-10 mx-auto mb-2 transition-transform duration-300 group-hover:scale-110">
                  <div class="absolute right-0 top-0 w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-xl shadow-sm"></div>
                  <div class="absolute left-0 bottom-0 w-9 h-9 bg-white/60 backdrop-blur-md border border-white/80 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center">
                    <i data-lucide="building-2" class="w-4 h-4 text-red-600"></i>
                  </div>
                </div>
                <h3 class="font-bold text-slate-950 text-xs mb-0.5">Builder</h3>
                <p class="text-[10px] font-medium text-gray-400">Developments</p>
              </div>
            </label>

            <!-- 5. Agent -->
            <label class="radio-card cursor-pointer relative h-full col-span-2 group">
              <input type="radio" name="role" value="agent" class="absolute opacity-0 w-0 h-0">
              <div class="w-full h-full bg-white border border-gray-200 rounded-[16px] p-3 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-gray-300 hover:-translate-y-1 hover:shadow-md">
                <div class="flex items-center gap-3">
                  <div class="relative w-10 h-10 shrink-0 transition-transform duration-300 group-hover:scale-110">
                    <div class="absolute right-0 top-0 w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-sm"></div>
                    <div class="absolute left-0 bottom-0 w-9 h-9 bg-white/60 backdrop-blur-md border border-white/80 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center">
                      <i data-lucide="user" class="w-4 h-4 text-red-600"></i>
                    </div>
                  </div>
                  <div class="text-left">
                    <h3 class="font-bold text-slate-950 text-sm mb-0.5">Agent</h3>
                    <p class="text-[10px] font-medium text-gray-400">Represent buyers & sellers</p>
                  </div>
                </div>
              </div>
            </label>

          </div>

          <button type="button" onclick="goToStep(1, 2)" class="w-full bg-red-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-700 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group mt-4">
            Continue <i data-lucide="arrow-right" class="w-4 h-4 transition-transform group-hover:translate-x-1"></i>
          </button>
          
          <p class="text-center text-sm text-gray-500 font-medium mt-6">
            Already have an account? <a href="/login.html" class="text-slate-950 font-bold hover:text-red-600 hover:underline transition-colors">Log In</a>
          </p>
        </div>

        <!-- STEP 2: Personal Details -->
        <div id="step2" class="absolute inset-0 w-full step-container step-hidden-right flex flex-col justify-center pb-12">
          <div class="flex items-center gap-3 mb-4 animate-stagger-1">
            <button type="button" onclick="goToStep(2, 1)" class="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full hover:bg-white hover:-translate-x-1 hover:shadow-md transition-all duration-300 shrink-0 border border-gray-100">
              <i data-lucide="arrow-left" class="w-5 h-5 text-slate-950"></i>
            </button>
            <div>
              <h2 class="text-2xl font-bold text-slate-950 tracking-tight">Contact Info</h2>
              <p class="text-xs text-gray-500 font-medium">How can we and your clients reach you?</p>
            </div>
          </div>

          <div class="flex flex-col gap-3 w-full animate-stagger-2">
            <h3 class="text-sm font-bold text-slate-950 flex items-center gap-2 mb-2"><i data-lucide="user" class="w-4 h-4 text-red-600"></i> Personal Details</h3>
            
            <div class="flex flex-col gap-2 relative">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Full Name *</label>
              <input type="text" id="f_name" class="w-full bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm" placeholder="e.g. Rajesh Kumar" required>
            </div>
            
            <div class="flex flex-col gap-2 relative">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Phone Number *</label>
              <div class="flex bg-gray-50 rounded-xl border border-gray-100 focus-within:border-slate-950 focus-within:ring-4 focus-within:ring-slate-950/5 focus-within:bg-white transition-all overflow-hidden">
                <span class="px-3 py-2.5 border-r border-gray-100 font-bold text-gray-500 text-xs flex items-center gap-1.5">IN +91</span>
                <input type="tel" id="f_phone" class="flex-1 px-3 py-2.5 bg-transparent outline-none font-bold text-slate-950 text-sm" placeholder="98765 43210" maxlength="10" required>
              </div>
            </div>

            <div class="flex flex-col gap-2 relative">
              <div class="flex justify-between items-center">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">WhatsApp</label>
                <label class="flex items-center gap-1.5 cursor-pointer group">
                  <input type="checkbox" id="sameAsPhone" class="w-3.5 h-3.5 rounded border-gray-300 text-slate-950 focus:ring-slate-950 cursor-pointer" onchange="toggleWhatsApp()">
                  <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-slate-950 transition-colors">Same as above</span>
                </label>
              </div>
              <div class="flex bg-gray-50 rounded-xl border border-gray-100 focus-within:border-slate-950 focus-within:ring-4 focus-within:ring-slate-950/5 focus-within:bg-white transition-all overflow-hidden">
                <span class="px-3 py-2.5 border-r border-gray-100 font-bold text-gray-500 text-xs flex items-center gap-1.5">IN +91</span>
                <input type="tel" id="f_wa" class="flex-1 px-3 py-2.5 bg-transparent outline-none font-bold text-slate-950 text-sm" placeholder="WhatsApp Number" maxlength="10">
              </div>
            </div>

            <div class="flex flex-col gap-2 relative">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Email Address *</label>
              <input type="email" id="f_email" class="w-full bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm" placeholder="you@example.com" required>
            </div>
            
            <button type="button" onclick="goToStep(2, 3)" class="w-full bg-red-600 text-white py-3 mt-4 rounded-xl font-bold text-sm hover:bg-red-700 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group">
              Continue <i data-lucide="arrow-right" class="w-4 h-4 transition-transform group-hover:translate-x-1"></i>
            </button>
          </div>
        </div>

        <!-- STEP 3: Professional / Role Details (Dynamic) -->
        <div id="step3" class="absolute inset-0 w-full step-container step-hidden-right flex flex-col justify-center pb-12">
          <div class="flex items-center gap-3 mb-4 animate-stagger-1">
            <button type="button" onclick="goToStep(3, 2)" class="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full hover:bg-white hover:-translate-x-1 hover:shadow-md transition-all duration-300 shrink-0 border border-gray-100">
              <i data-lucide="arrow-left" class="w-5 h-5 text-slate-950"></i>
            </button>
            <div>
              <h2 class="text-2xl font-bold text-slate-950 tracking-tight">Professional Info</h2>
              <p class="text-xs text-gray-500 font-medium">Additional details for your account</p>
            </div>
          </div>

          <div class="w-full flex-1">
            <!-- Basic Message for Owner/Agent who have no extra fields -->
            <div id="cond_none" class="w-full animate-stagger-2 hidden text-center py-10">
              <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <i data-lucide="check-circle-2" class="w-8 h-8 text-green-500"></i>
              </div>
              <h3 class="text-sm font-bold text-slate-950 mb-1">No additional details needed!</h3>
              <p class="text-xs text-gray-500">You can skip straight to the next step.</p>
            </div>

            <!-- Dynamic Block: NAR Realtor -->
            <div id="cond_nar" class="w-full animate-stagger-2 hidden">
              <h3 class="text-sm font-bold text-slate-950 flex items-center gap-2 mb-4"><i data-lucide="star" class="w-4 h-4 text-blue-600"></i> NAR Professional Details</h3>
              <div class="flex flex-col gap-3">
                <div class="flex flex-col gap-2 relative">
                  <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Website / Profile URL</label>
                  <input type="url" id="f_website" class="w-full bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm" placeholder="https://www.yoursite.com">
                </div>
                <div class="flex flex-col gap-2 relative">
                  <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">NAR Member ID</label>
                  <input type="text" id="f_nar_id" class="w-full bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm uppercase" placeholder="NAR-XXXXXXXX">
                </div>
              </div>
            </div>

            <!-- Dynamic Block: Channel Partner -->
            <div id="cond_cp" class="w-full animate-stagger-2 hidden">
              <h3 class="text-sm font-bold text-slate-950 flex items-center gap-2 mb-4"><i data-lucide="users" class="w-4 h-4 text-indigo-600"></i> Channel Partner Details</h3>
              <div class="flex flex-col gap-3">
                <div class="flex flex-col gap-2 relative">
                  <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">RERA Registered *</label>
                  <div class="relative">
                    <select id="cp_rera_reg" class="w-full bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm appearance-none cursor-pointer">
                      <option value="">— Select —</option>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                    <i data-lucide="chevron-down" class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                  </div>
                </div>
                <div class="flex flex-col gap-2 relative">
                  <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">RERA Register Number</label>
                  <input type="text" id="cp_rera_no" class="w-full bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm uppercase" placeholder="KRERA-XXXX-00000">
                </div>
              </div>
            </div>

            <!-- Dynamic Block: Builder -->
            <div id="cond_builder" class="w-full animate-stagger-2 hidden">
              <h3 class="text-sm font-bold text-slate-950 flex items-center gap-2 mb-4"><i data-lucide="building-2" class="w-4 h-4 text-emerald-600"></i> Builder Details</h3>
              <div class="flex flex-col gap-3">
                <div class="flex flex-col gap-2 relative">
                  <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Builder Name *</label>
                  <input type="text" id="bl_name" class="w-full bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm" placeholder="Company / Developer Name">
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div class="flex flex-col gap-2 relative">
                    <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Primary Contact</label>
                    <input type="text" id="bl_pc_name" class="w-full bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm" placeholder="Name">
                  </div>
                  <div class="flex flex-col gap-2 relative">
                    <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Number</label>
                    <input type="tel" id="bl_pc_ph" class="w-full bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm" placeholder="Phone">
                  </div>
                </div>
                <div class="flex flex-col gap-2 relative">
                  <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Project Name</label>
                  <textarea id="bl_project" class="w-full bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-medium text-sm min-h-[60px]" placeholder="List your current / upcoming projects..."></textarea>
                </div>
              </div>
            </div>

            <button type="button" onclick="goToStep(3, 4)" class="w-full bg-red-600 text-white py-3 mt-6 rounded-xl font-bold text-sm hover:bg-red-700 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group">
              Continue <i data-lucide="arrow-right" class="w-4 h-4 transition-transform group-hover:translate-x-1"></i>
            </button>
          </div>
        </div>


        <!-- STEP 4: Location Details -->
        <div id="step4" class="absolute inset-0 w-full step-container step-hidden-right flex flex-col justify-center pb-12">
          <div class="flex items-center gap-3 mb-4 animate-stagger-1">
            <button type="button" onclick="goToStep(4, 3)" class="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full hover:bg-white hover:-translate-x-1 hover:shadow-md transition-all duration-300 shrink-0 border border-gray-100">
              <i data-lucide="arrow-left" class="w-5 h-5 text-slate-950"></i>
            </button>
            <div>
              <h2 class="text-2xl font-bold text-slate-950 tracking-tight">Location</h2>
              <p class="text-xs text-gray-500 font-medium">Address and operating area</p>
            </div>
          </div>

          <div class="w-full animate-stagger-2">
            <h3 class="text-sm font-bold text-slate-950 flex items-center gap-2 mb-4"><i data-lucide="map-pin" class="w-4 h-4 text-red-600"></i> Location Details</h3>
            <div class="flex flex-col gap-3">
              <div class="flex flex-col gap-2 relative">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Full Address</label>
                <textarea id="f_address" class="w-full bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-medium text-sm min-h-[70px]" placeholder="House / Flat No, Street, Area..."></textarea>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="flex flex-col gap-2 relative">
                  <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">City</label>
                  <input type="text" id="f_city" class="w-full bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm" placeholder="e.g. Kozhikode">
                </div>
                <div class="flex flex-col gap-2 relative">
                  <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">PIN Code</label>
                  <input type="text" id="f_pin" class="w-full bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm uppercase" placeholder="673001" maxlength="6">
                </div>
              </div>

              <div class="flex flex-col gap-2 relative">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">State</label>
                <div class="relative">
                  <select id="f_state" class="w-full bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm appearance-none cursor-pointer">
                    <option value="">Select State</option>
                    <option>Kerala</option>
                    <option>Tamil Nadu</option>
                    <option>Karnataka</option>
                    <option>Maharashtra</option>
                    <option>Delhi</option>
                  </select>
                  <i data-lucide="chevron-down" class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                </div>
              </div>

              <div class="flex flex-col gap-2 relative">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Area of Operation</label>
                <input type="text" id="f_area" class="w-full bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm" placeholder="e.g. North Kerala">
              </div>
            </div>
            
            <button type="button" onclick="goToStep(4, 5)" class="w-full bg-red-600 text-white py-3 mt-6 rounded-xl font-bold text-sm hover:bg-red-700 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group">
              Continue <i data-lucide="arrow-right" class="w-4 h-4 transition-transform group-hover:translate-x-1"></i>
            </button>
          </div>
        </div>


        <!-- STEP 5: Terms & Conditions -->
        <div id="step5" class="absolute inset-0 w-full step-container step-hidden-right flex flex-col justify-center pb-12">
          <div class="flex items-center gap-3 mb-4 animate-stagger-1">
            <button type="button" onclick="goToStep(5, 4)" class="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full hover:bg-white hover:-translate-x-1 hover:shadow-md transition-all duration-300 shrink-0 border border-gray-100">
              <i data-lucide="arrow-left" class="w-5 h-5 text-slate-950"></i>
            </button>
            <div>
              <h2 class="text-2xl font-bold text-slate-950 tracking-tight">Terms & Review</h2>
              <p class="text-xs text-gray-500 font-medium">Finalize your registration</p>
            </div>
          </div>

          <div class="w-full animate-stagger-2">
            <h3 class="text-sm font-bold text-slate-950 mb-3 flex items-center gap-2">
              <i data-lucide="shield-check" class="w-4 h-4 text-red-600"></i> Registration Terms
            </h3>
            
            <div id="dynamicTermsText" class="text-xs font-medium text-slate-700 leading-relaxed mb-4 min-h-[100px]">
              <!-- Injected via JS -->
            </div>
            
            <label class="flex items-start gap-3 cursor-pointer group mt-4 pt-4 border-t border-gray-100">
              <input type="checkbox" id="agreeTerms" class="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer mt-0.5" onchange="toggleSubmitButton()">
              <span class="text-sm font-bold text-slate-950 group-hover:text-red-600 transition-colors">I verify these details are correct and I agree to the terms.</span>
            </label>

            <button type="submit" id="submitBtn" disabled class="w-full bg-red-600 text-white py-3.5 mt-6 rounded-xl font-bold transition-all duration-300 text-sm flex items-center justify-center gap-2 opacity-50 cursor-not-allowed group relative overflow-hidden">
              <div class="flex items-center gap-2" id="submitContent">
                Complete Registration <i data-lucide="check-circle-2" class="w-5 h-5 transition-transform group-hover:scale-110"></i>
              </div>
            </button>
          </div>
        </div>

      </form>
    </div>
  </div>

  <script>
    if (typeof lucide !== 'undefined') lucide.createIcons();

    const roleTerms = {
      owner: '<div class="flex flex-col gap-3 text-xs text-slate-700 leading-relaxed max-h-40 overflow-y-auto pr-2 custom-scrollbar border border-gray-100 rounded-xl p-3 bg-gray-50"><div><strong class="text-slate-950 block mb-0.5">1. Global Marketing & Representation</strong><ul class="list-disc pl-4 space-y-1"><li><strong>Global Visibility:</strong> Promoted worldwide through R2s.</li><li><strong>Lead Handling:</strong> All inquiries routed exclusively through R2s.</li></ul></div><div><strong class="text-slate-950 block mb-0.5">2. Service Charge & Commission</strong><ul class="list-disc pl-4 space-y-1"><li><strong>Property Sales:</strong> 2% of the agreed sale price.</li><li><strong>Rentals:</strong> Equal to 15 days of rent.</li></ul></div></div>',
      agent: "As an Agent, you agree to uphold professional brokerage standards and adhere strictly to local real estate commission guidelines.",
      partner: "As a Channel Partner, you agree to our standard co-brokerage fee structure and non-circumvention policies.",
      builder: "As a Builder, you agree to list only approved developments and provide transparent timelines.",
      nar: "As a NAR Realtor, you agree to strictly abide by the National Association of Realtors Code of Ethics."
    };

    function goToStep(current, next) {
      const stepCurrent = document.getElementById('step' + current);
      const stepNext = document.getElementById('step' + next);
      const stepText = document.getElementById('stepText');

      // Validation checkpoint moving forward
      if (next > current) {
        if (!validateStep(stepCurrent)) return;
      }

      // Config dynamic fields for Step 3
      if (current === 1 || next === 3) {
        configureRoleFields();
      }

      // Special case: If role is Owner or Agent, they don't have dynamic fields.
      // So if going 2 -> 3, skip to 4. If going 4 -> 3, skip to 2.
      if (next === 3) {
        const role = document.querySelector('input[name="role"]:checked').value;
        if (role === 'owner' || role === 'agent') {
           if (current === 2) {
             goToStep(current, 4);
             return;
           }
           if (current === 4) {
             goToStep(current, 2);
             return;
           }
        }
      }

      // Config T&Cs
      if (next === 5) {
        const selectedRole = document.querySelector('input[name="role"]:checked').value;
        document.getElementById('dynamicTermsText').innerHTML = roleTerms[selectedRole] || "Terms and Conditions apply.";
        document.getElementById('agreeTerms').checked = false;
        toggleSubmitButton();
      }

      // Update dots
      for(let i=1; i<=5; i++){
        const dot = document.getElementById('dot' + i);
        if(i <= next) dot.className = "w-2 h-2 rounded-full bg-slate-950 transition-colors duration-500";
        else dot.className = "w-2 h-2 rounded-full bg-gray-200 transition-colors duration-500";
      }
      stepText.innerText = "Step " + next + " of 5";

      // Slide animations
      if (next > current) {
        stepCurrent.classList.add('step-hidden-left');
        stepNext.classList.remove('step-hidden-right');
      } else {
        stepCurrent.classList.add('step-hidden-right');
        stepNext.classList.remove('step-hidden-left');
      }
    }

    function configureRoleFields() {
      const role = document.querySelector('input[name="role"]:checked').value;
      
      document.getElementById('cond_nar').classList.add('hidden');
      document.getElementById('cond_cp').classList.add('hidden');
      document.getElementById('cond_builder').classList.add('hidden');
      document.getElementById('cond_none').classList.add('hidden');
      
      const dynamicFields = document.querySelectorAll('#cond_nar input, #cond_cp select, #cond_builder input');
      dynamicFields.forEach(f => {
        if(f.hasAttribute('data-req')) f.removeAttribute('required');
      });

      if (role === 'nar') {
        document.getElementById('cond_nar').classList.remove('hidden');
      } else if (role === 'partner') {
        document.getElementById('cond_cp').classList.remove('hidden');
        document.getElementById('cp_rera_reg').setAttribute('required', 'true');
        document.getElementById('cp_rera_reg').setAttribute('data-req', 'true');
      } else if (role === 'builder') {
        document.getElementById('cond_builder').classList.remove('hidden');
        document.getElementById('bl_name').setAttribute('required', 'true');
        document.getElementById('bl_name').setAttribute('data-req', 'true');
      } else {
        document.getElementById('cond_none').classList.remove('hidden');
      }
    }

    function toggleWhatsApp() {
      const isChecked = document.getElementById('sameAsPhone').checked;
      const mainPhone = document.getElementById('f_phone').value;
      const waPhone = document.getElementById('f_wa');
      if (isChecked) {
        waPhone.value = mainPhone;
        waPhone.readOnly = true;
        waPhone.classList.add('text-gray-400');
        clearFieldError(waPhone);
      } else {
        waPhone.value = '';
        waPhone.readOnly = false;
        waPhone.classList.remove('text-gray-400');
      }
    }

    document.getElementById('f_phone').addEventListener('input', (e) => {
      if (document.getElementById('sameAsPhone').checked) {
        document.getElementById('f_wa').value = e.target.value;
      }
    });

    function toggleSubmitButton() {
      const isChecked = document.getElementById('agreeTerms').checked;
      const btn = document.getElementById('submitBtn');
      if (isChecked) {
        btn.removeAttribute('disabled');
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
        btn.classList.add('hover:bg-red-700', 'hover:scale-105', 'hover:shadow-lg');
      } else {
        btn.setAttribute('disabled', 'true');
        btn.classList.add('opacity-50', 'cursor-not-allowed');
        btn.classList.remove('hover:bg-red-700', 'hover:scale-105', 'hover:shadow-lg');
      }
    }

    function showFieldError(inputEl, message) {
      const wrapper = inputEl.parentElement.classList.contains('flex') && !inputEl.parentElement.classList.contains('flex-col') ? inputEl.parentElement : inputEl;
      let errBox = wrapper.nextElementSibling;
      if (!errBox || !errBox.classList.contains('custom-error-box')) {
        errBox = document.createElement('div');
        errBox.className = 'custom-error-box hidden opacity-0 translate-y-1 transition-all duration-300 flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded-lg text-xs font-bold mt-1';
        errBox.innerHTML = '<i data-lucide="alert-circle" class="w-3.5 h-3.5 shrink-0"></i> <span></span>';
        wrapper.parentNode.insertBefore(errBox, wrapper.nextSibling);
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
      errBox.querySelector('span').innerText = message;
      errBox.classList.remove('hidden');
      setTimeout(() => {
        errBox.classList.remove('opacity-0', 'translate-y-1');
        errBox.classList.add('opacity-100', 'translate-y-0');
      }, 10);
      wrapper.classList.add('border-red-500', 'ring-2', 'ring-red-500/10');
      wrapper.style.transform = 'translateX(4px)';
      setTimeout(() => wrapper.style.transform = 'translateX(-4px)', 100);
      setTimeout(() => wrapper.style.transform = 'translateX(4px)', 200);
      setTimeout(() => wrapper.style.transform = 'translateX(0)', 300);
    }

    function clearFieldError(inputEl) {
      const wrapper = inputEl.parentElement.classList.contains('flex') && !inputEl.parentElement.classList.contains('flex-col') ? inputEl.parentElement : inputEl;
      let errBox = wrapper.nextElementSibling;
      if (errBox && errBox.classList.contains('custom-error-box')) {
        errBox.classList.remove('opacity-100', 'translate-y-0');
        errBox.classList.add('opacity-0', 'translate-y-1');
        setTimeout(() => errBox.classList.add('hidden'), 300);
      }
      wrapper.classList.remove('border-red-500', 'ring-2', 'ring-red-500/10');
    }

    document.addEventListener('DOMContentLoaded', () => {
      document.body.addEventListener('input', (e) => {
        if(e.target.hasAttribute('required')) clearFieldError(e.target);
      });
      document.body.addEventListener('change', (e) => {
        if(e.target.hasAttribute('required')) clearFieldError(e.target);
      });
    });

    function validateStep(stepEl) {
      let isValid = true;
      let firstErr = null;
      stepEl.querySelectorAll('input[required], select[required], textarea[required]').forEach(input => {
        if (input.closest('.hidden')) return; // skip hidden conditional blocks
        if (!input.value.trim()) {
          showFieldError(input, 'This field is required.');
          isValid = false;
          if (!firstErr) firstErr = input;
        } else if (input.type === 'email' && !input.value.includes('@')) {
          showFieldError(input, 'Please enter a valid email address.');
          isValid = false;
          if (!firstErr) firstErr = input;
        } else if (input.type === 'tel' && input.value.length < 10) {
          showFieldError(input, 'Please enter a valid 10-digit number.');
          isValid = false;
          if (!firstErr) firstErr = input;
        }
      });
      // Skip scrollIntoView since flex-col absolute takes care of positioning nicely
      return isValid;
    }

    function handleGenericForm(e) {
      e.preventDefault();
      
      const btn = document.getElementById('submitBtn');
      const content = document.getElementById('submitContent');
      
      btn.style.width = btn.offsetWidth + 'px'; 
      content.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Processing...';
      if (typeof lucide !== 'undefined') lucide.createIcons();
      btn.classList.replace('bg-red-600', 'bg-slate-950');
      
      setTimeout(() => {
        content.innerHTML = '<i data-lucide="check" class="w-5 h-5"></i> Success';
        if (typeof lucide !== 'undefined') lucide.createIcons();
        btn.classList.replace('bg-slate-950', 'bg-emerald-500');
        
        setTimeout(() => {
          window.location.href = '/dashboard.html';
        }, 800);
      }, 1500);
    }
  </script>
</body>
</html>
`;

fs.writeFileSync('signup.html', leftSide + rightSide);
console.log('Signup 5-step refactored successfully.');
