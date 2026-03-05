// ===== Create Job Page =====
const SUGGESTED_SKILLS = [
    'Python', 'Java', 'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 'Node.js',
    'Django', 'FastAPI', 'Spring Boot', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
    'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Machine Learning', 'Deep Learning',
    'TensorFlow', 'PyTorch', 'NLP', 'Git', 'CI/CD', 'REST API', 'GraphQL', 'Microservices',
    'Linux', 'DevOps', 'Agile', 'Data Engineering', 'Go', 'Rust', 'C++', 'Swift',
];

function renderCreateJob(container) {
    let skills = [];

    container.innerHTML = `
    <div class="page-container animate-fade-in">
        <div class="max-w-2xl mx-auto">
            <div class="mb-8">
                <h1 class="text-3xl font-bold mb-1 flex items-center gap-3">
                    <div class="grad-primary" style="width:2.5rem;height:2.5rem;border-radius:0.75rem;display:flex;align-items:center;justify-content:center">
                        <span style="color:#fff">${icon('briefcase', 'icon')}</span>
                    </div>
                    Create Job Posting
                </h1>
                <p class="text-muted mt-2">Define the role and let AI match the best candidates</p>
            </div>
            <div id="cj-error" class="alert alert-error mb-6" style="display:none">
                ${icon('alertCircle', 'icon-sm')} <span id="cj-error-text"></span>
            </div>
            <form id="create-job-form" class="glass-card" style="padding:1.5rem;display:flex;flex-direction:column;gap:1.5rem">
                <div>
                    <label class="text-sm font-medium" style="display:block;margin-bottom:0.5rem">Job Title *</label>
                    <input required id="job-title" class="input-field" placeholder="e.g. Senior Python Developer" />
                </div>
                <div>
                    <label class="text-sm font-medium" style="display:block;margin-bottom:0.5rem">Job Description *</label>
                    <textarea required id="job-description" class="input-field" rows="5" placeholder="Describe the role, responsibilities, and what you're looking for..."></textarea>
                </div>
                <!-- Skills -->
                <div>
                    <label class="text-sm font-medium flex items-center gap-2" style="display:flex;margin-bottom:0.5rem">
                        <span class="text-primary">${icon('sparkles', 'icon-sm')}</span> Required Skills *
                    </label>
                    <div id="skills-tags" class="flex flex-wrap gap-2 mb-3"></div>
                    <input id="skill-input" class="input-field" placeholder="Type a skill and press Enter..." />
                    <div id="skill-suggestions" class="flex flex-wrap gap-1 mt-2"></div>
                </div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem">
                    <div>
                        <label class="text-sm font-medium" style="display:block;margin-bottom:0.5rem">Experience</label>
                        <input id="job-exp" class="input-field" placeholder="e.g. 3-5 years" />
                    </div>
                    <div>
                        <label class="text-sm font-medium" style="display:block;margin-bottom:0.5rem">Location</label>
                        <input id="job-loc" class="input-field" placeholder="e.g. Remote" />
                    </div>
                    <div>
                        <label class="text-sm font-medium" style="display:block;margin-bottom:0.5rem">Salary Range</label>
                        <input id="job-salary" class="input-field" placeholder="e.g. $100k-$130k" />
                    </div>
                </div>
                <div class="flex gap-3" style="padding-top:0.5rem">
                    <button type="submit" class="btn-primary gap-2 flex-1" id="create-job-submit">${icon('plus', 'icon')} Create Job Posting</button>
                    <a href="#/recruiter" class="btn-secondary">Cancel</a>
                </div>
            </form>
        </div>
    </div>`;

    const skillInput = document.getElementById('skill-input');
    const skillTags = document.getElementById('skills-tags');
    const skillSuggestions = document.getElementById('skill-suggestions');
    const errBox = document.getElementById('cj-error');
    const errText = document.getElementById('cj-error-text');

    function renderSkills() {
        skillTags.innerHTML = skills.map(s => `
            <span class="badge badge-primary flex items-center gap-1" style="gap:0.375rem">
                ${s} <button type="button" class="remove-skill" data-skill="${s}" style="cursor:pointer;background:none;border:none;color:inherit;padding:0;display:flex;opacity:0.7">${icon('x', 'icon-xs')}</button>
            </span>`).join('');
        skillTags.querySelectorAll('.remove-skill').forEach(btn => {
            btn.addEventListener('click', () => { skills = skills.filter(s => s !== btn.dataset.skill); renderSkills(); updateSuggestions(); });
        });
    }

    function updateSuggestions() {
        const val = skillInput.value.toLowerCase();
        if (!val) { skillSuggestions.innerHTML = ''; return; }
        const filtered = SUGGESTED_SKILLS.filter(s => !skills.includes(s) && s.toLowerCase().includes(val)).slice(0, 8);
        skillSuggestions.innerHTML = filtered.map(s => `<button type="button" class="skill-suggestion" data-skill="${s}">+ ${s}</button>`).join('');
        skillSuggestions.querySelectorAll('.skill-suggestion').forEach(btn => {
            btn.addEventListener('click', () => { addSkill(btn.dataset.skill); });
        });
    }

    function addSkill(skill) {
        const s = skill.trim();
        if (s && !skills.includes(s)) skills.push(s);
        skillInput.value = '';
        renderSkills();
        updateSuggestions();
    }

    skillInput.addEventListener('input', updateSuggestions);
    skillInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput.value); }
    });

    document.getElementById('create-job-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        errBox.style.display = 'none';
        if (skills.length === 0) { errText.textContent = 'Add at least one required skill'; errBox.style.display = 'flex'; return; }
        const btn = document.getElementById('create-job-submit');
        btn.disabled = true; btn.innerHTML = '<div class="spinner spinner-sm"></div>';
        try {
            await api.jobsAPI.create({
                title: document.getElementById('job-title').value,
                description: document.getElementById('job-description').value,
                required_skills: skills,
                experience_required: document.getElementById('job-exp').value,
                location: document.getElementById('job-loc').value,
                salary_range: document.getElementById('job-salary').value,
            });
            Router.navigate('/recruiter');
        } catch (err) {
            errText.textContent = err.message || 'Failed to create job';
            errBox.style.display = 'flex';
        } finally {
            btn.disabled = false;
            btn.innerHTML = `${icon('plus', 'icon')} Create Job Posting`;
        }
    });
}

window.renderCreateJob = renderCreateJob;
