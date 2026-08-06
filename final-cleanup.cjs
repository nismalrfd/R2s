const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Fix the titles
    content = content.replace(/<title>Nestora.*?<\/title>/g, '<title>R2s Realtors</title>');

    // Fix the PWA banner hiding translation
    content = content.replace(/translate-y-full/g, 'translate-y-[200%]');

    fs.writeFileSync(file, content);
    console.log('Cleaned up ' + file);
});
