const fs = require('fs');

let indexContent = fs.readFileSync('index.html', 'utf8');

// Inject Mesh Background
const indexMesh = `
  <!-- Premium Mesh Background -->
  <div class="fixed inset-0 z-[-1] overflow-hidden bg-[#FAFBFF] pointer-events-none">
    <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[120px]"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-400/10 rounded-full blur-[120px]"></div>
    <div class="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-blue-300/10 rounded-full blur-[100px]"></div>
  </div>
`;

// Body update
indexContent = indexContent.replace('<body class="overflow-x-hidden bg-slate-950 m-0 p-0 w-full min-h-screen overflow-hidden md:h-screen md:overflow-hidden">', '<body class="overflow-x-hidden bg-[#FAFBFF] m-0 p-0 w-full min-h-screen overflow-hidden md:h-screen md:overflow-hidden">\n' + indexMesh);

// General text color inversion (Careful not to break button text which should stay white if bg is blue)
// Change main heading text
indexContent = indexContent.replace(/text-white/g, 'text-slate-950');

// Fix buttons that need to remain white text
indexContent = indexContent.replace(/bg-red-600 text-slate-950/g, 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg');
indexContent = indexContent.replace(/bg-slate-900 text-slate-950/g, 'bg-slate-900 text-white');

// Secondary text
indexContent = indexContent.replace(/text-gray-400/g, 'text-gray-500');
indexContent = indexContent.replace(/text-gray-300/g, 'text-gray-600');
indexContent = indexContent.replace(/border-white\/10/g, 'border-gray-200');
indexContent = indexContent.replace(/bg-white\/5/g, 'bg-white/60');
indexContent = indexContent.replace(/bg-white\/10/g, 'bg-white/80');

// Hero section fixes
indexContent = indexContent.replace(/from-slate-950/g, 'from-[#FAFBFF]');
indexContent = indexContent.replace(/to-slate-900/g, 'to-[#F1F5F9]');
indexContent = indexContent.replace(/via-slate-950\/50/g, 'via-[#FAFBFF]/50');

// Change hover effects on feature cards
indexContent = indexContent.replace(/hover:border-white\/20/g, 'hover:border-blue-200');
indexContent = indexContent.replace(/hover:bg-white\/10/g, 'hover:bg-white/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300');

// Fix specific icons that were white/red
indexContent = indexContent.replace(/text-red-500/g, 'text-blue-600');
indexContent = indexContent.replace(/bg-red-500\/20/g, 'bg-blue-100');

fs.writeFileSync('index.html', indexContent);

console.log('Index redesign applied successfully.');
