const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.html'));

const oldRegistrationRegex = /navigator\.serviceWorker\.register\('\/sw\.js'\)\.then\(registration => \{[\s\S]*?console\.log\('SW registered: ', registration\.scope\);[\s\S]*?\}\)\.catch\(err => \{[\s\S]*?console\.log\('SW registration failed: ', err\);[\s\S]*?\}\);/;

const newRegistrationStr = `navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).then(registration => {
          console.log('SW registered: ', registration.scope);
          
          // Force an immediate update check
          registration.update();
          
          // Listen for the new Service Worker taking control
          let refreshing = false;
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
              refreshing = true;
              window.location.reload();
            }
          });
        }).catch(err => {
          console.log('SW registration failed: ', err);
        });`;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    if (oldRegistrationRegex.test(content) && !content.includes("updateViaCache: 'none'")) {
        content = content.replace(oldRegistrationRegex, newRegistrationStr);
        fs.writeFileSync(file, content);
        console.log('Updated SW registration in ' + file);
    } else {
        console.log('No update needed for ' + file);
    }
});
