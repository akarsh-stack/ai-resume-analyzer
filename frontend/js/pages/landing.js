// ===== Landing Page =====
function renderLanding(container) {
    container.innerHTML = `
    <div class="animate-fade-in">
        <!-- Hero -->
        <section style="position:relative;overflow:hidden">
            <div style="position:absolute;inset:0;z-index:-1">
                <div class="hero-blob animate-float" style="top:5rem;left:25%;width:18rem;height:18rem;background:rgba(139,92,246,0.1)"></div>
                <div class="hero-blob animate-float" style="bottom:5rem;right:25%;width:24rem;height:24rem;background:rgba(59,130,246,0.1);animation-delay:2s"></div>
            </div>
            <div style="max-width:1280px;margin:0 auto;padding:5rem 1rem 7rem">
                <div class="text-center" style="max-width:56rem;margin:0 auto">
                    <div class="animate-scale-in" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;border-radius:9999px;background:var(--primary-50);border:1px solid var(--primary-200);color:var(--primary-700);font-size:0.875rem;font-weight:500;margin-bottom:2rem">
                        ${icon('sparkles', 'icon-sm')} AI-Powered Recruitment Platform
                    </div>
                    <h1 style="font-size:clamp(2.5rem,6vw,4.5rem);font-weight:800;letter-spacing:-0.02em;margin-bottom:1.5rem;line-height:1.1">
                        <span style="display:block">Screen Resumes</span>
                        <span class="gradient-text">10x Faster with AI</span>
                    </h1>
                    <p style="font-size:1.25rem;color:var(--text-secondary);max-width:42rem;margin:0 auto 2.5rem;line-height:1.7">
                        Upload resumes, create job postings, and let our AI match the best
                        candidates using semantic analysis and skill-based scoring.
                    </p>
                    <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:1rem">
                        <a href="#/signup" class="btn-primary" style="font-size:1.125rem;padding:1rem 2rem;gap:0.5rem">
                            Start Free ${icon('arrowRight', 'icon')}
                        </a>
                        <a href="#/login" class="btn-secondary" style="font-size:1.125rem;padding:1rem 2rem">
                            Log In
                        </a>
                    </div>
                </div>
                <!-- Stats -->
                <div class="grid-3" style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;max-width:28rem;margin:5rem auto 0">
                    <div class="text-center"><div class="text-3xl font-bold gradient-text">95%</div><div class="text-sm text-muted" style="margin-top:0.25rem">Accuracy</div></div>
                    <div class="text-center"><div class="text-3xl font-bold gradient-text">10x</div><div class="text-sm text-muted" style="margin-top:0.25rem">Faster</div></div>
                    <div class="text-center"><div class="text-3xl font-bold gradient-text">90+</div><div class="text-sm text-muted" style="margin-top:0.25rem">Skills Tracked</div></div>
                </div>
            </div>
        </section>

        <!-- Features -->
        <section style="padding:6rem 0" class="section-alt">
            <div style="max-width:1280px;margin:0 auto;padding:0 1rem">
                <div class="text-center mb-8" style="margin-bottom:4rem">
                    <h2 style="font-size:clamp(1.5rem,3vw,2.25rem);font-weight:700;margin-bottom:1rem">
                        Everything You Need to <span class="gradient-text">Hire Smarter</span>
                    </h2>
                    <p class="text-muted" style="max-width:42rem;margin:0 auto">
                        Our AI-driven platform streamlines the entire recruitment pipeline from resume screening to candidate ranking.
                    </p>
                </div>
                <div class="grid grid-3" id="features-grid"></div>
            </div>
        </section>

        <!-- How It Works -->
        <section style="padding:6rem 0">
            <div style="max-width:1280px;margin:0 auto;padding:0 1rem">
                <div class="text-center" style="margin-bottom:4rem">
                    <h2 style="font-size:clamp(1.5rem,3vw,2.25rem);font-weight:700;margin-bottom:1rem">How It Works</h2>
                    <p class="text-muted">Three simple steps to find the perfect candidate</p>
                </div>
                <div class="grid grid-3" id="steps-grid"></div>
            </div>
        </section>

        <!-- CTA -->
        <section style="padding:6rem 0">
            <div style="max-width:56rem;margin:0 auto;padding:0 1rem">
                <div class="glass-card" style="padding:3rem;text-align:center;position:relative;overflow:hidden">
                    <div class="cta-overlay"></div>
                    <div style="position:relative">
                        <h2 style="font-size:clamp(1.5rem,3vw,2.25rem);font-weight:700;margin-bottom:1rem">Ready to Revolutionize Your Hiring?</h2>
                        <p class="text-muted" style="max-width:32rem;margin:0 auto 2rem">
                            Join the AI-powered recruitment revolution. Start screening resumes smarter today.
                        </p>
                        <a href="#/signup" class="btn-primary" style="font-size:1.125rem;padding:1rem 2rem;gap:0.5rem">
                            Get Started Free ${icon('arrowRight', 'icon')}
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer style="border-top:1px solid var(--border-solid);padding:2rem 0">
            <div style="max-width:1280px;margin:0 auto;padding:0 1rem;text-align:center">
                <div style="display:flex;align-items:center;justify-content:center;gap:0.5rem;margin-bottom:0.5rem">
                    <span class="text-primary">${icon('brain', 'icon')}</span>
                    <span class="font-bold gradient-text">ResumeAI</span>
                </div>
                <p class="text-sm text-muted">© 2026 AI Resume Analyzer. Built with FastAPI & Sentence Transformers.</p>
            </div>
        </footer>
    </div>`;

    // Render features
    const features = [
        { icon: 'upload', title: 'Smart Resume Parsing', desc: 'Upload PDF or DOCX resumes and our AI automatically extracts skills, experience, and education.' },
        { icon: 'brain', title: 'AI-Powered Matching', desc: 'Sentence Transformers and NLP compare candidates with job requirements using semantic similarity.' },
        { icon: 'barChart', title: 'Candidate Ranking', desc: 'Instantly rank candidates by match score with detailed skill gap analysis.' },
        { icon: 'target', title: 'Skill Gap Analysis', desc: 'See exactly which skills candidates are missing for each position.' },
        { icon: 'zap', title: 'Semantic Search', desc: 'Search your entire candidate pool using natural language queries powered by FAISS.' },
        { icon: 'shield', title: 'Role-Based Access', desc: 'Secure system with separate views for recruiters and candidates.' },
    ];
    const fg = document.getElementById('features-grid');
    features.forEach((f, i) => {
        const card = document.createElement('div');
        card.className = 'glass-card-hover animate-slide-up';
        card.style.padding = '1.5rem';
        card.style.animationDelay = `${i * 100}ms`;
        card.innerHTML = `
            <div class="feature-icon">${icon(f.icon, 'icon-md')}</div>
            <h3 class="font-semibold text-lg mb-2">${f.title}</h3>
            <p class="text-sm text-muted" style="line-height:1.7">${f.desc}</p>`;
        fg.appendChild(card);
    });

    // Render steps
    const steps = [
        { step: '01', title: 'Upload Resumes', desc: 'Candidates upload their resumes in PDF or DOCX format. Our parser extracts all relevant information automatically.' },
        { step: '02', title: 'Create Job Posts', desc: 'Recruiters define job requirements including skills, experience, and description. The AI analyzes every detail.' },
        { step: '03', title: 'Get AI Rankings', desc: 'Our engine matches candidates to jobs using AI similarity scoring and ranks them by best fit percentage.' },
    ];
    const sg = document.getElementById('steps-grid');
    steps.forEach((s, i) => {
        const d = document.createElement('div');
        d.className = 'relative animate-slide-up';
        d.style.animationDelay = `${i * 150}ms`;
        d.innerHTML = `
            <div class="step-number">${s.step}</div>
            <div style="position:relative;padding-top:2rem;padding-left:0.5rem">
                <h3 class="text-xl font-bold mb-3">${s.title}</h3>
                <p class="text-muted" style="line-height:1.7">${s.desc}</p>
            </div>`;
        sg.appendChild(d);
    });
}

window.renderLanding = renderLanding;
