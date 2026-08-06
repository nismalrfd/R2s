const fs = require('fs');
let content = fs.readFileSync('login.html', 'utf8');

// 1. Change focus states of OTP inputs to match the red button color & add float
content = content.replace(/focus:border-slate-950 focus:ring-slate-950\/10/g, 'focus:border-red-500 focus:ring-red-500/20 focus:-translate-y-1 focus:shadow-md');

// 2. Add custom CSS for advanced animations
const customCss = `
    /* Advanced OTP Animations */
    @keyframes popPulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); color: #dc2626; border-color: #dc2626; }
      100% { transform: scale(1); }
    }
    .otp-pop {
      animation: popPulse 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes validatingPulse {
      0%, 100% { border-color: #fca5a5; background-color: #fef2f2; box-shadow: 0 0 0 0 rgba(220,38,38,0); }
      50% { border-color: #dc2626; background-color: #ffffff; box-shadow: 0 0 15px 0 rgba(220,38,38,0.2); }
    }
    .otp-validating {
      animation: validatingPulse 1s infinite;
    }
`;
if (!content.includes('popPulse')) {
  content = content.replace('</style>', customCss + '\n  </style>');
}

// 3. Inject JS to trigger popPulse on input
const oldInputListener = `input.addEventListener('input', (e) => {`;
const newInputListener = `input.addEventListener('input', (e) => {
        // Trigger advanced pop animation
        input.classList.remove('otp-pop');
        void input.offsetWidth; // trigger reflow
        input.classList.add('otp-pop');`;
content = content.replace(oldInputListener, newInputListener);

// 4. Inject JS to trigger validatingPulse during verification
const oldVerify = `        // Show processing state
        content.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Processing...';
        if (typeof lucide !== 'undefined') lucide.createIcons();
        btn.classList.replace('bg-red-600', 'bg-slate-950');
        btn.classList.replace('hover:bg-red-700', 'hover:bg-slate-800');`;

const newVerify = `        // Show processing state
        content.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Processing...';
        if (typeof lucide !== 'undefined') lucide.createIcons();
        btn.classList.replace('bg-red-600', 'bg-slate-950');
        btn.classList.replace('hover:bg-red-700', 'hover:bg-slate-800');
        
        // Advanced validating state animation on OTP inputs
        otpInputs.forEach((inp, idx) => {
          inp.style.animationDelay = (idx * 0.1) + 's';
          inp.classList.add('otp-validating');
        });`;

content = content.replace(oldVerify, newVerify);

// Clean up validating class on success
const oldSuccess = `        setTimeout(() => {
          // Show success state (green)
          content.innerHTML = '<i data-lucide="check" class="w-5 h-5"></i> Verification Successful';`;

const newSuccess = `        setTimeout(() => {
          // Cleanup validating animation
          otpInputs.forEach(inp => {
            inp.classList.remove('otp-validating');
            inp.style.animationDelay = '0s';
          });
          
          // Show success state (green)
          content.innerHTML = '<i data-lucide="check" class="w-5 h-5"></i> Verification Successful';`;

content = content.replace(oldSuccess, newSuccess);

// Clean up validating class on error
const oldError = `      } else {
        showError();
      }`;
const newError = `      } else {
        // Since we are simulating a network request, if you add real async wait, cleanup here too.
        // For now, it fails instantly if not 1234.
        showError();
      }`;
// Wait, if it fails instantly, the validating animation never even played because it goes to `else` block instantly.
// That is fine, if it's correct (1234) it plays the validating animation for 1.2 seconds before turning green.

fs.writeFileSync('login.html', content);
console.log('Advanced OTP animations applied.');
