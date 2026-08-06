const fs = require('fs');

const files = [
    'add-property.html',
    'edit-profile.html',
    'login.html',
    'properties.html',
    'property-detail.html'
];

const styleBlock = `
  <style>
    /* Premium Visual Animations & Patterns */
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }
    @keyframes float-reverse {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(20px) rotate(-5deg); }
    }
    .animate-float-slow {
      animation: float 20s ease-in-out infinite;
    }
    .animate-float-reverse-slow {
      animation: float-reverse 25s ease-in-out infinite;
    }
    .bg-dotted-pattern {
      background-image: radial-gradient(circle, #e5e7eb 1px, transparent 1px);
      background-size: 24px 24px;
    }
    .top-accent-blue {
      border-top: 4px solid #2563EB !important;
    }
    .top-accent-red {
      border-top: 4px solid #EF4444 !important;
    }
  </style>
`;

const meshBg = `
  <!-- Premium Mesh Background -->
  <div class="fixed inset-0 z-[-1] overflow-hidden bg-[#FAFBFF]">
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[100px] animate-float-slow"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-400/10 rounded-full blur-[100px] animate-float-reverse-slow"></div>
  </div>
  <div class="fixed inset-0 z-[-2] bg-dotted-pattern opacity-40 pointer-events-none"></div>
`;

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // 1. Convert Red to Blue for buttons/primary text
    content = content.replace(/bg-red-600/g, 'bg-blue-600 hover:-translate-y-0.5 hover:shadow-lg');
    content = content.replace(/hover:bg-red-700/g, 'hover:bg-blue-700');
    content = content.replace(/text-red-600/g, 'text-blue-600');
    content = content.replace(/bg-red-50/g, 'bg-blue-50');
    content = content.replace(/border-red-500/g, 'border-blue-500');
    content = content.replace(/shadow-\[0_4px_20px_rgba\(220,38,38,0\.4\)\]/g, 'shadow-[0_4px_20px_rgba(37,99,235,0.4)]');

    // Focus rings
    content = content.replace(/focus:border-slate-950/g, 'focus:border-blue-500');
    content = content.replace(/focus:ring-slate-950\/5/g, 'focus:ring-blue-500/20');

    // 2. Add Premium Styles and Shapes
    if (!content.includes('@keyframes float')) {
        content = content.replace('</head>', styleBlock + '\n</head>');
    }

    if (!content.includes('Premium Mesh Background')) {
        // Find body tag
        content = content.replace(/<body[^>]*>/, (match) => {
            // make sure it has the new bg color
            let newBody = match.replace(/bg-gray-50|bg-slate-950|bg-[#f8fafc]/, 'bg-[#FAFBFF] overflow-x-hidden');
            if(!newBody.includes('overflow-x-hidden')) {
               newBody = newBody.replace('class="', 'class="overflow-x-hidden ');
            }
            return newBody + '\n' + meshBg;
        });
    }

    // 3. Add top accents and elegant shadows to main cards/containers
    if (file === 'login.html') {
        content = content.replace(/bg-white p-8 md:p-12 rounded-\[32px\] shadow-2xl/g, 'bg-white p-8 md:p-12 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 top-accent-blue');
    } else {
        // generic card replacements if any exist
        content = content.replace(/bg-white rounded-3xl p-6 shadow-sm border border-gray-100/g, 'bg-white rounded-3xl p-6 shadow-sm border border-gray-100 top-accent-blue');
        content = content.replace(/property-card bg-white rounded-\[20px\]/g, 'property-card bg-white rounded-[24px] top-accent-blue shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1');
    }

    fs.writeFileSync(file, content);
});

console.log('Applied premium SaaS theme to all remaining HTML files.');
