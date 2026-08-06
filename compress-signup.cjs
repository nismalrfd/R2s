const fs = require('fs');
let content = fs.readFileSync('signup.html', 'utf8');

// Container
content = content.replace('p-6 sm:p-12 relative bg-white overflow-y-auto hide-scrollbar custom-scrollbar', 'p-4 sm:p-8 relative bg-white overflow-hidden');

// Top nav
content = content.replace('<div class="w-full max-w-lg mx-auto flex items-center justify-between mb-8 shrink-0">', '<div class="w-full max-w-lg mx-auto flex items-center justify-between mb-4 shrink-0">');

// Mobile logo 
content = content.replace('w-16 h-16 mb-8', 'w-12 h-12 mb-4');

// Step 1 title
content = content.replace('<p class="text-gray-500 font-medium text-sm mb-10">', '<p class="text-gray-500 font-medium text-sm mb-4">');
content = content.replace('<h2 class="text-3xl font-bold text-slate-950 mb-2 tracking-tight">What brings you to R2s?</h2>', '<h2 class="text-2xl font-bold text-slate-950 mb-1 tracking-tight">What brings you to R2s?</h2>');

// Grid gap & margin
content = content.replace('<div class="grid grid-cols-2 gap-4 mb-10">', '<div class="grid grid-cols-2 gap-3 mb-6">');

// Role card padding
content = content.replace(/rounded-\[20px\] p-5 flex/g, 'rounded-[16px] p-3 flex');

// Glassmorphic icons scaling down slightly
content = content.replace(/w-14 h-14 mx-auto mb-4/g, 'w-10 h-10 mx-auto mb-2');
content = content.replace(/w-14 h-14 shrink-0/g, 'w-10 h-10 shrink-0');
content = content.replace(/w-10 h-10 bg-gradient-to-br/g, 'w-8 h-8 bg-gradient-to-br');
content = content.replace(/w-11 h-11 bg-white\/60/g, 'w-9 h-9 bg-white/60');
content = content.replace(/class="w-5 h-5 text-red-600"/g, 'class="w-4 h-4 text-red-600"');
content = content.replace(/w-9 h-9 bg-gradient-to-br from-red-400 to-red-600 rounded-full/g, 'w-7 h-7 bg-gradient-to-br from-red-400 to-red-600 rounded-full');
content = content.replace(/w-6 h-6 bg-gradient-to-br from-red-300 to-red-500/g, 'w-4 h-4 bg-gradient-to-br from-red-300 to-red-500');
content = content.replace(/right-6 top-3/g, 'right-4 top-2');

// Text sizing inside grid
content = content.replace(/text-sm mb-1/g, 'text-xs mb-0.5');

// Agent flex layout gap
content = content.replace(/<div class="flex items-center gap-5">/g, '<div class="flex items-center gap-3">');

// Step 1 continue button
content = content.replace(/py-4 rounded-full font-bold/g, 'py-2.5 rounded-full font-bold text-sm');
content = content.replace(/mt-10/g, 'mt-4'); 

// Step 2 title
content = content.replace('<div class="flex items-center gap-4 mb-8">', '<div class="flex items-center gap-3 mb-4">');

// Form gap
content = content.replace('<form id="signupForm" class="w-full flex flex-col gap-6"', '<form id="signupForm" class="w-full flex flex-col gap-3"');

// Form box padding
content = content.replace(/rounded-\[24px\] p-6 shadow-sm/g, 'rounded-[20px] p-4 shadow-sm');
content = content.replace(/<div class="flex flex-col gap-6 w-full">/g, '<div class="flex flex-col gap-3 w-full">');

// Input padding
content = content.replace(/px-4 py-3\.5/g, 'px-3 py-2');
content = content.replace(/py-5 rounded-2xl/g, 'py-3 rounded-xl text-sm');

// T&C layout
content = content.replace('<div class="flex gap-4">', '<div class="flex gap-3">');
content = content.replace('w-6 h-6 rounded-md', 'w-5 h-5 rounded');
content = content.replace('mt-6 pt-6', 'mt-4 pt-4');

fs.writeFileSync('signup.html', content);
console.log('Signup layout compressed!');
