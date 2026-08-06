const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  console.log(`--- ${f} ---`);
  const links = [...content.matchAll(/href=["']([^"']+)["']/g)].map(m => m[1]).filter(l => !l.startsWith('http') && !l.startsWith('/src') && !l.endsWith('.json') && !l.startsWith('tel:') && !l.startsWith('mailto:'));
  const onclicks = [...content.matchAll(/onclick=["']([^"']+)["']/g)].map(m => m[1]);
  console.log('Links:', links);
  console.log('Onclicks:', onclicks);
});
