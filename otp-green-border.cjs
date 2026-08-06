const fs = require('fs');
let content = fs.readFileSync('login.html', 'utf8');

const oldCode = `      if (code === '1234') {
        const btn = document.getElementById('verifyBtn');`;

const newCode = `      if (code === '1234') {
        // Add green border success state to OTP inputs
        otpInputs.forEach(input => {
          input.classList.remove('border-gray-200', 'border-red-500', 'text-red-600', 'bg-red-50', 'focus:border-slate-950');
          input.classList.add('border-emerald-500', 'text-emerald-600', 'bg-emerald-50');
        });
        
        const btn = document.getElementById('verifyBtn');`;

content = content.replace(oldCode, newCode);
fs.writeFileSync('login.html', content);
console.log('OTP green border added');
