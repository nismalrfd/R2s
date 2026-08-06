const fs = require('fs');

let dashContent = fs.readFileSync('dashboard.html', 'utf8');

// Replace the first property card footer
dashContent = dashContent.replace(
    '<div class="flex items-center gap-8 text-xs font-semibold text-gray-500 pt-4 border-t border-gray-100">\n              <p>Listed on 05 Aug 2026</p>\n              <p>ID: R2S00000177</p>',
    '<div class="flex items-center gap-6 md:gap-8 text-xs font-semibold text-gray-500 pt-4 border-t border-gray-100 w-full">\n              <p>Listed on 05 Aug 2026</p>\n              <p>ID: R2S00000177</p>\n              <p class="flex items-center gap-1.5 ml-auto text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm font-bold"><i data-lucide="eye" class="w-3.5 h-3.5"></i> 214 Views</p>'
);

// Replace the second property card footer
dashContent = dashContent.replace(
    '<div class="flex items-center gap-8 text-xs font-semibold text-gray-500 pt-4 border-t border-gray-100">\n              <p>Listed on 12 Jul 2026</p>\n              <p>ID: R2S00000145</p>',
    '<div class="flex items-center gap-6 md:gap-8 text-xs font-semibold text-gray-500 pt-4 border-t border-gray-100 w-full">\n              <p>Listed on 12 Jul 2026</p>\n              <p>ID: R2S00000145</p>\n              <p class="flex items-center gap-1.5 ml-auto text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm font-bold"><i data-lucide="eye" class="w-3.5 h-3.5"></i> 89 Views</p>'
);

fs.writeFileSync('dashboard.html', dashContent);
console.log('Added property view counts.');
