const fs = require('fs');
const path = require('path');

const files = ['signup.html', 'edit-profile.html', 'add-property.html'];
const dir = process.cwd();

const validationJS = `
    // ==================== ADVANCED CUSTOM VALIDATION ====================
    function showFieldError(inputEl, message) {
      const wrapper = inputEl.parentElement.classList.contains('flex') && !inputEl.parentElement.classList.contains('flex-col') ? inputEl.parentElement : inputEl;
      let errBox = wrapper.nextElementSibling;
      if (!errBox || !errBox.classList.contains('custom-error-box')) {
        errBox = document.createElement('div');
        errBox.className = 'custom-error-box hidden opacity-0 translate-y-1 transition-all duration-300 flex items-center gap-2 text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100 text-xs font-bold mt-2';
        errBox.innerHTML = '<i data-lucide="alert-circle" class="w-4 h-4 shrink-0"></i> <span></span>';
        wrapper.parentNode.insertBefore(errBox, wrapper.nextSibling);
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
      errBox.querySelector('span').innerText = message;
      errBox.classList.remove('hidden');
      setTimeout(() => {
        errBox.classList.remove('opacity-0', 'translate-y-1');
        errBox.classList.add('opacity-100', 'translate-y-0');
      }, 10);
      wrapper.classList.add('border-red-500', 'ring-4', 'ring-red-500/10');
      
      wrapper.style.transform = 'translateX(4px)';
      setTimeout(() => wrapper.style.transform = 'translateX(-4px)', 100);
      setTimeout(() => wrapper.style.transform = 'translateX(4px)', 200);
      setTimeout(() => wrapper.style.transform = 'translateX(0)', 300);
    }

    function clearFieldError(inputEl) {
      const wrapper = inputEl.parentElement.classList.contains('flex') && !inputEl.parentElement.classList.contains('flex-col') ? inputEl.parentElement : inputEl;
      let errBox = wrapper.nextElementSibling;
      if (errBox && errBox.classList.contains('custom-error-box')) {
        errBox.classList.remove('opacity-100', 'translate-y-0');
        errBox.classList.add('opacity-0', 'translate-y-1');
        setTimeout(() => errBox.classList.add('hidden'), 300);
      }
      wrapper.classList.remove('border-red-500', 'ring-4', 'ring-red-500/10');
    }

    // Auto-clear on input
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('input[required], select[required], textarea[required]').forEach(input => {
        input.addEventListener('input', () => clearFieldError(input));
      });
    });

    function validateForm(form) {
      let isValid = true;
      let firstErr = null;
      form.querySelectorAll('input[required], select[required], textarea[required]').forEach(input => {
        if (!input.value.trim()) {
          showFieldError(input, 'This field is required.');
          isValid = false;
          if (!firstErr) firstErr = input;
        } else if (input.type === 'email' && !input.value.includes('@')) {
          showFieldError(input, 'Please enter a valid email address.');
          isValid = false;
          if (!firstErr) firstErr = input;
        } else if (input.type === 'tel' && input.value.length < 10) {
          showFieldError(input, 'Please enter a valid 10-digit number.');
          isValid = false;
          if (!firstErr) firstErr = input;
        }
      });
      if (firstErr) {
        firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return isValid;
    }

    function handleGenericForm(e) {
      e.preventDefault();
      if (validateForm(e.target)) {
        window.location.href = '/dashboard.html';
      }
    }
`;

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already injected
  if (content.includes('ADVANCED CUSTOM VALIDATION')) return;

  // 1. Update <form> tags to use novalidate and the new generic handler
  if (file === 'signup.html') {
    content = content.replace(/<form id="signupForm"([^>]*)onsubmit="handleSignup\(event\)"(.*?)>/, '<form id="signupForm"$1onsubmit="handleGenericForm(event)"$2 novalidate>');
    // Remove the old handleSignup function
    content = content.replace(/function handleSignup\(e\) \{[\s\S]*?window\.location\.href = '\/dashboard\.html';\s*\}/, '');
  } else {
    // For edit-profile and add-property
    content = content.replace(/<form([^>]*)onsubmit="event\.preventDefault\(\);\s*window\.location\.href='\/dashboard\.html'"(.*?)>/, '<form$1onsubmit="handleGenericForm(event)"$2 novalidate>');
  }

  // 2. Inject validation JS right before closing script tag (if lucide init exists) or right before </body>
  if (content.includes('if (typeof lucide !== \'undefined\') lucide.createIcons();')) {
    content = content.replace(
      'if (typeof lucide !== \'undefined\') lucide.createIcons();',
      'if (typeof lucide !== \'undefined\') lucide.createIcons();\n' + validationJS
    );
  } else {
    content = content.replace('</body>', '<script>\n' + validationJS + '\n</script>\n</body>');
  }

  fs.writeFileSync(filePath, content);
  console.log('Updated ' + file);
});
