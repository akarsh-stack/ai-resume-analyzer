import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobsAPI, matchingAPI } from '../api';
import { ArrowLeft, Users, Trophy, AlertTriangle, CheckCircle2, XCircle, Loader2, Sparkles, Target } from 'lucide-react';

function ScoreBar({ score, label, color = 'from-primary-500 to-blue-500' }) {
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500 dark:text-gray-400">{label}</span>
                <span className="font-semibold">{score.toFixed(1)}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className={`score-bar bg-gradient-to-r ${color}`} style={{ width: `${Math.min(score, 100)}%` }} />
            </div>
        </div>
    );
}

export default function JobDetail() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [matchLoading, setMatchLoading] = useState(false);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        jobsAPI.get(id).then(r => setJob(r.data)).finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (job) {
            setMatchLoading(true);
            matchingAPI.getMatches(id).then(r => setMatches(r.data)).finally(() => setMatchLoading(false));
        }
    }, [job]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="page-container text-center py-20">
                <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold">Job not found</h2>
                <Link to="/recruiter" className="btn-primary mt-4 inline-flex">Back to Dashboard</Link>
            </div>
        );
    }

    const getRankColor = (index) => {
        if (index === 0) return 'from-yellow-400 to-amber-500';
        if (index === 1) return 'from-gray-300 to-gray-400';
        if (index === 2) return 'from-orange-400 to-amber-600';
        return 'from-primary-400 to-blue-500';
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
        if (score >= 60) return 'text-blue-600 dark:text-blue-400';
        if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-500 dark:text-red-400';
    };

    return (
        <div className="page-container animate-fade-in">
            {/* Back + Header */}
            <Link to="/recruiter" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>

            <div className="glass-card p-6 mb-8">
                <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{job.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    {job.experience_required && <span>📋 {job.experience_required}</span>}
                    {job.location && <span>📍 {job.location}</span>}
                    {job.salary_range && <span>💰 {job.salary_range}</span>}
                </div>
                <div className="mt-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Required Skills:</p>
                    <div className="flex flex-wrap gap-2">
                        {job.required_skills?.map(s => <span key={s} className="badge-primary">{s}</span>)}
                    </div>
                </div>
            </div>

            {/* Candidate Rankings */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-primary-500" /> Candidate Rankings
                    </h2>
                    <span className="badge-primary">
                        <Users className="w-4 h-4 mr-1" /> {matches.length} candidates
                    </span>
                </div>

                {matchLoading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-3" />
                        <p className="text-gray-500">Running AI matching engine...</p>
                    </div>
                ) : matches.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No candidates have uploaded resumes yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {matches.map((match, i) => (
                            <div key={match.resume_id} className="rounded-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden hover:border-primary-300 dark:hover:border-primary-700 transition-colors animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                                <div
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 cursor-pointer"
                                    onClick={() => setExpanded(expanded === i ? null : i)}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Rank badge */}
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getRankColor(i)} flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0`}>
                                            #{i + 1}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{match.candidate_name}</p>
                                            <p className="text-sm text-gray-500">{match.candidate_email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 mt-3 sm:mt-0">
                                        <div className="text-right">
                                            <p className={`text-3xl font-bold ${getScoreColor(match.overall_score)}`}>
                                                {match.overall_score.toFixed(1)}%
                                            </p>
                                            <p className="text-xs text-gray-500">Overall Match</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded details */}
                                {expanded === i && (
                                    <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-800 pt-4 animate-slide-down">
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <ScoreBar score={match.skill_match_score} label="Skill Match" color="from-purple-500 to-primary-500" />
                                                <ScoreBar score={match.semantic_score} label="Semantic Similarity" color="from-blue-500 to-cyan-500" />
                                            </div>

                                            <div className="space-y-4">
                                                {/* Matched skills */}
                                                <div>
                                                    <p className="text-sm font-medium flex items-center gap-1.5 mb-2">
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Matched Skills
                                                    </p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {match.matched_skills?.length > 0
                                                            ? match.matched_skills.map(s => <span key={s} className="badge-green text-xs">{s}</span>)
                                                            : <span className="text-sm text-gray-400">None</span>
                                                        }
                                                    </div>
                                                </div>

                                                {/* Missing skills */}
                                                <div>
                                                    <p className="text-sm font-medium flex items-center gap-1.5 mb-2">
                                                        <XCircle className="w-4 h-4 text-red-500" /> Missing Skills (Skill Gap)
                                                    </p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {match.missing_skills?.length > 0
                                                            ? match.missing_skills.map(s => <span key={s} className="badge-red text-xs">{s}</span>)
                                                            : <span className="text-sm text-emerald-500 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> All skills matched!</span>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* AI Feedback */}
                                        {match.missing_skills?.length > 0 && (
                                            <div className="mt-4 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                                                <p className="text-sm font-medium text-primary-700 dark:text-primary-300 flex items-center gap-1.5 mb-1">
                                                    <Target className="w-4 h-4" /> AI Recommendation for Candidate
                                                </p>
                                                <p className="text-sm text-primary-600 dark:text-primary-400">
                                                    To improve match score, this candidate should develop skills in: <strong>{match.missing_skills.join(', ')}</strong>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
