
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TicketsPage from './pages/TicketsPage';
import UsersPage from './pages/UsersPage';
import ProfilePage from './pages/ProfilePage';
import Layout from './components/layout/Layout';
import { Permission } from './types';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredPermission?: Permission }> = ({ children, requiredPermission }) => {
  const { isAuthenticated, hasPermission } = useAuth();
  console.log(requiredPermission, "requiredPermission")
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  console.log('isAuthenticated', useAuth(), 'Permission.CAN_MANAGE_USERS', Permission);
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/admin-login" element={isAuthenticated ? <Navigate to="/admin" /> : <AdminLoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/tickets" element={<TicketsPage />} />
                <Route path="/users" element={<ProtectedRoute requiredPermission={Permission.CAN_MANAGE_USERS}><UsersPage /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute requiredPermission={Permission?.CAN_MANAGE_USERS}><AdminPage /></ProtectedRoute  >} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
