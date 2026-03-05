import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, X, Brain, LogOut, User } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { dark, toggle } = useTheme();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-50 glass-card border-b border-gray-200/50 dark:border-gray-800/50 rounded-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-shadow">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold gradient-text hidden sm:block">ResumeAI</span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-2">
                        {!user && (
                            <>
                                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                    Log in
                                </Link>
                                <Link to="/signup" className="btn-primary text-sm !px-5 !py-2">
                                    Get Started
                                </Link>
                            </>
                        )}
                        {user && (
                            <>
                                <Link
                                    to={user.role === 'recruiter' ? '/recruiter' : '/candidate'}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    Dashboard
                                </Link>
                                <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-blue-500 flex items-center justify-center">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="hidden lg:block">
                                            <p className="text-sm font-medium">{user.full_name}</p>
                                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                        </div>
                                    </div>
                                    <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors" title="Logout">
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            </>
                        )}
                        <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors ml-1" title="Toggle theme">
                            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Mobile toggle */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button onClick={toggle} className="p-2 rounded-lg text-gray-500">
                            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg text-gray-500">
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-gray-200 dark:border-gray-800 animate-slide-down">
                    <div className="px-4 py-3 space-y-2">
                        {!user ? (
                            <>
                                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Log in</Link>
                                <Link to="/signup" onClick={() => setMobileOpen(false)} className="block px-4 py-2 rounded-lg text-white bg-primary-600 text-center">Get Started</Link>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 px-4 py-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-blue-500 flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{user.full_name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                    </div>
                                </div>
                                <Link to={user.role === 'recruiter' ? '/recruiter' : '/candidate'} onClick={() => setMobileOpen(false)} className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">Dashboard</Link>
                                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block w-full text-left px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">Logout</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
