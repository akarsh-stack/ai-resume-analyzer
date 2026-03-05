// ===== Login Page =====
function renderLogin(container) {
    container.innerHTML = `
    <div class="auth-page animate-fade-in">
        <div style="position:absolute;inset:0;z-index:-1;overflow:hidden">
            <div class="hero-blob" style="top:33%;left:25%;width:16rem;height:16rem;background:rgba(139,92,246,0.1)"></div>
            <div class="hero-blob" style="bottom:33%;right:25%;width:20rem;height:20rem;background:rgba(59,130,246,0.1)"></div>
        </div>
        <div class="w-full max-w-md">
            <div class="glass-card animate-scale-in" style="padding:2rem">
                <div class="text-center mb-8">
                    <div class="grad-primary" style="width:3.5rem;height:3.5rem;border-radius:1rem;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;box-shadow:0 4px 15px rgba(124,58,237,0.3)">
                        <span style="color:#fff">${icon('brain', 'icon-md')}</span>
                    </div>
                    <h1 class="text-2xl font-bold">Welcome Back</h1>
                    <p class="text-sm text-muted" style="margin-top:0.25rem">Sign in to your account</p>
                </div>
                <div id="login-error" class="alert alert-error mb-6" style="display:none">
                    ${icon('alertCircle', 'icon-sm')} <span id="login-error-text"></span>
                </div>
                <form id="login-form" style="display:flex;flex-direction:column;gap:1.25rem">
                    <div>
                        <label class="text-sm font-medium" style="display:block;margin-bottom:0.5rem">Email</label>
                        <div class="relative">
                            <span class="input-icon-left">${icon('mail', 'icon')}</span>
                            <input type="email" required id="login-email" class="input-field has-icon-left" placeholder="you@example.com" />
                        </div>
                    </div>
                    <div>
                        <label class="text-sm font-medium" style="display:block;margin-bottom:0.5rem">Password</label>
                        <div class="relative">
                            <span class="input-icon-left">${icon('lock', 'icon')}</span>
                            <input type="password" required id="login-password" class="input-field has-icon-left has-icon-right" placeholder="••••••••" />
                            <button type="button" class="input-icon-right" id="login-toggle-pwd">${icon('eye', 'icon')}</button>
                        </div>
                    </div>
                    <button type="submit" class="btn-primary w-full" id="login-submit">Sign In</button>
                </form>
                <p class="text-center text-sm text-muted" style="margin-top:1.5rem">
                    Don't have an account? <a href="#/signup" class="text-primary font-medium" style="text-decoration:none">Sign up</a>
                </p>
            </div>
        </div>
    </div>`;

    const form = document.getElementById('login-form');
    const errBox = document.getElementById('login-error');
    const errText = document.getElementById('login-error-text');
    const pwdInput = document.getElementById('login-password');
    const toggleBtn = document.getElementById('login-toggle-pwd');
    let showPwd = false;

    toggleBtn.addEventListener('click', () => {
        showPwd = !showPwd;
        pwdInput.type = showPwd ? 'text' : 'password';
        toggleBtn.innerHTML = icon(showPwd ? 'eyeOff' : 'eye', 'icon');
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errBox.style.display = 'none';
        const email = document.getElementById('login-email').value;
        const password = pwdInput.value;
        const btn = document.getElementById('login-submit');
        btn.disabled = true;
        btn.innerHTML = '<div class="spinner spinner-sm"></div>';
        try {
            const user = await Auth.login(email, password);
            Router.navigate(user.role === 'recruiter' ? '/recruiter' : '/candidate');
        } catch (err) {
            errText.textContent = err.message || 'Login failed. Please try again.';
            errBox.style.display = 'flex';
        } finally {
            btn.disabled = false;
            btn.textContent = 'Sign In';
        }
    });
}

window.renderLogin = renderLogin;
