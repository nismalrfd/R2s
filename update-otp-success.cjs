const fs = require('fs');

let content = fs.readFileSync('login.html', 'utf8');

// 1. Add ID to the Verify button and wrap content
const oldBtn = `<button type="submit" class="w-full bg-red-600 text-white py-4 mt-2 rounded-full font-bold hover:bg-red-700 hover:scale-105 hover:shadow-[0_4px_20px_rgba(220,38,38,0.4)] transition-all duration-300 text-sm flex items-center justify-center gap-2 group">
            Verify & Secure Login <i data-lucide="check-circle-2" class="w-4 h-4 transition-transform group-hover:scale-110"></i>
          </button>`;

const newBtn = `<button type="submit" id="verifyBtn" class="w-full bg-red-600 text-white py-4 mt-2 rounded-full font-bold hover:bg-red-700 hover:scale-105 hover:shadow-[0_4px_20px_rgba(220,38,38,0.4)] transition-all duration-300 text-sm flex items-center justify-center gap-2 group relative overflow-hidden">
            <div id="verifyBtnContent" class="flex items-center gap-2">
              Verify & Secure Login <i data-lucide="check-circle-2" class="w-4 h-4 transition-transform group-hover:scale-110"></i>
            </div>
          </button>`;

content = content.replace(oldBtn, newBtn);

// 2. Replace handleVerify function
const oldVerify = `    function handleVerify(e) {
      e.preventDefault();
      let code = Array.from(otpInputs).map(input => input.value).join('');
      
      // Auto-Login if correct
      if (code === '1234') {
        window.location.href = '/dashboard.html';
      } else {
        showError();
      }
    }`;

const newVerify = `    function handleVerify(e) {
      e.preventDefault();
      let code = Array.from(otpInputs).map(input => input.value).join('');
      
      if (code === '1234') {
        const btn = document.getElementById('verifyBtn');
        const content = document.getElementById('verifyBtnContent');
        
        // Ensure button keeps its width during transition
        btn.style.width = btn.offsetWidth + 'px';
        
        // Show processing state
        content.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Processing...';
        if (typeof lucide !== 'undefined') lucide.createIcons();
        btn.classList.replace('bg-red-600', 'bg-slate-950');
        btn.classList.replace('hover:bg-red-700', 'hover:bg-slate-800');
        
        setTimeout(() => {
          // Show success state (green)
          content.innerHTML = '<i data-lucide="check" class="w-5 h-5"></i> Verification Successful';
          if (typeof lucide !== 'undefined') lucide.createIcons();
          btn.classList.replace('bg-slate-950', 'bg-emerald-500');
          btn.classList.replace('hover:bg-slate-800', 'hover:bg-emerald-600');
          
          setTimeout(() => {
            window.location.href = '/dashboard.html';
          }, 1000);
        }, 1200);
      } else {
        showError();
      }
    }`;

content = content.replace(oldVerify, newVerify);

fs.writeFileSync('login.html', content);
console.log('OTP success animation added to login.html');
