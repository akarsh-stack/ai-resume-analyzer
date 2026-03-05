// ===== Hash-based SPA Router =====
const Router = {
    routes: [],
    currentPage: null,

    add(pattern, handler, { role } = {}) {
        this.routes.push({ pattern, handler, role });
    },

    start() {
        window.addEventListener('hashchange', () => this.resolve());
        this.resolve();
    },

    navigate(path) {
        window.location.hash = '#' + path;
    },

    resolve() {
        const hash = window.location.hash.slice(1) || '/';
        for (const route of this.routes) {
            const params = this._match(route.pattern, hash);
            if (params !== null) {
                // Role guard
                if (route.role) {
                    if (!Auth.isLoggedIn || Auth.user.role !== route.role) {
                        this.navigate('/login');
                        return;
                    }
                }
                this.currentPage = { pattern: route.pattern, params };
                const container = document.getElementById('page-content');
                if (container) {
                    container.innerHTML = '';
                    route.handler(container, params);
                }
                window.scrollTo(0, 0);
                return;
            }
        }
        // Fallback: go to landing
        this.navigate('/');
    },

    _match(pattern, path) {
        const pParts = pattern.split('/');
        const hParts = path.split('/');
        if (pParts.length !== hParts.length) return null;
        const params = {};
        for (let i = 0; i < pParts.length; i++) {
            if (pParts[i].startsWith(':')) {
                params[pParts[i].slice(1)] = hParts[i];
            } else if (pParts[i] !== hParts[i]) {
                return null;
            }
        }
        return params;
    },
};

window.Router = Router;
