import { Link } from 'react-router-dom';
import { Brain, Upload, BarChart3, Target, Zap, Shield, ArrowRight, Sparkles } from 'lucide-react';

const features = [
    { icon: Upload, title: 'Smart Resume Parsing', desc: 'Upload PDF or DOCX resumes and our AI automatically extracts skills, experience, and education.' },
    { icon: Brain, title: 'AI-Powered Matching', desc: 'Sentence Transformers and NLP compare candidates with job requirements using semantic similarity.' },
    { icon: BarChart3, title: 'Candidate Ranking', desc: 'Instantly rank candidates by match score with detailed skill gap analysis.' },
    { icon: Target, title: 'Skill Gap Analysis', desc: 'See exactly which skills candidates are missing for each position.' },
    { icon: Zap, title: 'Semantic Search', desc: 'Search your entire candidate pool using natural language queries powered by FAISS.' },
    { icon: Shield, title: 'Role-Based Access', desc: 'Secure system with separate views for recruiters and candidates.' },
];

export default function Landing() {
    return (
        <div className="animate-fade-in">
            {/* Hero */}
            <section className="relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary-500/5 via-transparent to-blue-500/5 rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-sm font-medium mb-8 animate-scale-in">
                            <Sparkles className="w-4 h-4" />
                            AI-Powered Recruitment Platform
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
                            <span className="block">Screen Resumes</span>
                            <span className="gradient-text">10x Faster with AI</span>
                        </h1>

                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Upload resumes, create job postings, and let our AI match the best
                            candidates using semantic analysis and skill-based scoring.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/signup" className="btn-primary text-lg !px-8 !py-4 gap-2 group">
                                Start Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/login" className="btn-secondary text-lg !px-8 !py-4">
                                Log In
                            </Link>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-20">
                        {[
                            { value: '95%', label: 'Accuracy' },
                            { value: '10x', label: 'Faster' },
                            { value: '90+', label: 'Skills Tracked' },
                        ].map(({ value, label }) => (
                            <div key={label} className="text-center">
                                <div className="text-3xl font-bold gradient-text">{value}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 bg-gray-50/50 dark:bg-gray-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Everything You Need to
                            <span className="gradient-text"> Hire Smarter</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Our AI-driven platform streamlines the entire recruitment pipeline from resume screening to candidate ranking.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map(({ icon: Icon, title, desc }, i) => (
                            <div
                                key={title}
                                className="glass-card-hover p-6 group animate-slide-up"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/10 to-blue-500/10 dark:from-primary-500/20 dark:to-blue-500/20 flex items-center justify-center mb-4 group-hover:from-primary-500 group-hover:to-blue-600 transition-all duration-300">
                                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors duration-300" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-gray-600 dark:text-gray-400">Three simple steps to find the perfect candidate</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '01', title: 'Upload Resumes', desc: 'Candidates upload their resumes in PDF or DOCX format. Our parser extracts all relevant information automatically.' },
                            { step: '02', title: 'Create Job Posts', desc: 'Recruiters define job requirements including skills, experience, and description. The AI analyzes every detail.' },
                            { step: '03', title: 'Get AI Rankings', desc: 'Our engine matches candidates to jobs using AI similarity scoring and ranks them by best fit percentage.' },
                        ].map(({ step, title, desc }, i) => (
                            <div key={step} className="relative animate-slide-up" style={{ animationDelay: `${i * 150}ms` }}>
                                <div className="text-7xl font-black text-primary-100 dark:text-primary-900/30 absolute -top-4 -left-2">{step}</div>
                                <div className="relative pt-8 pl-2">
                                    <h3 className="text-xl font-bold mb-3">{title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="glass-card p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 via-transparent to-blue-600/5" />
                        <div className="relative">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Revolutionize Your Hiring?</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
                                Join the AI-powered recruitment revolution. Start screening resumes smarter today.
                            </p>
                            <Link to="/signup" className="btn-primary text-lg !px-8 !py-4 gap-2 group">
                                Get Started Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Brain className="w-5 h-5 text-primary-600" />
                        <span className="font-bold gradient-text">ResumeAI</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        © 2026 AI Resume Analyzer. Built with FastAPI, React & Sentence Transformers.
                    </p>
                </div>
            </footer>
        </div>
    );
}
