const fs = require('fs');
const path = require('path');

const dir = process.cwd();
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Variant 1
  content = content.replace(
    /<div class="w-\[60px\] h-\[60px\] bg-white rounded-lg flex items-center justify-center shadow-\[0_0_20px_rgba\(239,68,68,0\.35\)\] overflow-hidden">/g,
    '<div class="w-[60px] h-[60px] flex items-center justify-center">'
  );

  // Variant 2
  content = content.replace(
    /<div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-\[0_0_30px_rgba\(239,68,68,0\.4\)\] border-b-4 border-red-600 overflow-hidden">/g,
    '<div class="w-16 h-16 flex items-center justify-center mb-8">'
  );

  // Variant 3a (login)
  content = content.replace(
    /<div class="md:hidden flex items-center justify-center w-16 h-16 bg-white border-2 border-gray-100 rounded-2xl mb-8 shadow-sm relative z-20 overflow-hidden">/g,
    '<div class="md:hidden flex items-center justify-center w-16 h-16 mb-8 relative z-20">'
  );

  // Variant 3b (signup)
  content = content.replace(
    /<div class="md:hidden flex items-center justify-center w-16 h-16 bg-white border-2 border-gray-100 rounded-2xl mb-8 shadow-sm shrink-0 overflow-hidden">/g,
    '<div class="md:hidden flex items-center justify-center w-16 h-16 mb-8 shrink-0">'
  );

  // Variant 4
  content = content.replace(
    /<div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-slate-950\/20 overflow-hidden border border-gray-200">/g,
    '<div class="w-12 h-12 flex items-center justify-center">'
  );

  fs.writeFileSync(filePath, content);
  console.log(`Updated logo wrapper in ${file}`);
});
