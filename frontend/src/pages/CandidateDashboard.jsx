import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { resumeAPI } from '../api';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle2, XCircle, User, Mail, GraduationCap, Briefcase, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

export default function CandidateDashboard() {
    const { user } = useAuth();
    const [resume, setResume] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        resumeAPI.getMyResume()
            .then(res => setResume(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;
        setError('');
        setSuccess('');
        setUploading(true);
        try {
            const res = await resumeAPI.upload(file);
            setResume(res.data);
            setSuccess('Resume uploaded and analyzed successfully!');
        } catch (err) {
            setError(err.response?.data?.detail || 'Upload failed');
        } finally {
            setUploading(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        },
        maxFiles: 1,
        disabled: uploading,
    });

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
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-1">Welcome, {user.full_name} 👋</h1>
                <p className="text-gray-500 dark:text-gray-400">Upload your resume and let AI analyze your skills</p>
            </div>

            {/* Messages */}
            {error && (
                <div className="flex items-center gap-2 p-4 mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
                </div>
            )}
            {success && (
                <div className="flex items-center gap-2 p-4 mb-6 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 animate-scale-in">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> {success}
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-primary-500" /> Upload Resume
                    </h2>

                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ${isDragActive
                                ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                            } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        <input {...getInputProps()} id="resume-upload-input" />
                        {uploading ? (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                                <p className="text-primary-600 dark:text-primary-400 font-medium">Analyzing your resume with AI...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-900/30 dark:to-blue-900/30 flex items-center justify-center">
                                    <FileText className="w-8 h-8 text-primary-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-700 dark:text-gray-300">
                                        {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">or click to browse · PDF, DOCX supported</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {resume && (
                        <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-sm">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="font-medium">{resume.filename}</span> — uploaded and analyzed
                        </div>
                    )}
                </div>

                {/* Profile Card */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-primary-500" /> Your Profile
                    </h2>

                    {!resume ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <FileText className="w-12 h-12 mb-3 opacity-50" />
                            <p>Upload a resume to see your profile</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-blue-500 flex items-center justify-center">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-lg">{resume.parsed_name || user.full_name}</p>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <Mail className="w-3.5 h-3.5" /> {resume.parsed_email || user.email}
                                    </p>
                                </div>
                            </div>

                            {resume.parsed_education && (
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                        <GraduationCap className="w-4 h-4" /> Education
                                    </div>
                                    <p className="text-sm whitespace-pre-line">{resume.parsed_education}</p>
                                </div>
                            )}

                            {resume.parsed_experience && (
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                        <Briefcase className="w-4 h-4" /> Experience
                                    </div>
                                    <p className="text-sm whitespace-pre-line">{resume.parsed_experience}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Skills Section */}
            {resume?.skills?.length > 0 && (
                <div className="glass-card p-6 mt-8 animate-slide-up">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary-500" /> Extracted Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {resume.skills.map((skill) => (
                            <span key={skill} className="badge-primary">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
