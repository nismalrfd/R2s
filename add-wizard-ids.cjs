const fs = require('fs');

let content = fs.readFileSync('dashboard.html', 'utf8');

// Add IDs to inputs in Step 1
content = content.replace(
  '<input type="text" placeholder="Enter property name" class="w-full bg-gray-50',
  '<input type="text" id="wiz_prop_name" placeholder="Enter property name" class="w-full bg-gray-50'
);
content = content.replace(
  '<select class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm cursor-pointer appearance-none">\n                  <option value="">Select</option>\n                  <option>Sale</option>\n                  <option>Rent</option>\n                  <option>Lease</option>',
  '<select id="wiz_service_type" class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm cursor-pointer appearance-none">\n                  <option value="">Select</option>\n                  <option>Sale</option>\n                  <option>Rent</option>\n                  <option>Lease</option>'
);
content = content.replace(
  '<input type="number" placeholder="Enter Price" class="w-full bg-gray-50',
  '<input type="number" id="wiz_price" placeholder="Enter Price" class="w-full bg-gray-50'
);
content = content.replace(
  '<input type="text" placeholder="Sq Ft / Cent / Acre" class="w-full bg-gray-50',
  '<input type="text" id="wiz_unit" placeholder="Sq Ft / Cent / Acre" class="w-full bg-gray-50'
);
content = content.replace(
  '<input type="number" placeholder="Total Floors" class="w-full bg-gray-50',
  '<input type="number" id="wiz_floors" placeholder="Total Floors" class="w-full bg-gray-50'
);

// Add IDs to inputs in Step 2
content = content.replace(
  '<select class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm cursor-pointer appearance-none">\n                  <option value="">Select</option>\n                  <option>Residential</option>\n                  <option>Commercial</option>\n                  <option>Estate</option>',
  '<select id="wiz_kind" class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm cursor-pointer appearance-none">\n                  <option value="">Select</option>\n                  <option>Residential</option>\n                  <option>Commercial</option>\n                  <option>Estate</option>'
);
content = content.replace(
  '<select class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm cursor-pointer appearance-none">\n                  <option value="">Select</option>\n                  <option>Apartment</option>\n                  <option>Villa</option>\n                  <option>House</option>\n                  <option>Flat</option>\n                  <option>Plot</option>',
  '<select id="wiz_res_type" class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm cursor-pointer appearance-none">\n                  <option value="">Select</option>\n                  <option>Apartment</option>\n                  <option>Villa</option>\n                  <option>House</option>\n                  <option>Flat</option>\n                  <option>Plot</option>'
);
content = content.replace(
  '<select class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm cursor-pointer appearance-none">\n                  <option value="">Select</option>\n                  <option>Office</option>\n                  <option>Shop</option>\n                  <option>Showroom</option>\n                  <option>Warehouse</option>\n                  <option>Building</option>',
  '<select id="wiz_com_type" class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm cursor-pointer appearance-none">\n                  <option value="">Select</option>\n                  <option>Office</option>\n                  <option>Shop</option>\n                  <option>Showroom</option>\n                  <option>Warehouse</option>\n                  <option>Building</option>'
);
content = content.replace(
  '<select class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm cursor-pointer appearance-none">\n                  <option value="">Select</option>\n                  <option>Tea Estate</option>\n                  <option>Coffee Estate</option>\n                  <option>Rubber Plantation</option>\n                  <option>Agricultural Land</option>\n                  <option>Farm Land</option>',
  '<select id="wiz_est_type" class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm cursor-pointer appearance-none">\n                  <option value="">Select</option>\n                  <option>Tea Estate</option>\n                  <option>Coffee Estate</option>\n                  <option>Rubber Plantation</option>\n                  <option>Agricultural Land</option>\n                  <option>Farm Land</option>'
);
content = content.replace(
  '<select class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm cursor-pointer appearance-none">\n                  <option value="">Select</option>\n                  <option>Ready to Move</option>\n                  <option>Under Construction</option>\n                  <option>New Launch</option>\n                  <option>Resale</option>',
  '<select id="wiz_status" class="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 outline-none focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 focus:bg-white transition-all text-slate-950 font-bold text-sm cursor-pointer appearance-none">\n                  <option value="">Select</option>\n                  <option>Ready to Move</option>\n                  <option>Under Construction</option>\n                  <option>New Launch</option>\n                  <option>Resale</option>'
);
content = content.replace(
  '<input type="date" class="w-full bg-gray-50',
  '<input type="date" id="wiz_date" class="w-full bg-gray-50'
);

// Update editPropertyAction to set values
const oldEditScript = `    function editPropertyAction() {
      // 1. Close the fullscreen modal
      closeFullscreenModal();
      
      // 2. Open the Add/Edit Property wizard after a slight delay for the closing animation
      setTimeout(() => {
        toggleAddProperty();
      }, 300);
    }`;

const newEditScript = `    function editPropertyAction() {
      // 1. Close the fullscreen modal
      closeFullscreenModal();
      
      // 2. Populate the wizard fields with mock "current saved details"
      document.getElementById('wiz_prop_name').value = 'Marina One';
      document.getElementById('wiz_service_type').value = 'Sale';
      document.getElementById('wiz_price').value = '46500000';
      document.getElementById('wiz_unit').value = '2550 Sq Ft';
      document.getElementById('wiz_floors').value = '14';
      
      document.getElementById('wiz_kind').value = 'Residential';
      document.getElementById('wiz_res_type').value = 'Apartment';
      document.getElementById('wiz_status').value = 'Ready to Move';
      document.getElementById('wiz_date').value = '2025-12-01';
      
      // Update header text to reflect editing mode
      const headerTitle = document.querySelector('#addPropertyContent h2');
      if (headerTitle) {
         headerTitle.innerHTML = '<i data-lucide="edit" class="w-6 h-6 text-red-600"></i> Edit Property';
         if(window.lucide) lucide.createIcons();
      }

      // 3. Open the Add/Edit Property wizard after a slight delay for the closing animation
      setTimeout(() => {
        toggleAddProperty();
      }, 300);
    }`;

content = content.replace(oldEditScript, newEditScript);

fs.writeFileSync('dashboard.html', content);
console.log('Wizard IDs added and editPropertyAction updated successfully.');
