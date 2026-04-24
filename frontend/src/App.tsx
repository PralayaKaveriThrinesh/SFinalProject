import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardLayout from './components/layout/DashboardLayout';
import StudentDashboard from './pages/student/Dashboard';
import CodeUpload from './pages/student/Upload';
import SubmissionHistory from './pages/student/History';
import AdminDashboard from './pages/admin/Dashboard';
import PlagiarismMatrix from './pages/admin/SimilarityMatrix';
import CodeAnalysis from './pages/CodeAnalysis';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col h-screen bg-beige-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
          <Navbar />
          <div className="flex-1 overflow-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Login />} />
              <Route path="/ide" element={<Navigate to="/student/upload" replace />} />
              
              <Route path="/student/*" element={
                <DashboardLayout role="student">
                  <Routes>
                    <Route path="/" element={<CodeUpload />} />
                    <Route path="upload" element={<CodeUpload />} />
                    <Route path="dashboard" element={<StudentDashboard />} />
                    <Route path="history" element={<SubmissionHistory />} />
                    <Route path="analysis/:id" element={<CodeAnalysis />} />
                  </Routes>
                </DashboardLayout>
              } />
  
              <Route path="/admin/*" element={
                <DashboardLayout role="admin">
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="submissions" element={<PlagiarismMatrix />} />
                    <Route path="analysis/:id" element={<CodeAnalysis />} />
                  </Routes>
                </DashboardLayout>
              } />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
