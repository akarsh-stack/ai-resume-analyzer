// ===== Recruiter Dashboard =====
const CHART_COLORS = ['#7c3aed', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'];

function renderRecruiter(container) {
    const user = Auth.user;
    container.innerHTML = `
    <div class="page-container animate-fade-in">
        <div class="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div>
                <h1 class="text-3xl font-bold mb-1">Recruiter Dashboard</h1>
                <p class="text-muted">Welcome back, ${user.full_name}</p>
            </div>
            <a href="#/recruiter/create-job" class="btn-primary gap-2">${icon('plus', 'icon')} Create Job</a>
        </div>
        <div id="stats-cards" class="grid grid-3 mb-8" style="display:none"></div>
        <div id="charts-row" class="grid grid-2 mb-8" style="display:none"></div>
        <!-- Semantic Search -->
        <div class="glass-card mb-8" style="padding:1.5rem">
            <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                <span class="text-primary">${icon('search', 'icon')}</span> Semantic Candidate Search
            </h3>
            <form id="search-form" class="flex gap-3">
                <div class="relative flex-1">
                    <span class="input-icon-left">${icon('search', 'icon')}</span>
                    <input id="candidate-search" class="input-field has-icon-left" placeholder="Search candidates by skills, experience, or description..." />
                </div>
                <button type="submit" class="btn-primary btn-sm" id="search-btn">Search</button>
            </form>
            <div id="search-results" style="margin-top:1rem"></div>
        </div>
        <!-- Jobs List -->
        <div class="glass-card" style="padding:1.5rem">
            <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                <span class="text-primary">${icon('briefcase', 'icon')}</span> Your Job Postings
            </h3>
            <div id="jobs-list"></div>
        </div>
        <div class="flex justify-center mt-6" id="loading-spinner"><div class="spinner"></div></div>
    </div>`;

    let jobs = [];

    async function load() {
        try {
            const [jobsData, statsData] = await Promise.all([
                api.jobsAPI.list(),
                api.dashboardAPI.getStats().catch(() => null),
            ]);
            jobs = jobsData;
            document.getElementById('loading-spinner').style.display = 'none';
            renderStats(statsData);
            renderCharts(statsData);
            renderJobs();
        } catch {
            document.getElementById('loading-spinner').style.display = 'none';
        }
    }

    function renderStats(stats) {
        if (!stats) return;
        const el = document.getElementById('stats-cards');
        el.style.display = 'grid';
        const items = [
            { icon: 'briefcase', label: 'Active Jobs', value: stats.total_jobs, grad: 'grad-purple' },
            { icon: 'users', label: 'Total Candidates', value: stats.total_candidates, grad: 'grad-blue' },
            { icon: 'trendingUp', label: 'Avg Match Score', value: `${(stats.avg_match_score || 0).toFixed(1)}%`, grad: 'grad-green' },
        ];
        el.innerHTML = items.map(s => `
            <div class="glass-card animate-scale-in" style="padding:1.25rem;display:flex;align-items:center;gap:1rem">
                <div class="stat-icon ${s.grad}">${icon(s.icon, 'icon-md')}</div>
                <div>
                    <p class="stat-label">${s.label}</p>
                    <p class="stat-value">${s.value}</p>
                </div>
            </div>`).join('');
    }

    function renderCharts(stats) {
        if (!stats) return;
        const hasSkills = stats.top_skills && stats.top_skills.length > 0;
        const hasDist = stats.score_distribution && stats.score_distribution.length > 0;
        if (!hasSkills && !hasDist) return;

        const el = document.getElementById('charts-row');
        el.style.display = 'grid';
        el.innerHTML = '';

        if (hasSkills) {
            const card = document.createElement('div');
            card.className = 'glass-card';
            card.style.padding = '1.5rem';
            card.innerHTML = `<h3 class="text-lg font-semibold mb-4 flex items-center gap-2"><span class="text-primary">${icon('barChart', 'icon')}</span> Top Skills in Candidate Pool</h3><div class="chart-container"><canvas id="skills-chart"></canvas></div>`;
            el.appendChild(card);
            setTimeout(() => {
                const ctx = document.getElementById('skills-chart');
                if (ctx && window.Chart) {
                    new Chart(ctx, {
                        type: 'bar', data: {
                            labels: stats.top_skills.map(s => s.name),
                            datasets: [{ label: 'Count', data: stats.top_skills.map(s => s.count), backgroundColor: '#7c3aed', borderRadius: 6 }]
                        }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { display: false } } } }
                    });
                }
            }, 50);
        }

        if (hasDist) {
            const filtered = stats.score_distribution.filter(d => d.count > 0);
            if (filtered.length === 0) return;
            const card = document.createElement('div');
            card.className = 'glass-card';
            card.style.padding = '1.5rem';
            card.innerHTML = `<h3 class="text-lg font-semibold mb-4 flex items-center gap-2"><span class="text-primary">${icon('trendingUp', 'icon')}</span> Score Distribution</h3><div class="chart-container"><canvas id="dist-chart"></canvas></div>`;
            el.appendChild(card);
            setTimeout(() => {
                const ctx = document.getElementById('dist-chart');
                if (ctx && window.Chart) {
                    new Chart(ctx, {
                        type: 'doughnut', data: {
                            labels: filtered.map(d => d.range),
                            datasets: [{ data: filtered.map(d => d.count), backgroundColor: CHART_COLORS.slice(0, filtered.length), borderWidth: 0 }]
                        }, options: { responsive: true, maintainAspectRatio: false, cutout: '50%', plugins: { legend: { position: 'bottom' } } }
                    });
                }
            }, 50);
        }
    }

    function renderJobs() {
        const el = document.getElementById('jobs-list');
        if (jobs.length === 0) {
            el.innerHTML = `<div class="text-center text-muted" style="padding:3rem 0">
                <span style="opacity:0.5">${icon('briefcase', 'icon-xl')}</span>
                <p style="margin:0.75rem 0">No job postings yet</p>
                <a href="#/recruiter/create-job" class="btn-primary mt-4 gap-2">${icon('plus', 'icon-sm')} Create Your First Job</a>
            </div>`;
            return;
        }
        el.innerHTML = jobs.map(job => `
            <div class="job-row" style="margin-bottom:0.75rem">
                <div class="flex-1">
                    <h4 class="font-semibold">${job.title}</h4>
                    <p class="text-sm text-muted line-clamp-1 mt-1">${job.description || ''}</p>
                    <div class="flex flex-wrap gap-1 mt-2">
                        ${(job.required_skills || []).slice(0, 4).map(s => `<span class="badge badge-primary badge-xs">${s}</span>`).join('')}
                        ${(job.required_skills || []).length > 4 ? `<span class="badge badge-gray badge-xs">+${job.required_skills.length - 4}</span>` : ''}
                    </div>
                </div>
                <div class="job-row-actions">
                    <a href="#/recruiter/jobs/${job.id}" class="btn-secondary btn-sm gap-1">${icon('eye', 'icon-sm')} View Matches</a>
                    <button class="btn-icon delete-job-btn" data-id="${job.id}">${icon('trash', 'icon-sm')}</button>
                </div>
            </div>`).join('');

        el.querySelectorAll('.delete-job-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!confirm('Delete this job posting?')) return;
                const id = btn.dataset.id;
                await api.jobsAPI.delete(id);
                jobs = jobs.filter(j => j.id != id);
                renderJobs();
            });
        });
    }

    // Search
    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const q = document.getElementById('candidate-search').value.trim();
        if (!q) return;
        const btn = document.getElementById('search-btn');
        btn.disabled = true; btn.innerHTML = '<div class="spinner spinner-sm"></div>';
        const results = document.getElementById('search-results');
        try {
            const data = await api.matchingAPI.searchCandidates(q);
            if (data.length === 0) { results.innerHTML = '<p class="text-muted text-sm">No results found.</p>'; return; }
            results.innerHTML = `<div class="animate-slide-up" style="display:flex;flex-direction:column;gap:0.75rem">
                ${data.map(r => `
                    <div class="job-row" style="padding:1rem">
                        <div>
                            <p class="font-medium">${r.candidate_name}</p>
                            <p class="text-sm text-muted">${r.candidate_email}</p>
                            <div class="flex flex-wrap gap-1 mt-2">
                                ${(r.skills || []).slice(0, 5).map(s => `<span class="badge badge-primary badge-xs">${s}</span>`).join('')}
                                ${(r.skills || []).length > 5 ? `<span class="badge badge-gray badge-xs">+${r.skills.length - 5}</span>` : ''}
                            </div>
                        </div>
                        <div class="text-right">
                            <span class="text-2xl font-bold gradient-text">${r.similarity_score.toFixed(1)}%</span>
                            <p class="text-xs text-muted">similarity</p>
                        </div>
                    </div>`).join('')}
            </div>`;
        } catch { results.innerHTML = '<p class="text-muted text-sm">Search failed.</p>'; }
        finally { btn.disabled = false; btn.textContent = 'Search'; }
    });

    load();
}

window.renderRecruiter = renderRecruiter;
