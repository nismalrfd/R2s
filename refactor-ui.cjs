const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\nismal\\Downloads\\web for r2s';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // 1. Replace Body Backgrounds
  content = content.replace(/class="([^"]*)bg-\[#F8F5F2\]([^"]*)"/, 'class="$1bg-white$2"');
  content = content.replace(/class="([^"]*)bg-\[#F6F6F8\]([^"]*)"/, 'class="$1bg-white$2"');
  content = content.replace(/class="([^"]*)bg-\[#F3F4F6\] md:bg-white([^"]*)"/, 'class="$1bg-white$2"');
  
  // 2. Fix specific file links
  if (file === 'index.html') {
    content = content.replace(/href="#"/g, 'href="/login.html"');
    content = content.replace(/onclick="[^"]*"/, 'onclick="window.location.href=\'/login.html\'"');
  }
  
  if (file === 'login.html') {
    // Phone form submit -> verify.html
    content = content.replace(/<form class="flex flex-col gap-6 w-full"[^>]*>/, '<form class="flex flex-col gap-6 w-full" onsubmit="event.preventDefault(); window.location.href=\'/verify.html\'">');
    // Sign up button -> signup.html
    content = content.replace(/<button class="flex-1 bg-white[^>]*>[\s\S]*?Sign up[\s\S]*?<\/button>/, '<button onclick="window.location.href=\'/signup.html\'" class="flex-1 bg-white border border-gray-200 text-[#111111] py-4 rounded-2xl font-bold hover:bg-gray-50 transition-colors shadow-sm text-base">Sign up</button>');
  }
  
  if (file === 'verify.html') {
    content = content.replace(/<form class="flex flex-col gap-10 w-full"[^>]*>/, '<form class="flex flex-col gap-10 w-full" onsubmit="event.preventDefault(); window.location.href=\'/dashboard.html\'">');
  }

  if (file === 'signup.html') {
    // The signup form submission is handled by JS inside the file, but we should ensure the final step redirects.
    // The JS has: window.location.href = '/dashboard.html' which is already good.
  }

  if (file === 'dashboard.html') {
    // Top right avatar should link to profile
    content = content.replace(/<div class="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm cursor-pointer">/, '<a href="/profile.html" class="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm cursor-pointer block">');
    content = content.replace(/<\/div>\s*<\/div>\s*<\/div>\s*<!-- Search & Filters -->/, '</a>\n      </div>\n    </div>\n\n    <!-- Search & Filters -->');
  }

  if (file === 'profile.html') {
    // Edit profile link
    content = content.replace(/<a href="#" class="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-black transition-all group">/g, '<a href="/edit-profile.html" class="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-black transition-all group">');
    
    // The JS for logout button might need to explicitly link to login.html
    // It's already: onclick="window.location.href='/login.html'" so it's good.
  }

  // Ensure floating nav has explicit active states or is linked everywhere if present
  // Add border/shadow to main cards to prevent white-on-white bleeding
  if (file === 'login.html' || file === 'signup.html' || file === 'verify.html' || file === 'add-property.html' || file === 'edit-profile.html') {
    content = content.replace(/bg-white([^>]*?)shadow-lg/g, 'bg-white$1shadow-xl border border-gray-100');
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
