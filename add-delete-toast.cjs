const fs = require('fs');

let content = fs.readFileSync('dashboard.html', 'utf8');

// 1. Add onclick to Delete Property button
content = content.replace(
  '<button class="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-50 text-red-600 font-bold text-sm transition-colors text-left group mt-2 border-t border-gray-50 pt-3 rounded-t-none">',
  '<button onclick="requestDeleteProperty()" class="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-50 text-red-600 font-bold text-sm transition-colors text-left group mt-2 border-t border-gray-50 pt-3 rounded-t-none">'
);

// 2. Add onchange to Status Select
content = content.replace(
  '<select class="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold text-sm text-slate-700 outline-none focus:ring-4 focus:ring-slate-950/5 appearance-none cursor-pointer">',
  '<select onchange="showStatusToast()" class="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold text-sm text-slate-700 outline-none focus:ring-4 focus:ring-slate-950/5 appearance-none cursor-pointer">'
);

// 3. Add Delete Confirmation Modal and Toast HTML before </body>
const newModals = `
  <!-- Simple Toast Notification -->
  <div id="simpleToast" class="fixed top-8 left-1/2 -translate-x-1/2 z-[6000] bg-slate-950 text-white px-6 py-3 rounded-full font-bold text-sm shadow-2xl flex items-center gap-2 transform -translate-y-8 opacity-0 pointer-events-none transition-all duration-300">
    <i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i> <span id="toastMsg">Status Updated</span>
  </div>

  <!-- Delete Confirmation Modal -->
  <div id="deleteModal" class="fixed inset-0 z-[5000] flex items-center justify-center p-4 opacity-0 pointer-events-none transition-opacity duration-300">
    <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onclick="cancelDelete()"></div>
    <div class="relative bg-white p-8 rounded-[32px] shadow-2xl flex flex-col items-center text-center max-w-sm w-full transform scale-95 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" id="deleteContent">
      <div class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <i data-lucide="alert-triangle" class="w-10 h-10 text-red-500"></i>
      </div>
      <h3 class="text-2xl font-extrabold text-slate-950 mb-2">Delete Property?</h3>
      <p class="text-sm font-medium text-gray-500 mb-8">Are you sure you want to delete this property? This action cannot be undone.</p>
      
      <div class="flex gap-4 w-full">
        <button onclick="cancelDelete()" class="flex-1 py-3.5 bg-gray-100 text-slate-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">
          Cancel
        </button>
        <button onclick="confirmDelete()" id="btnConfirmDelete" class="flex-1 py-3.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg flex items-center justify-center">
          Delete
        </button>
      </div>
    </div>
  </div>
`;

content = content.replace('</body>', newModals + '\n</body>');


// 4. Add JS Functions
const newJS = `
    let toastTimeout;
    function showStatusToast() {
      const toast = document.getElementById('simpleToast');
      toast.classList.remove('-translate-y-8', 'opacity-0', 'pointer-events-none');
      toast.classList.add('translate-y-0', 'opacity-100');
      
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('-translate-y-8', 'opacity-0', 'pointer-events-none');
      }, 3000);
    }

    function requestDeleteProperty() {
      const modal = document.getElementById('deleteModal');
      const content = document.getElementById('deleteContent');
      modal.classList.remove('opacity-0', 'pointer-events-none');
      setTimeout(() => content.classList.remove('scale-95'), 10);
    }

    function cancelDelete() {
      const modal = document.getElementById('deleteModal');
      const content = document.getElementById('deleteContent');
      content.classList.add('scale-95');
      setTimeout(() => modal.classList.add('opacity-0', 'pointer-events-none'), 300);
    }

    function confirmDelete() {
      const btn = document.getElementById('btnConfirmDelete');
      btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i>';
      if(window.lucide) lucide.createIcons();
      
      setTimeout(() => {
        cancelDelete();
        setTimeout(() => {
            closeFullscreenModal();
            // Reset button for next time
            btn.innerHTML = 'Delete';
            
            // Show toast
            setTimeout(() => {
                document.getElementById('toastMsg').innerText = 'Property Deleted';
                showStatusToast();
                setTimeout(() => {
                   document.getElementById('toastMsg').innerText = 'Status Updated';
                }, 3000);
            }, 300);
        }, 300);
      }, 1000);
    }
`;

content = content.replace('if (typeof lucide !== \'undefined\') {', newJS + '\n    if (typeof lucide !== \'undefined\') {');

fs.writeFileSync('dashboard.html', content);
console.log('Delete Modal and Toast added successfully.');
