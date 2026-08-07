
// --- Global Page Transition Loader ---
const _loaderHTML = `
  <div id="global-page-loader" class="fixed inset-0 bg-white z-[999999] flex flex-col items-center justify-center transition-opacity duration-500">
    <div class="relative flex items-center justify-center w-24 h-24 mb-4">
       <div class="absolute inset-0 border-[3px] border-gray-100 border-t-red-600 rounded-full animate-spin"></div>
       <img src="/LOGO.png" alt="Loading" class="h-8 object-contain animate-pulse">
    </div>
  </div>
`;
document.body.insertAdjacentHTML('afterbegin', _loaderHTML);

window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('global-page-loader');
        if(loader) {
            loader.classList.add('opacity-0');
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }, 400); // Small delay to guarantee they see the logo
});

document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href) {
        const href = link.getAttribute('href');
        // Ignore hash links, javascript links, and external blank links
        if (!href.startsWith('#') && !href.startsWith('javascript') && link.target !== '_blank' && link.origin === window.location.origin) {
            e.preventDefault();
            const loader = document.getElementById('global-page-loader');
            if(loader) {
                loader.style.display = 'flex';
                // Small delay to allow display to apply before fading in
                setTimeout(() => loader.classList.remove('opacity-0'), 10);
                setTimeout(() => window.location.href = link.href, 400);
            } else {
                window.location.href = link.href;
            }
        }
    }
});

// Initialize Lucide Icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// Global utility for page transitions
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-transition');
});
