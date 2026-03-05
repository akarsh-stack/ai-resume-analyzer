import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobsAPI, dashboardAPI, matchingAPI } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Briefcase, Users, TrendingUp, Plus, Eye, Trash2, Search, Loader2, BarChart3, Sparkles } from 'lucide-react';

const COLORS = ['#7c3aed', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'];

export default function RecruiterDashboard() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [stats, setStats] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            jobsAPI.list().then(r => setJobs(r.data)),
            dashboardAPI.getStats().then(r => setStats(r.data)).catch(() => { }),
        ]).finally(() => setLoading(false));
    }, []);

    const deleteJob = async (id) => {
        if (!confirm('Delete this job posting?')) return;
        await jobsAPI.delete(id);
        setJobs(jobs.filter(j => j.id !== id));
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setSearching(true);
        try {
            const res = await matchingAPI.searchCandidates(searchQuery);
            setSearchResults(res.data);
        } catch { setSearchResults([]); }
        finally { setSearching(false); }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="page-container animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Recruiter Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400">Welcome back, {user.full_name}</p>
                </div>
                <Link to="/recruiter/create-job" className="btn-primary gap-2">
                    <Plus className="w-5 h-5" /> Create Job
                </Link>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {[
                        { icon: Briefcase, label: 'Active Jobs', value: stats.total_jobs, color: 'from-primary-500 to-purple-600' },
                        { icon: Users, label: 'Total Candidates', value: stats.total_candidates, color: 'from-blue-500 to-cyan-600' },
                        { icon: TrendingUp, label: 'Avg Match Score', value: `${stats.avg_match_score.toFixed(1)}%`, color: 'from-emerald-500 to-green-600' },
                    ].map(({ icon: Icon, label, value, color }) => (
                        <div key={label} className="glass-card p-5 flex items-center gap-4 animate-scale-in">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                                <p className="text-2xl font-bold">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Charts */}
            {stats && (stats.top_skills?.length > 0 || stats.score_distribution?.length > 0) && (
                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    {stats.top_skills?.length > 0 && (
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-primary-500" /> Top Skills in Candidate Pool
                            </h3>
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={stats.top_skills} layout="vertical" margin={{ left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                                    <XAxis type="number" tick={{ fontSize: 12 }} />
                                    <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }} />
                                    <Bar dataKey="count" fill="#7c3aed" radius={[0, 6, 6, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {stats.score_distribution?.length > 0 && (
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary-500" /> Score Distribution
                            </h3>
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={stats.score_distribution.filter(d => d.count > 0)}
                                        dataKey="count"
                                        nameKey="range"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        innerRadius={50}
                                        paddingAngle={4}
                                        label={({ range, count }) => `${range}: ${count}`}
                                    >
                                        {stats.score_distribution.filter(d => d.count > 0).map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            )}

            {/* Semantic Search */}
            <div className="glass-card p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Search className="w-5 h-5 text-primary-500" /> Semantic Candidate Search
                </h3>
                <form onSubmit={handleSearch} className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field !pl-11"
                            placeholder="Search candidates by skills, experience, or description..."
                            id="candidate-search"
                        />
                    </div>
                    <button type="submit" disabled={searching} className="btn-primary !px-6" id="search-btn">
                        {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
                    </button>
                </form>

                {searchResults.length > 0 && (
                    <div className="mt-4 space-y-3 animate-slide-up">
                        {searchResults.map((r) => (
                            <div key={r.resume_id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                                <div>
                                    <p className="font-medium">{r.candidate_name}</p>
                                    <p className="text-sm text-gray-500">{r.candidate_email}</p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {r.skills?.slice(0, 5).map(s => <span key={s} className="badge-primary text-xs">{s}</span>)}
                                        {r.skills?.length > 5 && <span className="badge text-xs bg-gray-100 dark:bg-gray-800 text-gray-500">+{r.skills.length - 5}</span>}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-bold gradient-text">{r.similarity_score.toFixed(1)}%</span>
                                    <p className="text-xs text-gray-500">similarity</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Job Listings */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary-500" /> Your Job Postings
                </h3>

                {jobs.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No job postings yet</p>
                        <Link to="/recruiter/create-job" className="btn-primary mt-4 gap-2 inline-flex">
                            <Plus className="w-4 h-4" /> Create Your First Job
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {jobs.map((job) => (
                            <div key={job.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 gap-3 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                                <div className="flex-1">
                                    <h4 className="font-semibold">{job.title}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">{job.description}</p>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {job.required_skills?.slice(0, 4).map(s => <span key={s} className="badge-primary text-xs">{s}</span>)}
                                        {job.required_skills?.length > 4 && <span className="badge text-xs bg-gray-100 dark:bg-gray-800 text-gray-500">+{job.required_skills.length - 4}</span>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link to={`/recruiter/jobs/${job.id}`} className="btn-secondary !py-2 !px-4 text-sm gap-1.5">
                                        <Eye className="w-4 h-4" /> View Matches
                                    </Link>
                                    <button onClick={() => deleteJob(job.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
