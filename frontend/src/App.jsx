import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import DashboardLayout from './components/layout/DashboardLayout';
import UserDashboard from './pages/user/UserDashboard';
import RegisterComplaint from './pages/user/RegisterComplaint';
import ComplaintStatus from './pages/user/ComplaintStatus';
import ComplaintDetails from './pages/user/ComplaintDetails';
import NearbyStations from './pages/user/NearbyStations';
import PoliceDashboard from './pages/police/PoliceDashboard';
import ReviewComplaints from './pages/police/ReviewComplaints';
import FIRManagement from './pages/police/FIRManagement';
import OfficerAssignment from './pages/police/OfficerAssignment';
import OfficerDashboard from './pages/police/OfficerDashboard';
import CaseDetails from './pages/police/CaseDetails';
import RegisterOfficer from './pages/police/RegisterOfficer';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import IdentityVerification from './pages/admin/IdentityVerification';
import UserProfile from './pages/user/UserProfile';

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
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" />;
    if (user.role === 'police') return <Navigate to="/police/my-cases" />;
    return <Navigate to="/user/dashboard" />;
  }

  return children;
};

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ErrorBoundary from './components/ErrorBoundary';
import Chatbot from './components/chatbot/Chatbot';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
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
              <Route path="profile" element={<UserProfile />} />
              <Route path="register" element={<RegisterComplaint />} />
              <Route path="status" element={<ComplaintStatus />} />
              <Route path="complaint/:id" element={<ComplaintDetails />} />
              <Route path="nearby-stations" element={<NearbyStations />} />
            </Route>

            {/* Admin Routes (Assigners) */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>

              {/* ... (in Admin Routes) */}
              <Route path="dashboard" element={<PoliceDashboard />} /> {/* Reusing PoliceDashboard for Admin for now */}
              <Route path="analytics" element={<AnalyticsDashboard />} />
              <Route path="assign" element={<OfficerAssignment />} />
              <Route path="review" element={<ReviewComplaints />} />
              <Route path="officers/register" element={<RegisterOfficer />} />
              <Route path="users/verify" element={<IdentityVerification />} />
              <Route path="case/:id" element={<CaseDetails />} />
              <Route path="firs" element={<FIRManagement />} />
            </Route>

            {/* Police Routes (Officers) */}
            <Route path="/police" element={
              <ProtectedRoute allowedRoles={['police']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="my-cases" element={<OfficerDashboard />} />
              <Route path="case/:id" element={<CaseDetails />} />
              {/* Police can't see assign page */}
            </Route>

          </Routes>
          <Chatbot />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
