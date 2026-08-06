const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let newContent = content.replace(/bg-\[\#060B19\]/g, 'bg-slate-950');
  newContent = newContent.replace(/text-\[\#060B19\]/g, 'text-slate-950');
  newContent = newContent.replace(/border-\[\#060B19\]/g, 'border-slate-950');
  newContent = newContent.replace(/ring-\[\#060B19\]/g, 'ring-slate-950');
  
  if (content !== newContent) {
    fs.writeFileSync(f, newContent, 'utf8');
    console.log('Fixed classes in', f);
  }
});
