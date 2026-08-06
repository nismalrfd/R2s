const fs = require('fs');

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

const shapesLayer = `
  <!-- Advanced Geometric Accent Layer -->
  <div class="fixed inset-0 z-[-1] pointer-events-none overflow-hidden opacity-40">
    <!-- Floating Outline Ring -->
    <svg class="absolute top-[15%] left-[5%] w-20 h-20 text-blue-600 animate-[spin_30s_linear_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="0.5"><circle cx="12" cy="12" r="10"/></svg>
    <!-- Floating Diamond -->
    <svg class="absolute top-[65%] right-[8%] w-14 h-14 text-red-500 animate-[spin_25s_linear_infinite_reverse]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="0.5"><rect x="4" y="4" width="16" height="16" rx="2" transform="rotate(45 12 12)"/></svg>
    <!-- Floating Plus -->
    <svg class="absolute top-[10%] right-[35%] w-10 h-10 text-blue-400 animate-float-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
    <!-- Floating Concentric Circles -->
    <svg class="absolute bottom-[15%] left-[20%] w-32 h-32 text-blue-300 opacity-20 animate-float-reverse-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="0.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
    <!-- Floating Triangle -->
    <svg class="absolute top-[40%] left-[40%] w-12 h-12 text-blue-500 opacity-30 animate-[spin_40s_linear_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="0.5"><polygon points="12,2 22,20 2,20" stroke-linejoin="round"/></svg>
  </div>
`;

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    if (!content.includes('Advanced Geometric Accent Layer')) {
        content = content.replace('<!-- Premium Mesh Background -->', '<!-- Premium Mesh Background -->\n' + shapesLayer);
        fs.writeFileSync(file, content);
    }
});

console.log('Advanced geometric shapes added to all pages.');
