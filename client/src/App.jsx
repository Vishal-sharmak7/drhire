import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import JobsList from './pages/JobsList';
import JobDetails from './pages/JobDetails';
import DoctorDashboard from './pages/DoctorDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DoctorEditProfile from './pages/DoctorEditProfile';
import HospitalEditProfile from './pages/HospitalEditProfile';

function App() {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.key === "1") {
        window.location.href = "/admin/dashboard";
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition-colors duration-300">
            <Navbar />

            <main className="flex-grow">
              <ErrorBoundary>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/jobs" element={<JobsList />} />
                  <Route path="/jobs/:id" element={<JobDetails />} />

                  {/* Doctor Protected Routes */}
                  <Route path="/doctor/dashboard" element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <DoctorDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/doctor/edit-profile" element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <DoctorEditProfile />
                    </ProtectedRoute>
                  } />

                  {/* Hospital Protected Routes */}
                  <Route path="/hospital/dashboard" element={
                    <ProtectedRoute allowedRoles={['hospital']}>
                      <HospitalDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/hospital/edit-profile" element={
                    <ProtectedRoute allowedRoles={['hospital']}>
                      <HospitalEditProfile />
                    </ProtectedRoute>
                  } />

                  {/* Admin Protected Routes */}
                  <Route path="/admin/dashboard" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                </Routes>
              </ErrorBoundary>
            </main>

            <Footer />
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
