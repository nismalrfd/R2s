const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\nismal\\Downloads\\web for r2s';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Text Colors
  content = content.replace(/text-black/g, 'text-[#060B19]');
  content = content.replace(/text-\[\#111111\]/g, 'text-[#060B19]');
  content = content.replace(/hover:text-black/g, 'hover:text-red-600');
  
  // 2. Background Colors
  content = content.replace(/bg-black/g, 'bg-[#060B19]');
  content = content.replace(/hover:bg-black/g, 'hover:bg-red-600');
  
  // 3. Borders
  content = content.replace(/border-black/g, 'border-[#060B19]');
  content = content.replace(/focus:border-black/g, 'focus:border-[#060B19]');
  content = content.replace(/focus-within:border-black/g, 'focus-within:border-[#060B19]');
  content = content.replace(/hover:border-black/g, 'hover:border-red-600');
  
  // 4. Rings & Focus
  content = content.replace(/ring-black/g, 'ring-[#060B19]');
  
  // 5. Custom CSS in signup.html and others
  content = content.replace(/border-color: #000;/g, 'border-color: #060B19;');
  content = content.replace(/border-color:\s*#000;/g, 'border-color: #060B19;');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated theme in ${file}`);
  }
});
