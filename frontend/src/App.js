import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage       from './pages/AuthPage';
import UserDashboard  from './pages/UserDashboard';
import VehiclesPage   from './pages/VehiclesPage';
import LicensesPage   from './pages/LicensesPage';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

// Protected route wrapper
const Protected = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} /> : <AuthPage />} />

      <Route path="/dashboard" element={<Protected><UserDashboard /></Protected>} />
      <Route path="/vehicles"  element={<Protected><VehiclesPage /></Protected>} />
      <Route path="/licenses"  element={<Protected><LicensesPage /></Protected>} />

      <Route path="/admin"          element={<Protected adminOnly><AdminDashboard /></Protected>} />
      <Route path="/admin/vehicles" element={<Protected adminOnly><VehiclesPage /></Protected>} />
      <Route path="/admin/licenses" element={<Protected adminOnly><LicensesPage /></Protected>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
