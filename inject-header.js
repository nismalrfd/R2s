const fs = require('fs');
const path = require('path');

const headerHTML = `
  <!-- Global Desktop Header -->
  <header class="hidden md:flex fixed top-0 left-0 w-full items-center justify-between h-[90px] bg-[#060B19] border-b-2 border-red-600 px-8 z-[100] shadow-2xl">
    <!-- Dotted Background Overlay -->
    <div class="absolute inset-0 opacity-20 pointer-events-none" style="background-image: radial-gradient(#ffffff 2px, transparent 2px); background-size: 30px 30px;"></div>
    
    <!-- Left: Logo & Title -->
    <div class="flex items-center gap-6 relative z-10">
      <div class="w-[60px] h-[60px] bg-white rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.35)]">
        <div class="text-[#060B19] font-black text-xl leading-none flex flex-col items-center">
          <span class="tracking-tighter">R2<span class="text-red-600">s</span></span>
        </div>
      </div>
      <div class="flex flex-col justify-center">
        <span class="text-gray-400 text-[11px] font-bold tracking-[0.2em] uppercase mb-0.5">Partner Registration</span>
        <h1 class="text-white text-[26px] font-bold tracking-tight leading-none">R2<span class="text-red-600">s</span> Realtors Network</h1>
      </div>
    </div>

    <!-- Right: Verified Badge -->
    <div class="relative z-10">
      <div class="flex items-center gap-2.5 bg-red-900/20 border border-red-500/30 px-5 py-2.5 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.15)] backdrop-blur-sm">
        <i data-lucide="check-circle-2" class="w-4 h-4 text-red-500"></i>
        <span class="text-white text-sm font-medium tracking-wide">Verified Network <span class="text-gray-500 mx-1">&middot;</span> <span class="text-gray-300">2000+ Partners</span></span>
      </div>
    </div>
  </header>
`;

const dir = 'c:\\Users\\nismal\\Downloads\\web for r2s';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('Global Desktop Header')) {
    content = content.replace(/(<body[^>]*>)/, `$1\n${headerHTML}`);
    
    if (file === 'index.html') {
       content = content.replace(/class="flex flex-col items-center justify-center h-full max-w-md mx-auto/, 'class="md:pt-[100px] flex flex-col items-center justify-center h-full max-w-md mx-auto');
    } else if (file === 'login.html' || file === 'verify.html' || file === 'signup.html') {
       content = content.replace(/class="w-full max-w-/, 'class="md:mt-[100px] w-full max-w-');
    } else if (file === 'property-detail.html') {
       content = content.replace(/class="hidden md:block max-w-6xl mx-auto px-8 py-10"/, 'class="hidden md:block max-w-6xl mx-auto px-8 py-10 md:pt-[130px]"');
    } else {
       // dashboard, add-property, edit-profile, profile
       content = content.replace(/class="max-w-/, 'class="md:mt-[110px] max-w-');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
