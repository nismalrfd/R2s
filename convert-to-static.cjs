const fs = require('fs');
const path = require('path');

const files = [
    'index.html',
    'signup.html',
    'dashboard.html',
    'login.html',
    'add-property.html',
    'edit-profile.html',
    'properties.html',
    'property-detail.html'
];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        // Remove old Vite module import
        content = content.replace('<script type="module" src="/src/main.js"></script>', '');
        
        // Add Tailwind Browser Script and standard links if not already present
        if (!content.includes('unpkg.com/@tailwindcss/browser')) {
            content = content.replace('</head>', `  <script src="https://unpkg.com/@tailwindcss/browser@4"></script>\n  <link rel="stylesheet" href="style.css">\n</head>`);
        }
        if (!content.includes('src="main.js"')) {
            content = content.replace('</body>', `  <script src="main.js"></script>\n</body>`);
        }
        
        fs.writeFileSync(file, content);
    }
});

// Copy style.css and main.js to root, removing tailwind directives
if (fs.existsSync('src/style.css')) {
    let style = fs.readFileSync('src/style.css', 'utf8');
    // Remove @import and @theme blocks as they are not needed/supported the same way in browser script without type="text/tailwindcss"
    style = style.replace(/@import "tailwindcss";/g, '');
    style = style.replace(/@theme\s*\{[\s\S]*?\}/g, '');
    fs.writeFileSync('style.css', style.trim());
}

if (fs.existsSync('src/main.js')) {
    let main = fs.readFileSync('src/main.js', 'utf8');
    fs.writeFileSync('main.js', main);
}

console.log('Conversion to pure static HTML/JS/CSS complete.');
