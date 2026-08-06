const fs = require('fs');
const path = require('path');

const files = ['index.html', 'signup.html', 'dashboard.html'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Accessibility: Add aria-hidden="true" to decorative icons
    content = content.replace(/<i data-lucide="([^"]+)"([^>]*)>/g, (match, iconName, rest) => {
        if (!rest.includes('aria-hidden')) {
            return `<i data-lucide="${iconName}"${rest} aria-hidden="true">`;
        }
        return match;
    });

    // 2. Performance: Add loading="lazy" to images
    content = content.replace(/<img ([^>]+)>/g, (match, attrs) => {
        if (!attrs.includes('loading="lazy"')) {
            return `<img ${attrs} loading="lazy">`;
        }
        return match;
    });

    // 3. UI Polish: Ensure overflow-x-hidden on body
    if (!content.includes('overflow-x-hidden')) {
        content = content.replace(/<body class="/, '<body class="overflow-x-hidden ');
    }

    // Write back
    fs.writeFileSync(file, content);
});

// 4. Form Validation & Global A11y JS for dashboard.html
let dashContent = fs.readFileSync('dashboard.html', 'utf8');

const validationJS = `
    // Form Validation logic
    function validateForm(containerId) {
        const container = document.getElementById(containerId);
        if(!container) return true;
        
        let isValid = true;
        const requiredInputs = container.querySelectorAll('input[required], select[required]');
        
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('border-red-500', 'bg-red-50');
                isValid = false;
            } else {
                input.classList.remove('border-red-500', 'bg-red-50');
            }
        });
        
        return isValid;
    }

    // Global ESC key listener for Modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModals = [
                document.getElementById('addPropertyModal'),
                document.getElementById('editProfileModal'),
                document.getElementById('tcModal'),
                document.getElementById('deleteModal'),
                document.getElementById('fullscreenModal')
            ];
            
            openModals.forEach(modal => {
                if (modal && !modal.classList.contains('opacity-0') && !modal.classList.contains('translate-y-full')) {
                    // Trigger the respective close functions based on ID
                    if(modal.id === 'addPropertyModal') toggleAddProperty();
                    else if(modal.id === 'editProfileModal') toggleEditProfile();
                    else if(modal.id === 'tcModal') toggleTCModal();
                    else if(modal.id === 'deleteModal') cancelDelete();
                    else if(modal.id === 'fullscreenModal') closeFullscreenModal();
                }
            });
        }
    });
`;

if (!dashContent.includes('validateForm(containerId)')) {
    dashContent = dashContent.replace('if (typeof lucide !== \'undefined\') {', validationJS + '\n    if (typeof lucide !== \'undefined\') {');
    
    // Add required attributes to wizard Step 1 inputs
    dashContent = dashContent.replace('id="wiz_prop_name" placeholder="Enter property name"', 'id="wiz_prop_name" placeholder="Enter property name" required');
    dashContent = dashContent.replace('id="wiz_price" placeholder="Enter Price"', 'id="wiz_price" placeholder="Enter Price" required');
    
    // Update submit property to validate
    dashContent = dashContent.replace(
        'function submitProperty() {',
        'function submitProperty() {\n      if(!validateForm(\'wizardStep1\')) {\n        alert(\'Please fill in all required fields marked with a red border.\');\n        return;\n      }'
    );
    
    fs.writeFileSync('dashboard.html', dashContent);
}

// 5. Form Validation & Global A11y JS for signup.html
let signupContent = fs.readFileSync('signup.html', 'utf8');

if (!signupContent.includes('Escape')) {
    const signupValidationJS = `
    // Global ESC key listener
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Can add modal close logic here if signup had modals
        }
    });
`;
    signupContent = signupContent.replace('if (typeof lucide !== \'undefined\') {', signupValidationJS + '\n    if (typeof lucide !== \'undefined\') {');
    fs.writeFileSync('signup.html', signupContent);
}

console.log('Audit fixes applied to all files.');
