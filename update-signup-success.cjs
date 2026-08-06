const fs = require('fs');

let content = fs.readFileSync('signup.html', 'utf8');

const successModalHtml = `
  <!-- Success Modal -->
  <div id="successModal" class="fixed inset-0 z-[5000] flex items-center justify-center p-4 opacity-0 pointer-events-none transition-opacity duration-300">
    <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-md"></div>
    <div class="relative bg-white p-8 md:p-10 rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col items-center text-center max-w-sm w-full transform scale-95 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" id="successContent">
      <div class="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 relative">
        <div class="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
        <i data-lucide="check-circle-2" class="w-12 h-12 text-green-500 relative z-10"></i>
      </div>
      <h3 class="text-3xl font-extrabold text-slate-950 mb-3 tracking-tight">Welcome to R2s!</h3>
      <p class="text-sm font-medium text-gray-500 mb-8">Your professional account has been successfully created. Redirecting to your dashboard...</p>
      
      <!-- Progress Bar -->
      <div class="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div class="bg-green-500 h-1.5 rounded-full w-0 transition-all duration-[2000ms] ease-linear" id="redirectProgress"></div>
      </div>
    </div>
  </div>
`;

// Insert the modal HTML before the closing body tag
content = content.replace('</body>', successModalHtml + '\n</body>');


// Update handleGenericForm logic
const newHandleGenericForm = `
    function handleGenericForm(e) {
      e.preventDefault();
      
      const btn = document.getElementById('submitBtn');
      const content = document.getElementById('submitContent');
      
      // Loading State
      btn.style.width = btn.offsetWidth + 'px'; 
      content.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Processing...';
      if (typeof lucide !== 'undefined') lucide.createIcons();
      btn.classList.replace('bg-red-600', 'bg-slate-950');
      
      setTimeout(() => {
        // Show Advanced Success Modal
        const modal = document.getElementById('successModal');
        const modalContent = document.getElementById('successContent');
        const progress = document.getElementById('redirectProgress');
        
        modal.classList.remove('opacity-0', 'pointer-events-none');
        setTimeout(() => {
            modalContent.classList.remove('scale-95');
            // Start progress bar animation
            setTimeout(() => {
                progress.style.width = '100%';
            }, 50);
        }, 10);
        
        // Redirect after animation completes
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 2000);
        
      }, 1000);
    }
`;

// Replace the old handleGenericForm
content = content.replace(/function handleGenericForm\(e\) \{[\s\S]*?\}, 1500\);\s*\}/, newHandleGenericForm);


fs.writeFileSync('signup.html', content);
console.log('Signup Success Modal added successfully.');
