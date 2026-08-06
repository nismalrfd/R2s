const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
c = c.replace(/bg-slate-950 rounded-full flex items-center justify-center text-white/g, 'bg-red-600 rounded-full flex items-center justify-center text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] group-hover:bg-red-700 transition-colors');
c = c.replace(/class="w-full md:w-auto bg-white rounded-full p-2 pl-8 pr-2 flex items-center justify-between gap-6 shadow-2xl hover:scale-\[1.02\] transition-transform"/, 'class="group w-full md:w-auto bg-white rounded-full p-2 pl-8 pr-2 flex items-center justify-between gap-6 shadow-2xl hover:scale-[1.02] transition-all"');
fs.writeFileSync('index.html', c);
console.log('Fixed landing button');
