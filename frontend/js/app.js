// ===== Main App — initializer, navbar, theme, routing =====
(function () {
    // ---- Theme ----
    const Theme = {
        init() {
            const saved = localStorage.getItem('theme');
            if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme:dark)').matches)) {
                document.documentElement.classList.add('dark');
            }
        },
        get isDark() { return document.documentElement.classList.contains('dark'); },
        toggle() {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
            renderNavbar();
        }
    };

    // ---- Navbar ----
    function renderNavbar() {
        const nav = document.getElementById('navbar');
        const user = Auth.user;
        const dark = Theme.isDark;
        nav.innerHTML = `
        <div class="navbar-inner">
            <a href="#/" class="nav-logo">
                <div class="nav-logo-icon"><span style="color:#fff">${icon('brain', 'icon')}</span></div>
                <span class="nav-logo-text gradient-text">ResumeAI</span>
            </a>
            <div class="nav-links">
                ${!user ? `
                    <a href="#/login" class="nav-link">Log in</a>
                    <a href="#/signup" class="btn-primary btn-sm">Get Started</a>
                ` : `
                    <a href="#/${user.role === 'recruiter' ? 'recruiter' : 'candidate'}" class="nav-link">Dashboard</a>
                    <div class="nav-user">
                        <div class="flex items-center gap-2">
                            <div class="nav-avatar"><span style="color:#fff">${icon('user', 'icon-sm')}</span></div>
                            <div class="nav-user-info">
                                <p class="nav-user-name">${user.full_name}</p>
                                <p class="nav-user-role">${user.role}</p>
                            </div>
                        </div>
                        <button class="nav-logout-btn" id="nav-logout-btn" title="Logout">${icon('logOut', 'icon-sm')}</button>
                    </div>
                `}
                <button class="nav-theme-btn" id="nav-theme-btn" title="Toggle theme">
                    ${dark ? icon('sun', 'icon') : icon('moon', 'icon')}
                </button>
            </div>
            <div class="nav-mobile-controls">
                <button class="nav-theme-btn" id="nav-theme-btn-m">${dark ? icon('sun', 'icon') : icon('moon', 'icon')}</button>
                <button class="nav-hamburger" id="nav-hamburger">${icon('menu', 'icon')}</button>
            </div>
        </div>
        <div class="mobile-menu" id="mobile-menu">
            ${!user ? `
                <a href="#/login" class="mobile-menu-link" onclick="closeMobile()">Log in</a>
                <a href="#/signup" class="mobile-menu-link primary-bg" onclick="closeMobile()">Get Started</a>
            ` : `
                <div class="flex items-center gap-3" style="padding:0.5rem 1rem">
                    <div class="nav-avatar"><span style="color:#fff">${icon('user', 'icon-sm')}</span></div>
                    <div>
                        <p class="text-sm font-medium">${user.full_name}</p>
                        <p class="text-xs text-muted capitalize">${user.role}</p>
                    </div>
                </div>
                <a href="#/${user.role === 'recruiter' ? 'recruiter' : 'candidate'}" class="mobile-menu-link" onclick="closeMobile()">Dashboard</a>
                <button class="mobile-menu-link logout" id="mobile-logout-btn" style="width:100%;text-align:left">Logout</button>
            `}
        </div>`;

        // Event listeners
        document.getElementById('nav-theme-btn')?.addEventListener('click', () => Theme.toggle());
        document.getElementById('nav-theme-btn-m')?.addEventListener('click', () => Theme.toggle());
        document.getElementById('nav-hamburger')?.addEventListener('click', () => {
            document.getElementById('mobile-menu').classList.toggle('open');
        });
        document.getElementById('nav-logout-btn')?.addEventListener('click', () => { Auth.logout(); Router.navigate('/'); });
        document.getElementById('mobile-logout-btn')?.addEventListener('click', () => { closeMobile(); Auth.logout(); Router.navigate('/'); });
    }

    window.closeMobile = function () {
        document.getElementById('mobile-menu')?.classList.remove('open');
    };

    // ---- Routes ----
    function setupRoutes() {
        Router.add('/', renderLanding);
        Router.add('/login', renderLogin);
        Router.add('/signup', renderSignup);
        Router.add('/candidate', renderCandidate, { role: 'candidate' });
        Router.add('/recruiter', renderRecruiter, { role: 'recruiter' });
        Router.add('/recruiter/create-job', renderCreateJob, { role: 'recruiter' });
        Router.add('/recruiter/jobs/:id', renderJobDetail, { role: 'recruiter' });
    }

    // ---- Init ----
    function init() {
        Theme.init();
        Auth.init();
        Auth.onChange(() => renderNavbar());
        renderNavbar();
        setupRoutes();
        Router.start();
    }

    // Re-render navbar on route change
    window.addEventListener('hashchange', () => {
        renderNavbar();
        closeMobile();
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
