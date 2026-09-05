const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.html'));

const advancedWatermarkHTML = `
  <!-- Powered By Watermark -->
  <div class="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[40] flex items-center justify-center opacity-40 hover:opacity-100 transition-all duration-500 pointer-events-auto cursor-pointer bg-white/60 backdrop-blur-md px-3 py-2 rounded-xl border border-gray-200/50 shadow-sm hover:shadow-lg hover:-translate-y-0.5 group">
    <img src="/watermark.png" alt="RHenova Tech" class="h-2.5 md:h-3 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-500">
  </div>
`;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Find and remove old watermark completely
    const oldRegex = /<!-- Powered By Watermark -->[\s\S]*?<\/div>/;
    if (oldRegex.test(content)) {
        content = content.replace(oldRegex, advancedWatermarkHTML);
        fs.writeFileSync(file, content);
        console.log('Moved and updated watermark in ' + file);
    }
});
