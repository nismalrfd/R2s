const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Fix watermark size
    if (content.includes('h-6 md:h-7 object-contain')) {
        content = content.replace('h-6 md:h-7 object-contain', 'w-36 md:w-48 h-auto object-contain');
        changed = true;
    } else if (content.includes('h-4 md:h-5 object-contain')) { // fallback just in case
        content = content.replace('h-4 md:h-5 object-contain', 'w-36 md:w-48 h-auto object-contain');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content);
        console.log('Resized watermark in ' + file);
    }
});
