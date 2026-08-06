const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  let original = c;
  
  // Dashboard bottom nav fix
  if (f === 'dashboard.html' || f === 'properties.html') {
    c = c.replace(/bg-\[\#111111\]/g, 'bg-red-600');
    c = c.replace(/border-\[\#F8F5F2\]/g, 'border-white');
  }

  // Back button upgrade to "the best one"
  // Find any button wrapping an arrow-left and inject the premium hover classes if missing
  c = c.replace(/<button([^>]+)onclick="window\.history\.back\(\)"([^>]*)>/g, (match, p1, p2) => {
    // If it doesn't already have the advanced hover, add it.
    if (!match.includes('hover:-translate-x-1')) {
      let classMatch = match.match(/class="([^"]+)"/);
      if (classMatch) {
        let classes = classMatch[1];
        // Ensure premium classes are there
        let newClasses = classes.replace('hover:bg-gray-100', 'hover:bg-gray-50 hover:-translate-x-1 hover:shadow-md transition-all duration-300');
        return match.replace(classes, newClasses);
      }
    }
    return match;
  });

  if (c !== original) {
    fs.writeFileSync(f, c);
    console.log('Polished', f);
  }
});
