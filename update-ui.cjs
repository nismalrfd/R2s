const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.html'));

const advancedIosBanner = `
  <!-- iOS Manual Install Banner -->
  <div id="iosInstallBanner" class="hidden fixed bottom-0 left-0 w-full bg-white text-slate-950 p-6 z-[1000] flex flex-col items-center justify-center text-center rounded-t-3xl shadow-[0_-20px_60px_rgba(0,0,0,0.15)] md:max-w-sm md:left-1/2 md:-translate-x-1/2 md:bottom-6 md:rounded-3xl pb-10 transition-all duration-300 border border-gray-100 cursor-pointer" onclick="document.getElementById('iosInstallBanner').classList.add('hidden')">
    <div class="w-12 h-1.5 bg-gray-200 rounded-full mb-6"></div>
    <div class="w-16 h-16 bg-gray-50 border border-gray-50 rounded-2xl mb-4 flex items-center justify-center p-2 shadow-sm">
        <img src="/LOGO.png" class="w-full h-full object-contain">
    </div>
    <h4 class="font-extrabold text-xl mb-2">Install App</h4>
    <p class="text-sm text-gray-500 mb-2 px-4 font-medium leading-relaxed">To install on your iPhone:<br><br>1. Tap the <span class="inline-flex items-center justify-center bg-gray-50 px-2 py-1 rounded-md mx-1 border border-gray-200 text-slate-950 font-bold"><i data-lucide="share" class="w-3.5 h-3.5 mr-1"></i> Share</span> button.<br>2. Select <span class="font-bold text-slate-950 bg-gray-50 px-2 py-1 rounded-md border border-gray-200 inline-flex items-center mt-2">Add to Home Screen <i data-lucide="plus-square" class="w-3.5 h-3.5 ml-1"></i></span></p>
  </div>
`;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // 1. Update Watermark: increase size and remove mix-blend to fix visibility on login/signup
    if (content.includes('<!-- Powered By Watermark -->')) {
        content = content.replace('h-4 md:h-5 object-contain', 'h-6 md:h-7 object-contain');
        content = content.replace('mix-blend-multiply md:mix-blend-normal', '');
        changed = true;
    }

    // 2. Update navbar download buttons to black icon (white bg)
    if (content.includes('bg-slate-950 hover:bg-slate-800 text-white')) {
        content = content.replace(/bg-slate-950 hover:bg-slate-800 text-white/g, 'bg-white hover:bg-gray-50 text-slate-950');
        changed = true;
    }
    if (content.includes('bg-slate-950 items-center justify-center text-white hover:bg-slate-800')) {
        content = content.replace(/bg-slate-950 items-center justify-center text-white hover:bg-slate-800/g, 'bg-white items-center justify-center text-slate-950 hover:bg-gray-50');
        changed = true;
    }

    // 3. Update PWA Banner button to black icon (white bg)
    if (content.includes('<!-- PWA Install Banner -->')) {
        content = content.replace(/bg-slate-950 hover:bg-slate-800 text-white flex items-center gap-1.5 px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold shadow-lg shadow-slate-900\/20 transition-all hover:-translate-y-0.5 whitespace-nowrap/, 'bg-white hover:bg-gray-50 text-slate-950 border border-gray-200 flex items-center gap-1.5 px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold shadow-sm transition-all hover:-translate-y-0.5 whitespace-nowrap');
        changed = true;
    }

    // 4. Replace iOS Banner with advanced minimal one
    if (content.includes('<!-- iOS Manual Install Banner -->')) {
        const iosRegex = /<!-- iOS Manual Install Banner -->[\s\S]*?<\/div>\s*<script>/;
        if (iosRegex.test(content)) {
            content = content.replace(iosRegex, advancedIosBanner + '\n  <script>');
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(file, content);
        console.log('Updated ' + file);
    }
});
