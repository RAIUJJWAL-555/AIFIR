import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import DashboardLayout from './components/layout/DashboardLayout';
import UserDashboard from './pages/user/UserDashboard';
import RegisterComplaint from './pages/user/RegisterComplaint';
import PoliceDashboard from './pages/police/PoliceDashboard';
import ReviewComplaints from './pages/police/ReviewComplaints';
import FIRManagement from './pages/police/FIRManagement';
import OfficerAssignment from './pages/police/OfficerAssignment';

import Home from './pages/Home';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their appropriate dashboard if they try to access wrong one
    return <Navigate to={user.role === 'police' ? '/police/dashboard' : '/user/dashboard'} />;
  }

  return children;
};

import { Toaster } from 'react-hot-toast';

import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* User Routes */}
            <Route path="/user" element={
              <ProtectedRoute allowedRoles={['user', 'citizen']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="register" element={<RegisterComplaint />} />
              <Route path="status" element={<div>Complaint Status Page</div>} />
              <Route path="complaint/:id" element={<div>Complaint Details</div>} />
            </Route>

            {/* Police Routes */}
            <Route path="/police" element={
              <ProtectedRoute allowedRoles={['police']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<PoliceDashboard />} />
              <Route path="review" element={<ReviewComplaints />} />
              <Route path="firs" element={<FIRManagement />} />
              <Route path="assign" element={<OfficerAssignment />} />
            </Route>

          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
