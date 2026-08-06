const fs = require('fs');
let content = fs.readFileSync('signup.html', 'utf8');

// 1. Change all black buttons to red buttons
content = content.replace(/bg-slate-950 text-white py-3/g, 'bg-red-600 text-white py-3');
content = content.replace(/hover:bg-slate-800/g, 'hover:bg-red-700');

content = content.replace(/bg-slate-950 text-white py-2\.5/g, 'bg-red-600 text-white py-2.5');

// 2. Remove box shapes from sections
// Personal Details Box
content = content.replace(
  /<div class="bg-white rounded-\[20px\] p-4 shadow-sm border border-gray-100 hover:border-gray-200 transition-colors">/g,
  '<div class="w-full">' // Replaced with a neutral block
);

// Location Details Box
content = content.replace(
  /<div class="bg-white rounded-\[20px\] p-4 shadow-sm border border-gray-100 hover:border-gray-200 transition-colors">/g, // same as personal details
  '<div class="w-full">'
);

// Dynamic Blocks Boxes
// NAR Box
content = content.replace(
  /<div id="cond_nar" class="bg-blue-50\/50 rounded-\[20px\] p-4 shadow-sm border border-blue-100 hidden">/g,
  '<div id="cond_nar" class="w-full hidden mt-4 pt-4 border-t border-gray-100">'
);
// Channel Partner Box
content = content.replace(
  /<div id="cond_cp" class="bg-indigo-50\/50 rounded-\[20px\] p-4 shadow-sm border border-indigo-100 hidden">/g,
  '<div id="cond_cp" class="w-full hidden mt-4 pt-4 border-t border-gray-100">'
);
// Builder Box
content = content.replace(
  /<div id="cond_builder" class="bg-emerald-50\/50 rounded-\[20px\] p-4 shadow-sm border border-emerald-100 hidden">/g,
  '<div id="cond_builder" class="w-full hidden mt-4 pt-4 border-t border-gray-100">'
);

// Terms & Conditions Box
content = content.replace(
  /<div class="bg-red-50\/50 rounded-\[20px\] p-4 shadow-sm border border-red-100">/g,
  '<div class="w-full">'
);
// We might want to keep the text-red-600 on the shield icon, but the text box shouldn't look like a box.
// Also inside the terms box: `<div id="dynamicTermsText" class="text-xs font-medium text-slate-700 leading-relaxed mb-4 min-h-[100px]">`
// And the checkbox border.

// Save changes
fs.writeFileSync('signup.html', content);
console.log('UI refined: Boxes removed, buttons turned red.');
