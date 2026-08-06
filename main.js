// Initialize Lucide Icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// Global utility for page transitions
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-transition');
});
