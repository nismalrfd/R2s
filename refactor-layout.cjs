const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\nismal\\Downloads\\web for r2s';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Add viewport locking to ALL body tags
  if (!content.includes('md:h-screen md:overflow-hidden')) {
    content = content.replace(/<body class="([^"]*)"/, (match, p1) => {
      // Ensure we don't duplicate
      const newClasses = (p1 + ' md:h-screen md:overflow-hidden').replace(/\s+/g, ' ').trim();
      return `<body class="${newClasses}"`;
    });
  }

  // 2. Add internal scroll panes to specific files
  if (file === 'dashboard.html' || file === 'add-property.html' || file === 'edit-profile.html' || file === 'profile.html') {
    // Find the main wrapper starting with md:mt-[110px]
    content = content.replace(/class="(md:mt-\[110px\][^"]*)"/, (match, p1) => {
      if (!p1.includes('md:overflow-y-auto')) {
        return `class="${p1} md:h-[calc(100vh-110px)] md:overflow-y-auto hide-scrollbar custom-scrollbar"`;
      }
      return match;
    });
  }
  
  if (file === 'property-detail.html') {
    // property-detail has a hidden md:block max-w-6xl wrapper with pt-[130px]
    content = content.replace(/class="(hidden md:block max-w-6xl mx-auto px-8 py-10 md:pt-\[130px\])"/, (match, p1) => {
      if (!p1.includes('md:overflow-y-auto')) {
        return `class="${p1} md:h-screen md:overflow-y-auto hide-scrollbar custom-scrollbar"`;
      }
      return match;
    });
  }

  if (file === 'properties.html') {
     // Wait, did I inject header in properties.html? Yes. It might have md:mt-[110px]
     content = content.replace(/class="(md:mt-\[110px\][^"]*)"/, (match, p1) => {
      if (!p1.includes('md:overflow-y-auto')) {
        return `class="${p1} md:h-[calc(100vh-110px)] md:overflow-y-auto hide-scrollbar custom-scrollbar"`;
      }
      return match;
    });
  }

  // Add hide-scrollbar utility to style.css if it doesn't exist
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});

// Also inject the custom scrollbar CSS into the global styles to make the internal scrollbar look premium
const stylePath = path.join(dir, 'src', 'style.css');
if (fs.existsSync(stylePath)) {
  let cssContent = fs.readFileSync(stylePath, 'utf8');
  if (!cssContent.includes('.custom-scrollbar')) {
    cssContent += `\n
/* Custom Scrollbar for Desktop App Layout */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #d1d5db;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
`;
    fs.writeFileSync(stylePath, cssContent, 'utf8');
    console.log('Updated src/style.css with custom scrollbar styles');
  }
}
