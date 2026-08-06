const fs = require('fs');
let content = fs.readFileSync('signup.html', 'utf8');

// Remove absolute top-0 left-0 from the steps
content = content.replace(/step-container step-hidden-right absolute top-0 left-0/g, 'step-container step-hidden-right');

// Add staggered animation classes to inputs
// I'll add a simple CSS animation block to the head for advanced stagger
const animationCss = `
    /* Staggered form animations */
    @keyframes slideUpFade {
      0% { opacity: 0; transform: translateY(15px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .step-container:not(.step-hidden-right):not(.step-hidden-left) .animate-stagger-1 { animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; opacity: 0; }
    .step-container:not(.step-hidden-right):not(.step-hidden-left) .animate-stagger-2 { animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
    .step-container:not(.step-hidden-right):not(.step-hidden-left) .animate-stagger-3 { animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
    .step-container:not(.step-hidden-right):not(.step-hidden-left) .animate-stagger-4 { animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards; opacity: 0; }
`;

if (!content.includes('slideUpFade')) {
  content = content.replace('</style>', animationCss + '\n  </style>');
}

// Add these classes to the flex columns in Step 2, 3, 4
// Step 2 Standard Personal Details (first flex col)
content = content.replace('<div class="w-full">\n              <h3', '<div class="w-full animate-stagger-1">\n              <h3');
// Dynamic Blocks
content = content.replace('id="cond_nar" class="w-full', 'id="cond_nar" class="w-full animate-stagger-2');
content = content.replace('id="cond_cp" class="w-full', 'id="cond_cp" class="w-full animate-stagger-2');
content = content.replace('id="cond_builder" class="w-full', 'id="cond_builder" class="w-full animate-stagger-2');

// Step 3
content = content.replace('<div class="w-full">\n            <h3 class="text-sm font-bold text-slate-950 flex items-center gap-2 mb-4"><i data-lucide="map-pin"', '<div class="w-full animate-stagger-1">\n            <h3 class="text-sm font-bold text-slate-950 flex items-center gap-2 mb-4"><i data-lucide="map-pin"');

// Step 4
content = content.replace('<div class="w-full">\n            <h3 class="text-sm font-bold text-slate-950 mb-3', '<div class="w-full animate-stagger-1">\n            <h3 class="text-sm font-bold text-slate-950 mb-3');


fs.writeFileSync('signup.html', content);
console.log('Fixed cut-off issue and added advanced staggered animations.');
