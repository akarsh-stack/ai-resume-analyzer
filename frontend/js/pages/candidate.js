// ===== Candidate Dashboard =====
function renderCandidate(container) {
    const user = Auth.user;
    container.innerHTML = `
    <div class="page-container animate-fade-in">
        <div class="mb-8">
            <h1 class="text-3xl font-bold mb-1">Welcome, ${user.full_name} 👋</h1>
            <p class="text-muted">Upload your resume and let AI analyze your skills</p>
        </div>
        <div id="cand-error" class="alert alert-error mb-6" style="display:none">
            ${icon('alertCircle', 'icon-sm')} <span id="cand-error-text"></span>
        </div>
        <div id="cand-success" class="alert alert-success mb-6 animate-scale-in" style="display:none">
            ${icon('checkCircle', 'icon-sm')} <span id="cand-success-text"></span>
        </div>
        <div class="grid grid-2">
            <!-- Upload -->
            <div class="glass-card" style="padding:1.5rem">
                <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span class="text-primary">${icon('upload', 'icon')}</span> Upload Resume
                </h2>
                <div class="dropzone" id="drop-area">
                    <input type="file" id="file-input" accept=".pdf,.docx" style="display:none" />
                    <div id="drop-content">
                        <div class="dropzone-icon">${icon('fileText', 'icon-lg')}</div>
                        <p class="font-medium" style="color:var(--gray-700)">Drag & drop your resume here</p>
                        <p class="text-sm text-muted" style="margin-top:0.25rem">or click to browse · PDF, DOCX supported</p>
                    </div>
                    <div id="drop-uploading" style="display:none">
                        <div class="spinner mx-auto" style="margin-bottom:0.75rem"></div>
                        <p class="text-primary font-medium">Analyzing your resume with AI...</p>
                    </div>
                </div>
                <div id="resume-status" style="display:none" class="mt-4"></div>
            </div>
            <!-- Profile -->
            <div class="glass-card" style="padding:1.5rem">
                <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span class="text-primary">${icon('user', 'icon')}</span> Your Profile
                </h2>
                <div id="profile-content">
                    <div class="flex flex-col items-center justify-center text-muted" style="padding:3rem 0">
                        <span style="opacity:0.5">${icon('fileText', 'icon-xl')}</span>
                        <p style="margin-top:0.75rem">Upload a resume to see your profile</p>
                    </div>
                </div>
            </div>
        </div>
        <div id="skills-section" style="display:none"></div>
    </div>`;

    let resumeData = null;

    function showResume(r) {
        resumeData = r;
        // Status
        const status = document.getElementById('resume-status');
        status.style.display = 'block';
        status.innerHTML = `<div class="flex items-center gap-2" style="padding:0.75rem;border-radius:0.75rem;background:var(--emerald-50);color:var(--emerald-700);font-size:0.875rem">
            ${icon('checkCircle', 'icon-sm')} <span class="font-medium">${r.filename}</span> — uploaded and analyzed
        </div>`;

        // Profile
        const profile = document.getElementById('profile-content');
        profile.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:1rem">
            <div class="flex items-center gap-3">
                <div class="nav-avatar" style="width:3rem;height:3rem">${icon('user', 'icon-md')}</div>
                <div>
                    <p class="font-semibold text-lg">${r.parsed_name || user.full_name}</p>
                    <p class="text-sm text-muted flex items-center gap-1">${icon('mail', 'icon-xs')} ${r.parsed_email || user.email}</p>
                </div>
            </div>
            ${r.parsed_education ? `<div class="info-box"><div class="flex items-center gap-2 text-sm font-medium text-muted mb-2">${icon('graduationCap', 'icon-sm')} Education</div><p class="text-sm whitespace-pre-line">${r.parsed_education}</p></div>` : ''}
            ${r.parsed_experience ? `<div class="info-box"><div class="flex items-center gap-2 text-sm font-medium text-muted mb-2">${icon('briefcase', 'icon-sm')} Experience</div><p class="text-sm whitespace-pre-line">${r.parsed_experience}</p></div>` : ''}
        </div>`;

        // Skills
        if (r.skills && r.skills.length > 0) {
            const sec = document.getElementById('skills-section');
            sec.style.display = 'block';
            sec.innerHTML = `
            <div class="glass-card mt-8 animate-slide-up" style="padding:1.5rem">
                <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span class="text-primary">${icon('sparkles', 'icon')}</span> Extracted Skills
                </h2>
                <div class="flex flex-wrap gap-2">
                    ${r.skills.map(s => `<span class="badge badge-primary">${s}</span>`).join('')}
                </div>
            </div>`;
        }
    }

    // Drag-and-drop
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');
    const dropContent = document.getElementById('drop-content');
    const dropUploading = document.getElementById('drop-uploading');
    const errBox = document.getElementById('cand-error');
    const errText = document.getElementById('cand-error-text');
    const successBox = document.getElementById('cand-success');
    const successText = document.getElementById('cand-success-text');

    dropArea.addEventListener('click', () => fileInput.click());
    dropArea.addEventListener('dragover', (e) => { e.preventDefault(); dropArea.classList.add('drag-over'); });
    dropArea.addEventListener('dragleave', () => dropArea.classList.remove('drag-over'));
    dropArea.addEventListener('drop', (e) => { e.preventDefault(); dropArea.classList.remove('drag-over'); handleFile(e.dataTransfer.files[0]); });
    fileInput.addEventListener('change', () => { if (fileInput.files[0]) handleFile(fileInput.files[0]); });

    async function handleFile(file) {
        if (!file) return;
        errBox.style.display = 'none';
        successBox.style.display = 'none';
        dropContent.style.display = 'none';
        dropUploading.style.display = 'block';
        dropArea.classList.add('uploading');
        try {
            const data = await api.resumeAPI.upload(file);
            showResume(data);
            successText.textContent = 'Resume uploaded and analyzed successfully!';
            successBox.style.display = 'flex';
        } catch (err) {
            errText.textContent = err.message || 'Upload failed';
            errBox.style.display = 'flex';
        } finally {
            dropContent.style.display = 'block';
            dropUploading.style.display = 'none';
            dropArea.classList.remove('uploading');
        }
    }

    // Load existing resume
    api.resumeAPI.getMyResume().then(showResume).catch(() => { });
}

window.renderCandidate = renderCandidate;
