const fs = require('fs');
const path = require('path');

const watermarkHTML = `
  <!-- Powered By Watermark -->
  <div class="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-[40] flex flex-col items-start gap-0.5 opacity-40 hover:opacity-100 transition-opacity duration-500 pointer-events-auto cursor-default mix-blend-multiply md:mix-blend-normal">
    <span class="text-[8px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">Powered by</span>
    <img src="/watermark.png" alt="RHenova Tech" class="h-4 md:h-5 object-contain grayscale hover:grayscale-0 transition-all duration-500">
  </div>
`;

const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Wipe old watermark if exists
    const oldRegex = /<!-- Powered By Watermark -->[\s\S]*?<\/div>/;
    if (oldRegex.test(content)) {
        content = content.replace(oldRegex, '');
    }

    // Insert new watermark right before </body>
    content = content.replace('</body>', watermarkHTML + '\n</body>');

    fs.writeFileSync(file, content);
    console.log('Injected watermark into ' + file);
});
