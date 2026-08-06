const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.html'));

const advancedWatermarkHTML = `
  <!-- Powered By Watermark -->
  <div class="fixed bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-[40] flex items-center gap-2 opacity-40 hover:opacity-100 transition-all duration-500 pointer-events-auto cursor-default bg-white/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-gray-200/50 shadow-sm hover:shadow-md">
    <span class="text-[8px] md:text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mt-0.5">Powered by</span>
    <img src="/watermark.png" alt="RHenova Tech" class="h-2.5 md:h-3 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-500">
  </div>
`;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Find and remove old watermark completely
    const oldRegex = /<!-- Powered By Watermark -->[\s\S]*?<\/div>/;
    if (oldRegex.test(content)) {
        content = content.replace(oldRegex, advancedWatermarkHTML);
        fs.writeFileSync(file, content);
        console.log('Upgraded watermark in ' + file);
    } else {
        console.log('No watermark found in ' + file);
    }
});
