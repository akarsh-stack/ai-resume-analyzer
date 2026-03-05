import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CreateJob from './pages/CreateJob';
import JobDetail from './pages/JobDetail';

export default function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <div className="min-h-screen flex flex-col">
                        <Navbar />
                        <main className="flex-1">
                            <Routes>
                                <Route path="/" element={<Landing />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />
                                <Route path="/candidate" element={
                                    <ProtectedRoute role="candidate"><CandidateDashboard /></ProtectedRoute>
                                } />
                                <Route path="/recruiter" element={
                                    <ProtectedRoute role="recruiter"><RecruiterDashboard /></ProtectedRoute>
                                } />
                                <Route path="/recruiter/create-job" element={
                                    <ProtectedRoute role="recruiter"><CreateJob /></ProtectedRoute>
                                } />
                                <Route path="/recruiter/jobs/:id" element={
                                    <ProtectedRoute role="recruiter"><JobDetail /></ProtectedRoute>
                                } />
                            </Routes>
                        </main>
                    </div>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}
