import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../api';
import { Briefcase, Plus, X, AlertCircle, Sparkles } from 'lucide-react';

const SUGGESTED_SKILLS = [
    'Python', 'Java', 'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 'Node.js',
    'Django', 'FastAPI', 'Spring Boot', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
    'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Machine Learning', 'Deep Learning',
    'TensorFlow', 'PyTorch', 'NLP', 'Git', 'CI/CD', 'REST API', 'GraphQL', 'Microservices',
    'Linux', 'DevOps', 'Agile', 'Data Engineering', 'Go', 'Rust', 'C++', 'Swift',
];

export default function CreateJob() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '', description: '', experience_required: '', location: '', salary_range: '',
    });
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const addSkill = (skill) => {
        const s = skill.trim();
        if (s && !skills.includes(s)) setSkills([...skills, s]);
        setSkillInput('');
    };

    const removeSkill = (skill) => setSkills(skills.filter(s => s !== skill));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (skills.length === 0) { setError('Add at least one required skill'); return; }
        setLoading(true);
        try {
            await jobsAPI.create({ ...form, required_skills: skills });
            navigate('/recruiter');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to create job');
        } finally { setLoading(false); }
    };

    const filteredSuggestions = SUGGESTED_SKILLS.filter(
        s => !skills.includes(s) && s.toLowerCase().includes(skillInput.toLowerCase())
    ).slice(0, 8);

    return (
        <div className="page-container animate-fade-in">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        Create Job Posting
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Define the role and let AI match the best candidates</p>
                </div>

                {error && (
                    <div className="flex items-center gap-2 p-4 mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
                        <AlertCircle className="w-5 h-5" /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Job Title *</label>
                        <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="e.g. Senior Python Developer" id="job-title" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Job Description *</label>
                        <textarea required rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" placeholder="Describe the role, responsibilities, and what you're looking for..." id="job-description" />
                    </div>

                    {/* Skills */}
                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary-500" /> Required Skills *
                        </label>
                        {skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {skills.map(s => (
                                    <span key={s} className="badge-primary flex items-center gap-1.5">
                                        {s}
                                        <button type="button" onClick={() => removeSkill(s)} className="hover:text-red-500 transition-colors">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                        <div className="relative">
                            <input
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
                                className="input-field"
                                placeholder="Type a skill and press Enter..."
                                id="skill-input"
                            />
                        </div>
                        {skillInput && filteredSuggestions.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                                {filteredSuggestions.map(s => (
                                    <button key={s} type="button" onClick={() => addSkill(s)} className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-100 hover:text-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-300 transition-colors cursor-pointer text-xs">
                                        + {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Experience</label>
                            <input value={form.experience_required} onChange={(e) => setForm({ ...form, experience_required: e.target.value })} className="input-field" placeholder="e.g. 3-5 years" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Location</label>
                            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" placeholder="e.g. Remote" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Salary Range</label>
                            <input value={form.salary_range} onChange={(e) => setForm({ ...form, salary_range: e.target.value })} className="input-field" placeholder="e.g. $100k-$130k" />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={loading} className="btn-primary gap-2 flex-1" id="create-job-submit">
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus className="w-5 h-5" /> Create Job Posting</>}
                        </button>
                        <button type="button" onClick={() => navigate('/recruiter')} className="btn-secondary">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
