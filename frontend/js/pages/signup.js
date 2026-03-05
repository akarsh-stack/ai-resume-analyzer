// ===== Signup Page =====
function renderSignup(container) {
    let selectedRole = 'candidate';

    container.innerHTML = `
    <div class="auth-page animate-fade-in">
        <div style="position:absolute;inset:0;z-index:-1;overflow:hidden">
            <div class="hero-blob" style="top:25%;right:25%;width:16rem;height:16rem;background:rgba(139,92,246,0.1)"></div>
            <div class="hero-blob" style="bottom:25%;left:25%;width:20rem;height:20rem;background:rgba(59,130,246,0.1)"></div>
        </div>
        <div class="w-full max-w-md">
            <div class="glass-card animate-scale-in" style="padding:2rem">
                <div class="text-center mb-8">
                    <div class="grad-primary" style="width:3.5rem;height:3.5rem;border-radius:1rem;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;box-shadow:0 4px 15px rgba(124,58,237,0.3)">
                        <span style="color:#fff">${icon('brain', 'icon-md')}</span>
                    </div>
                    <h1 class="text-2xl font-bold">Create Account</h1>
                    <p class="text-sm text-muted" style="margin-top:0.25rem">Join the AI recruitment platform</p>
                </div>
                <div id="signup-error" class="alert alert-error mb-6" style="display:none">
                    ${icon('alertCircle', 'icon-sm')} <span id="signup-error-text"></span>
                </div>
                <form id="signup-form" style="display:flex;flex-direction:column;gap:1.25rem">
                    <!-- Role picker -->
                    <div>
                        <label class="text-sm font-medium" style="display:block;margin-bottom:0.5rem">I am a</label>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem">
                            <button type="button" class="role-btn active" data-role="candidate" id="role-candidate" style="display:flex;align-items:center;justify-content:center;gap:0.5rem;padding:0.75rem 1rem;border-radius:0.75rem;border:2px solid var(--primary-500);background:var(--primary-50);color:var(--primary-700);font-weight:500;font-size:0.875rem;transition:all 0.2s">
                                ${icon('userCheck', 'icon-sm')} Candidate
                            </button>
                            <button type="button" class="role-btn" data-role="recruiter" id="role-recruiter" style="display:flex;align-items:center;justify-content:center;gap:0.5rem;padding:0.75rem 1rem;border-radius:0.75rem;border:2px solid var(--border-solid);color:var(--text-secondary);font-weight:500;font-size:0.875rem;transition:all 0.2s">
                                ${icon('briefcase', 'icon-sm')} Recruiter
                            </button>
                        </div>
                    </div>
                    <div>
                        <label class="text-sm font-medium" style="display:block;margin-bottom:0.5rem">Full Name</label>
                        <div class="relative">
                            <span class="input-icon-left">${icon('user', 'icon')}</span>
                            <input type="text" required id="signup-name" class="input-field has-icon-left" placeholder="John Doe" />
                        </div>
                    </div>
                    <div>
                        <label class="text-sm font-medium" style="display:block;margin-bottom:0.5rem">Email</label>
                        <div class="relative">
                            <span class="input-icon-left">${icon('mail', 'icon')}</span>
                            <input type="email" required id="signup-email" class="input-field has-icon-left" placeholder="you@example.com" />
                        </div>
                    </div>
                    <div>
                        <label class="text-sm font-medium" style="display:block;margin-bottom:0.5rem">Password</label>
                        <div class="relative">
                            <span class="input-icon-left">${icon('lock', 'icon')}</span>
                            <input type="password" required id="signup-password" class="input-field has-icon-left has-icon-right" placeholder="••••••••" />
                            <button type="button" class="input-icon-right" id="signup-toggle-pwd">${icon('eye', 'icon')}</button>
                        </div>
                    </div>
                    <button type="submit" class="btn-primary w-full" id="signup-submit">Create Account</button>
                </form>
                <p class="text-center text-sm text-muted" style="margin-top:1.5rem">
                    Already have an account? <a href="#/login" class="text-primary font-medium" style="text-decoration:none">Sign in</a>
                </p>
            </div>
        </div>
    </div>`;

    // Role picker
    const roleCandidate = document.getElementById('role-candidate');
    const roleRecruiter = document.getElementById('role-recruiter');
    const updateRoleUI = () => {
        const active = selectedRole === 'candidate' ? roleCandidate : roleRecruiter;
        const inactive = selectedRole === 'candidate' ? roleRecruiter : roleCandidate;
        active.style.borderColor = 'var(--primary-500)';
        active.style.background = 'var(--primary-50)';
        active.style.color = 'var(--primary-700)';
        active.style.boxShadow = '0 4px 12px rgba(124,58,237,0.1)';
        inactive.style.borderColor = 'var(--border-solid)';
        inactive.style.background = 'transparent';
        inactive.style.color = 'var(--text-secondary)';
        inactive.style.boxShadow = 'none';
    };
    roleCandidate.addEventListener('click', () => { selectedRole = 'candidate'; updateRoleUI(); });
    roleRecruiter.addEventListener('click', () => { selectedRole = 'recruiter'; updateRoleUI(); });

    // Toggle password
    const pwdInput = document.getElementById('signup-password');
    const toggleBtn = document.getElementById('signup-toggle-pwd');
    let showPwd = false;
    toggleBtn.addEventListener('click', () => {
        showPwd = !showPwd;
        pwdInput.type = showPwd ? 'text' : 'password';
        toggleBtn.innerHTML = icon(showPwd ? 'eyeOff' : 'eye', 'icon');
    });

    // Submit
    const form = document.getElementById('signup-form');
    const errBox = document.getElementById('signup-error');
    const errText = document.getElementById('signup-error-text');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errBox.style.display = 'none';
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = pwdInput.value;
        if (password.length < 6) { errText.textContent = 'Password must be at least 6 characters'; errBox.style.display = 'flex'; return; }
        const btn = document.getElementById('signup-submit');
        btn.disabled = true;
        btn.innerHTML = '<div class="spinner spinner-sm"></div>';
        try {
            const user = await Auth.signup(email, name, password, selectedRole);
            Router.navigate(user.role === 'recruiter' ? '/recruiter' : '/candidate');
        } catch (err) {
            errText.textContent = err.message || 'Signup failed. Please try again.';
            errBox.style.display = 'flex';
        } finally {
            btn.disabled = false;
            btn.textContent = 'Create Account';
        }
    });
}

window.renderSignup = renderSignup;
