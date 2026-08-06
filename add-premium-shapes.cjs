const fs = require('fs');

const files = ['index.html', 'signup.html', 'dashboard.html'];

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

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Add Styles
    if (!content.includes('@keyframes float')) {
        content = content.replace('</head>', styleBlock + '\n</head>');
    }

    // Add Dotted Pattern
    if (!content.includes('bg-dotted-pattern')) {
        content = content.replace('<!-- Premium Mesh Background -->', '<!-- Premium Mesh Background -->\n  <div class="fixed inset-0 z-[-2] bg-dotted-pattern opacity-40 pointer-events-none"></div>');
    }

    // Animate the existing blur blobs
    content = content.replace(/blur-\[100px\]/g, 'blur-[100px] animate-float-slow');
    content = content.replace(/blur-\[120px\]/g, 'blur-[120px] animate-float-reverse-slow');

    if (file === 'dashboard.html') {
        // Add top accents to cards
        content = content.replace(/property-card bg-white rounded-\[24px\]/g, 'property-card bg-white rounded-[24px] top-accent-blue');
        content = content.replace(/bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col/g, 'bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col top-accent-blue');
    }

    if (file === 'signup.html') {
        // Add top accent to main card
        content = content.replace('bg-white p-6 md:p-10 rounded-[32px]', 'bg-white p-6 md:p-10 rounded-[32px] top-accent-blue');
    }

    fs.writeFileSync(file, content);
});

console.log('Premium visual shapes, animations, and accents applied.');
