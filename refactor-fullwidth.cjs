const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\nismal\\Downloads\\web for r2s';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  if (['signup.html', 'verify.html', 'login.html', 'index.html'].includes(file)) return;
  
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  const constraints = [
    'max-w-7xl mx-auto',
    'max-w-6xl mx-auto',
    'max-w-5xl mx-auto',
    'max-w-4xl mx-auto',
    'max-w-7xl',
    'max-w-6xl',
    'max-w-5xl',
    'max-w-4xl',
    'mx-auto'
  ];

  // Match class string containing md:mt or md:pt
  content = content.replace(/class="([^"]*md:(?:mt|pt)-\[\d+px\][^"]*)"/, (match, p1) => {
    let newClass = p1;
    constraints.forEach(c => {
      const regex = new RegExp(`\\b${c}\\b`, 'g');
      newClass = newClass.replace(regex, '');
    });
    
    if (!newClass.includes('w-full')) {
      newClass += ' w-full';
    }
    
    newClass = newClass.replace(/\s+/g, ' ').trim();
    return `class="${newClass}"`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
