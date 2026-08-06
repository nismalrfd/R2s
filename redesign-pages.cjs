const fs = require('fs');

// --- SIGNUP.HTML REDESIGN ---
let signupContent = fs.readFileSync('signup.html', 'utf8');

// Inject Mesh Background
const meshBg = `
  <!-- Premium Mesh Background -->
  <div class="fixed inset-0 z-[-1] overflow-hidden bg-[#FAFBFF]">
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[100px]"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-400/10 rounded-full blur-[100px]"></div>
  </div>
`;
if (!signupContent.includes('Premium Mesh Background')) {
    signupContent = signupContent.replace('<body class="overflow-x-hidden bg-gray-50 min-h-screen flex items-center justify-center p-4">', '<body class="overflow-x-hidden bg-[#FAFBFF] min-h-screen flex items-center justify-center p-4">\n' + meshBg);
}

// Convert Primary Red Buttons to Blue, add hover lift
signupContent = signupContent.replace(/bg-red-600/g, 'bg-blue-600');
signupContent = signupContent.replace(/hover:bg-red-700/g, 'hover:bg-blue-700 hover:-translate-y-0.5');
signupContent = signupContent.replace(/text-red-600/g, 'text-blue-600');
signupContent = signupContent.replace(/bg-red-50/g, 'bg-blue-50');
signupContent = signupContent.replace(/border-red-500/g, 'border-blue-500');

// Enhance main card shadow
signupContent = signupContent.replace('bg-white p-6 md:p-10 rounded-[32px] shadow-2xl', 'bg-white p-6 md:p-10 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100/50');

// Update focus rings
signupContent = signupContent.replace(/focus:border-slate-950/g, 'focus:border-blue-500');
signupContent = signupContent.replace(/focus:ring-slate-950\/5/g, 'focus:ring-blue-500/20');

fs.writeFileSync('signup.html', signupContent);


// --- DASHBOARD.HTML REDESIGN ---
let dashContent = fs.readFileSync('dashboard.html', 'utf8');

// Inject Mesh Background
const dashMesh = `
  <!-- Premium Mesh Background -->
  <div class="fixed inset-0 z-[-1] overflow-hidden bg-[#FAFBFF] pointer-events-none">
    <div class="absolute top-[10%] left-[-5%] w-[30%] h-[40%] bg-blue-400/10 rounded-full blur-[120px]"></div>
    <div class="absolute bottom-[20%] right-[-5%] w-[30%] h-[40%] bg-red-400/5 rounded-full blur-[120px]"></div>
  </div>
`;
if (!dashContent.includes('Premium Mesh Background')) {
    dashContent = dashContent.replace('<div class="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row">', '<div class="min-h-screen bg-transparent flex flex-col md:flex-row">\n' + dashMesh);
}

// Convert Primary Action Buttons to Blue
dashContent = dashContent.replace('bg-[#dc2626]', 'bg-blue-600 hover:-translate-y-0.5 hover:shadow-lg');
dashContent = dashContent.replace('hover:bg-red-700', 'hover:bg-blue-700');
dashContent = dashContent.replace('shadow-[0_4px_15px_rgba(220,38,38,0.3)]', 'shadow-[0_4px_15px_rgba(37,99,235,0.3)]');

// Also update the 'Add Photos' / Wizard 'Submit' buttons
dashContent = dashContent.replace(/bg-red-600 text-white/g, 'bg-blue-600 text-white hover:-translate-y-0.5 hover:shadow-lg');
dashContent = dashContent.replace(/hover:bg-red-700/g, 'hover:bg-blue-700');

// Enhance property cards hover states
dashContent = dashContent.replace(/property-card bg-white rounded-\[20px\] p-3 md:p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300/g, 'property-card bg-white rounded-[24px] p-3 md:p-4 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300');

// Update focus rings
dashContent = dashContent.replace(/focus:border-slate-950/g, 'focus:border-blue-500');
dashContent = dashContent.replace(/focus:ring-slate-950\/5/g, 'focus:ring-blue-500/20');

// Update Sidebar active state to Blue
dashContent = dashContent.replace(/bg-red-50 text-red-600/g, 'bg-blue-50 text-blue-600');
dashContent = dashContent.replace(/group-hover:bg-red-50/g, 'group-hover:bg-blue-50');
dashContent = dashContent.replace(/group-hover:text-red-600/g, 'group-hover:text-blue-600');

fs.writeFileSync('dashboard.html', dashContent);

console.log('Signup and Dashboard redesign applied successfully.');
