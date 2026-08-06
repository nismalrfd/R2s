const fs = require('fs');

const files = [
    'properties.html',
    'property-detail.html',
    'add-property.html',
    'edit-profile.html'
];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(/md:pr-\[290px\]/g, 'md:pr-8 md:w-[calc(100%-280px)]');
        fs.writeFileSync(file, content);
    }
});
console.log('Fixed scrollbar layout in all pages.');
