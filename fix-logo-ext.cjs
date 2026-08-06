const fs = require('fs');
const path = require('path');

const dir = process.cwd();
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  let updated = content.replace(/\/logo\.jpg/g, '/LOGO.png');

  if (updated !== content) {
    fs.writeFileSync(filePath, updated);
    console.log(`Updated image source in ${file}`);
  }
});
