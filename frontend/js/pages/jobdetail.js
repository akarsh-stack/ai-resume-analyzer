// ===== Job Detail + Candidate Rankings =====
function renderJobDetail(container, params) {
    const jobId = params.id;

    container.innerHTML = `
    <div class="page-container animate-fade-in">
        <div class="flex justify-center mt-8"><div class="spinner"></div></div>
    </div>`;

    async function load() {
        let job, matches = [];
        try {
            job = await api.jobsAPI.get(jobId);
        } catch {
            container.innerHTML = `<div class="page-container text-center" style="padding-top:5rem">
                <span style="color:var(--yellow-500)">${icon('alertTriangle', 'icon-xl')}</span>
                <h2 class="text-xl font-bold mt-4">Job not found</h2>
                <a href="#/recruiter" class="btn-primary mt-4" style="display:inline-flex">Back to Dashboard</a>
            </div>`;
            return;
        }

        container.innerHTML = `
        <div class="page-container animate-fade-in">
            <a href="#/recruiter" class="flex items-center gap-2 text-sm text-muted mb-6" style="text-decoration:none;transition:color 0.2s" onmouseover="this.style.color='var(--primary-600)'" onmouseout="this.style.color=''">
                ${icon('arrowLeft', 'icon-sm')} Back to Dashboard
            </a>
            <!-- Job info -->
            <div class="glass-card mb-8" style="padding:1.5rem">
                <h1 class="text-2xl font-bold mb-2">${job.title}</h1>
                <p class="text-muted mb-4">${job.description || ''}</p>
                <div class="flex flex-wrap gap-4 text-sm text-muted">
                    ${job.experience_required ? `<span>📋 ${job.experience_required}</span>` : ''}
                    ${job.location ? `<span>📍 ${job.location}</span>` : ''}
                    ${job.salary_range ? `<span>💰 ${job.salary_range}</span>` : ''}
                </div>
                <div class="mt-4">
                    <p class="text-sm font-medium text-muted mb-2">Required Skills:</p>
                    <div class="flex flex-wrap gap-2">
                        ${(job.required_skills || []).map(s => `<span class="badge badge-primary">${s}</span>`).join('')}
                    </div>
                </div>
            </div>
            <!-- Rankings -->
            <div class="glass-card" style="padding:1.5rem">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-lg font-semibold flex items-center gap-2">
                        <span class="text-primary">${icon('trophy', 'icon')}</span> Candidate Rankings
                    </h2>
                    <span class="badge badge-primary" id="match-count">${icon('users', 'icon-sm')} Loading...</span>
                </div>
                <div id="match-loading" class="flex flex-col items-center justify-center" style="padding:4rem 0">
                    <div class="spinner mb-3"></div>
                    <p class="text-muted">Running AI matching engine...</p>
                </div>
                <div id="match-list" style="display:none"></div>
            </div>
        </div>`;

        // Load matches
        try {
            matches = await api.matchingAPI.getMatches(jobId);
        } catch { matches = []; }

        document.getElementById('match-loading').style.display = 'none';
        document.getElementById('match-count').innerHTML = `${icon('users', 'icon-sm')} ${matches.length} candidates`;
        const list = document.getElementById('match-list');
        list.style.display = 'block';

        if (matches.length === 0) {
            list.innerHTML = `<div class="text-center text-muted" style="padding:4rem 0">
                <span style="opacity:0.5">${icon('users', 'icon-xl')}</span>
                <p style="margin-top:0.75rem">No candidates have uploaded resumes yet</p>
            </div>`;
            return;
        }

        const expandedSet = new Set();

        function renderMatches() {
            list.innerHTML = matches.map((m, i) => {
                const rankGrad = i === 0 ? 'grad-gold' : i === 1 ? 'grad-silver' : i === 2 ? 'grad-bronze' : 'grad-primary';
                const scoreClass = m.overall_score >= 80 ? 'score-excellent' : m.overall_score >= 60 ? 'score-good' : m.overall_score >= 40 ? 'score-average' : 'score-low';
                const isExpanded = expandedSet.has(i);
                return `
                <div class="rank-card animate-slide-up" style="margin-bottom:1rem;animation-delay:${i * 80}ms">
                    <div class="rank-header" data-index="${i}">
                        <div class="flex items-center gap-4">
                            <div class="rank-badge ${rankGrad}">#${i + 1}</div>
                            <div>
                                <p class="font-semibold">${m.candidate_name}</p>
                                <p class="text-sm text-muted">${m.candidate_email}</p>
                            </div>
                        </div>
                        <div class="text-right" style="margin-top:0.75rem">
                            <p class="text-3xl font-bold ${scoreClass}">${m.overall_score.toFixed(1)}%</p>
                            <p class="text-xs text-muted">Overall Match</p>
                        </div>
                    </div>
                    ${isExpanded ? renderExpanded(m) : ''}
                </div>`;
            }).join('');

            list.querySelectorAll('.rank-header').forEach(header => {
                header.addEventListener('click', () => {
                    const idx = parseInt(header.dataset.index);
                    if (expandedSet.has(idx)) expandedSet.delete(idx); else expandedSet.add(idx);
                    renderMatches();
                });
            });
        }

        function renderExpanded(m) {
            return `
            <div class="rank-details">
                <div style="display:flex;flex-direction:column;gap:0.75rem">
                    ${scoreBar('Skill Match', m.skill_match_score, 'score-gradient-purple')}
                    ${scoreBar('Semantic Similarity', m.semantic_score, 'score-gradient-blue')}
                </div>
                <div style="display:flex;flex-direction:column;gap:1rem">
                    <div>
                        <p class="text-sm font-medium flex items-center gap-1 mb-2">${icon('checkCircle', 'icon-sm')} <span style="color:var(--emerald-500)">Matched Skills</span></p>
                        <div class="flex flex-wrap gap-1">
                            ${(m.matched_skills || []).length > 0
                    ? m.matched_skills.map(s => `<span class="badge badge-green badge-xs">${s}</span>`).join('')
                    : '<span class="text-sm text-muted">None</span>'}
                        </div>
                    </div>
                    <div>
                        <p class="text-sm font-medium flex items-center gap-1 mb-2">${icon('xCircle', 'icon-sm')} <span style="color:var(--red-500)">Missing Skills (Skill Gap)</span></p>
                        <div class="flex flex-wrap gap-1">
                            ${(m.missing_skills || []).length > 0
                    ? m.missing_skills.map(s => `<span class="badge badge-red badge-xs">${s}</span>`).join('')
                    : `<span class="text-sm flex items-center gap-1" style="color:var(--emerald-500)">${icon('sparkles', 'icon-xs')} All skills matched!</span>`}
                        </div>
                    </div>
                </div>
                ${(m.missing_skills || []).length > 0 ? `
                <div style="grid-column:1/-1" class="alert alert-info">
                    <span>${icon('target', 'icon-sm')}</span>
                    <div>
                        <p class="text-sm font-medium mb-1">AI Recommendation for Candidate</p>
                        <p class="text-sm">To improve match score, this candidate should develop skills in: <strong>${m.missing_skills.join(', ')}</strong></p>
                    </div>
                </div>` : ''}
            </div>`;
        }

        renderMatches();
    }

    load();
}

function scoreBar(label, score, gradClass) {
    return `
    <div>
        <div class="flex justify-between text-sm mb-1">
            <span class="text-muted">${label}</span>
            <span class="font-semibold">${score.toFixed(1)}%</span>
        </div>
        <div class="score-bar-track">
            <div class="score-bar-fill ${gradClass}" style="width:${Math.min(score, 100)}%"></div>
        </div>
    </div>`;
}

window.renderJobDetail = renderJobDetail;
