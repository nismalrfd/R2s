const fs = require('fs');

let content = fs.readFileSync('dashboard.html', 'utf8');

// 1. Change the Create button onclick
content = content.replace(
  '<button id="btnSubmitProperty" onclick="toggleAddProperty()" class="px-6 py-3 md:px-8 md:py-3.5 bg-[#dc2626] text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg hidden items-center gap-2">',
  '<button id="btnSubmitProperty" onclick="submitProperty()" class="px-6 py-3 md:px-8 md:py-3.5 bg-[#dc2626] text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg hidden items-center gap-2">'
);

// 2. Add the Success Modal HTML just before the scripts
const successModalHtml = `
  <!-- Success Modal -->
  <div id="successModal" class="fixed inset-0 z-[4000] flex items-center justify-center p-4 opacity-0 pointer-events-none transition-opacity duration-300">
    <div class="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onclick="closeSuccessModal()"></div>
    <div class="relative bg-white p-8 md:p-10 rounded-[32px] shadow-2xl flex flex-col items-center text-center max-w-sm w-full transform scale-95 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" id="successContent">
      <div class="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 relative">
        <div class="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
        <i data-lucide="check-circle-2" class="w-10 h-10 text-green-500 relative z-10"></i>
      </div>
      <h3 class="text-2xl font-extrabold text-slate-950 mb-2">Success!</h3>
      <p class="text-sm font-medium text-gray-500 mb-8">Your property has been successfully created and listed on the network.</p>
      <button onclick="closeSuccessModal()" class="w-full py-3.5 bg-slate-950 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg">
        Done
      </button>
    </div>
  </div>
`;

content = content.replace('</body>', successModalHtml + '\n</body>');

// 3. Add the JS functions
const successJS = `
    function submitProperty() {
      // Close the Add Property Modal
      toggleAddProperty();
      
      // Show the Success Modal after a slight delay
      setTimeout(() => {
        const modal = document.getElementById('successModal');
        const content = document.getElementById('successContent');
        modal.classList.remove('opacity-0', 'pointer-events-none');
        setTimeout(() => content.classList.remove('scale-95'), 10);
      }, 300); 
    }

    function closeSuccessModal() {
      const modal = document.getElementById('successModal');
      const content = document.getElementById('successContent');
      content.classList.add('scale-95');
      setTimeout(() => modal.classList.add('opacity-0', 'pointer-events-none'), 300);
    }
`;

content = content.replace('if (typeof lucide !== \'undefined\') {', successJS + '\n    if (typeof lucide !== \'undefined\') {');

fs.writeFileSync('dashboard.html', content);
console.log('Success Modal added successfully.');
