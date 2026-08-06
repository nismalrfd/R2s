const fs = require('fs');
const path = require('path');

const dir = process.cwd();
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Variant 1: 60x60 Header Logo
  const regex1 = /<div class="w-\[60px\] h-\[60px\] bg-white rounded-lg flex items-center justify-center shadow-\[0_0_20px_rgba\(239,68,68,0\.35\)\]">[\s\S]*?<div class="text-slate-950 font-black text-xl leading-none flex flex-col items-center">[\s\S]*?<span class="tracking-tighter">R2<span class="text-red-600">s<\/span><\/span>[\s\S]*?<\/div>[\s\S]*?<\/div>/g;
  
  const replace1 = `<div class="w-[60px] h-[60px] bg-white rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.35)] overflow-hidden">
          <img src="/logo.jpg" alt="R2s Realtors" class="w-full h-full object-contain p-1">
        </div>`;
  
  // Variant 2: 48x48 Login/Signup Logo
  const regex2 = /<div class="w-12 h-12 bg-white rounded-xl shadow-\[0_8px_24px_rgba\(220,38,38,0\.3\)\] flex items-center justify-center mb-8 self-start">[\s\S]*?<div class="text-slate-950 font-black text-lg leading-none flex flex-col items-center">[\s\S]*?<span class="tracking-tighter">R2<span class="text-red-600">s<\/span><\/span>[\s\S]*?<\/div>[\s\S]*?<\/div>/g;
  
  const replace2 = `<div class="w-12 h-12 bg-white rounded-xl shadow-[0_8px_24px_rgba(220,38,38,0.3)] flex items-center justify-center mb-8 self-start overflow-hidden">
          <img src="/logo.jpg" alt="R2s Realtors" class="w-full h-full object-contain p-0.5">
        </div>`;

  // Variant 3: Sidebar Logo (e.g. Dashboard bg-slate-950)
  const regex3 = /<div class="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center shadow-lg shadow-slate-950\/20">[\s\S]*?<span class="text-white font-black text-lg tracking-tighter">R2<span class="text-red-500">s<\/span><\/span>[\s\S]*?<\/div>/g;

  const replace3 = `<div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-slate-950/20 overflow-hidden border border-gray-200">
            <img src="/logo.jpg" alt="R2s Realtors" class="w-full h-full object-contain p-0.5">
          </div>`;

  let updated = content;
  updated = updated.replace(regex1, replace1);
  updated = updated.replace(regex2, replace2);
  updated = updated.replace(regex3, replace3);

  if (updated !== content) {
    fs.writeFileSync(filePath, updated);
    console.log(`Updated logo in ${file}`);
  }
});
