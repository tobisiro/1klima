
document.addEventListener("DOMContentLoaded", function () {
    // Determine the current path depth to adjust relative links
    const isSubdirectory = window.location.pathname.includes('/produkty/'); // Simple check for depth
    const prefix = isSubdirectory ? '../' : '';

    // Function to load a component
    function loadComponent(id, file) {
        // Correct the file path if we are in a subdirectory
        const filePath = isSubdirectory ? `../${file}` : file;

        fetch(filePath)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${file}`);
                return response.text();
            })
            .then(html => {
                // Determine if any link corrections are needed
                let processedHtml = html;
                if (isSubdirectory) {
                    // Fix relative links (href="index.html" -> href="../index.html")
                    // Excluding anchors (#), mailto:, tel:, http, https
                    processedHtml = processedHtml.replace(/href="(?!(http|#|mailto:|tel:|\/))([^"]+)"/g, `href="../$2"`);
                    // Fix images (src="img/..." -> src="../img/...")
                    processedHtml = processedHtml.replace(/src="img\//g, `src="../img/`);
                }

                document.getElementById(id).innerHTML = processedHtml;

                // SPECIAL HANDLING: Re-initialize specific scripts after injection
                
                // 1. Mobile Menu Logic (re-binding)
                const mobileMenuBtn = document.getElementById('mobile-menu-btn');
                const mobileMenuClose = document.getElementById('mobile-menu-close');
                const mobileSidebar = document.getElementById('mobile-sidebar');
                const mobileOverlay = document.getElementById('mobile-overlay');

                if (mobileMenuBtn && mobileSidebar && mobileOverlay) {
                    function openSidebar() {
                        mobileSidebar.classList.remove('sidebar-closed');
                        mobileSidebar.classList.add('sidebar-open');
                        mobileOverlay.classList.remove('hidden');
                        setTimeout(() => { mobileOverlay.classList.remove('opacity-0'); }, 10);
                        document.body.style.overflow = 'hidden';
                    }

                    function closeSidebar() {
                        mobileSidebar.classList.remove('sidebar-open');
                        mobileSidebar.classList.add('sidebar-closed');
                        mobileOverlay.classList.add('opacity-0');
                        setTimeout(() => { mobileOverlay.classList.add('hidden'); }, 300);
                        document.body.style.overflow = '';
                    }

                    mobileMenuBtn.addEventListener('click', openSidebar);
                    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeSidebar);
                    mobileOverlay.addEventListener('click', closeSidebar);
                }

                // 2. Dark Mode Toggle Logic (re-binding)
                const themeToggleBtn = document.getElementById('theme-toggle');
                const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');
                const darkIcon = document.getElementById('theme-toggle-dark-icon');
                const lightIcon = document.getElementById('theme-toggle-light-icon');

                // Initialize Icons based on current state (state itself is handled in <head> for critical CSS)
                if (darkIcon && lightIcon) {
                    if (document.documentElement.classList.contains('dark')) {
                       lightIcon.classList.remove('hidden');
                    } else {
                       darkIcon.classList.remove('hidden');
                    }
                }

                function toggleTheme() {
                    const isDark = document.documentElement.classList.toggle('dark');
                    localStorage.setItem('color-theme', isDark ? 'dark' : 'light');
                    
                    if (darkIcon) darkIcon.classList.toggle('hidden', isDark);
                    if (lightIcon) lightIcon.classList.toggle('hidden', !isDark);
                }

                if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
                if (themeToggleMobileBtn) themeToggleMobileBtn.addEventListener('click', toggleTheme);

            })
            .catch(error => console.error('Error loading component:', error));
    }

    loadComponent('header-placeholder', 'header.html');
    loadComponent('footer-placeholder', 'footer.html');
});
