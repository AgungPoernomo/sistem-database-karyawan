// src/layouts/AppLayout.js

export function initLayout(userId, adminRoleDept) {
    // 1. INJEKSI DATA USER DINAMIS KE HTML STATIS
    const nameEl = document.getElementById('userNameDisplay');
    const avatarEl = document.getElementById('userAvatar');
    const roleEl = document.getElementById('userRoleBadge');
    const navDbEl = document.getElementById('navDbText');

    if (nameEl) nameEl.innerText = userId;
    if (avatarEl) avatarEl.innerText = userId.charAt(0).toUpperCase();

    const isSuperAdmin = userId.toUpperCase() === 'SUPERADMIN';
    const roleBadge = isSuperAdmin ? 'MASTER NODE' : (adminRoleDept ? `ADMIN ${adminRoleDept.toUpperCase()}` : 'USER NODE');
    
    if (roleEl) roleEl.innerText = roleBadge;
    if (navDbEl) navDbEl.innerText = adminRoleDept ? `Database ${adminRoleDept}` : 'Database Master';

    // 2. AUTO-ACTIVE MENU BERDASARKAN URL (Mencegah Bug Tombol Nyala Salah Tempat)
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('aside nav a.holo-nav');
    
    let isActiveSet = false;

    navLinks.forEach(link => {
        // Matikan semua tombol terlebih dahulu
        link.classList.remove('active');
        
        // Ambil nama file dari link (misal: "data-karyawan.html")
        const href = link.getAttribute('href');
        const fileName = href ? href.split('/').pop() : '';
        
        // Jika URL browser saat ini mengandung nama file tersebut, nyalakan tombolnya
        if (fileName && currentPath.includes(fileName)) {
            link.classList.add('active');
            isActiveSet = true;
        }
    });

    // Fallback: Jika ada di root halaman (/) dan belum ada yang aktif, nyalakan Dashboard
    if (!isActiveSet && (currentPath === '/' || currentPath.endsWith('/pages/'))) {
        const dashLink = document.querySelector('aside nav a[href*="dashboard"]');
        if(dashLink) dashLink.classList.add('active');
    }

    // 3. LOGIKA MOBILE MENU HAMBURGER (Tarik masuk / geser)
    const sidebar = document.getElementById('app-sidebar');
    let overlay = document.getElementById('mobileMenuOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'mobileMenuOverlay';
        overlay.className = 'fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 hidden lg:hidden opacity-0 transition-opacity duration-300';
        document.body.appendChild(overlay);
    }

    const closeBtn = document.getElementById('closeMobileMenuBtn');
    window.toggleMobileMenu = function() {
        if (!sidebar) return;
        const isClosed = sidebar.classList.contains('-translate-x-full');
        if (isClosed) {
            sidebar.classList.remove('-translate-x-full');
            overlay.classList.remove('hidden');
            if(closeBtn) closeBtn.classList.remove('hidden');
            setTimeout(() => {
                overlay.classList.remove('opacity-0');
                if(closeBtn) closeBtn.classList.remove('opacity-0');
            }, 10);
        } else {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('opacity-0');
            if(closeBtn) closeBtn.classList.add('opacity-0');
            setTimeout(() => {
                overlay.classList.add('hidden');
                if(closeBtn) closeBtn.classList.add('hidden');
            }, 300);
        }
    };

    if (closeBtn) closeBtn.addEventListener('click', window.toggleMobileMenu);
    overlay.addEventListener('click', window.toggleMobileMenu);
}

export function initThemeAndLogout() {
    const htmlElement = document.documentElement;
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    
    let currentTheme = localStorage.getItem('satoria_theme') || 'light';

    function updateThemeUI(theme) {
        if (theme === 'dark') {
            if(themeText) themeText.innerText = 'Mode Terang';
            if(themeIcon) themeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>`;
        } else {
            if(themeText) themeText.innerText = 'Mode Gelap';
            if(themeIcon) themeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>`;
        }
    }
    
    updateThemeUI(currentTheme);

    themeToggleBtn?.addEventListener('click', () => {
        htmlElement.classList.add('no-transitions');
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('satoria_theme', currentTheme);
        
        if (currentTheme === 'dark') {
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
        }
        
        updateThemeUI(currentTheme);
        window.getComputedStyle(htmlElement).opacity;
        setTimeout(() => { htmlElement.classList.remove('no-transitions'); }, 0);
    });

    const triggerLogout = () => {
        if(confirm("Apakah Anda yakin ingin memutus koneksi dari Node Organisasi Satoria?")) {
            sessionStorage.clear(); localStorage.clear();
            window.location.replace('/');
        }
    };

    document.getElementById('logoutBtnSide')?.addEventListener('click', triggerLogout);
}