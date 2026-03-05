// ===== Auth State Manager =====
const Auth = {
    _user: null,
    _listeners: [],

    init() {
        const saved = localStorage.getItem('user');
        if (saved) {
            try { this._user = JSON.parse(saved); } catch { this._user = null; }
        }
    },

    get user() { return this._user; },
    get isLoggedIn() { return !!this._user; },

    async login(email, password) {
        const data = await api.authAPI.login({ email, password });
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        this._user = data.user;
        this._notify();
        return data.user;
    },

    async signup(email, fullName, password, role) {
        const data = await api.authAPI.signup({ email, full_name: fullName, password, role });
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        this._user = data.user;
        this._notify();
        return data.user;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this._user = null;
        this._notify();
    },

    onChange(fn) { this._listeners.push(fn); },
    _notify() { this._listeners.forEach(fn => fn(this._user)); },
};

window.Auth = Auth;
