import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CustomerListPage } from './pages/CustomerListPage';
import { CustomerFormPage } from './pages/CustomerFormPage';
import { CustomerDetailsPage } from './pages/CustomerDetailsPage';
import { CustomerAssignPage } from './pages/CustomerAssignPage';
import { VenuesPage } from './pages/VenuesPage';
import { VendorsPage } from './pages/VendorsPage';
import { TrackingPage } from './pages/TrackingPage';
import { ReportsPage } from './pages/ReportsPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customers" 
        element={
          <ProtectedRoute>
            <CustomerListPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customers/new" 
        element={
          <ProtectedRoute>
            <CustomerFormPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customers/:id" 
        element={
          <ProtectedRoute>
            <CustomerDetailsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customers/:id/edit" 
        element={
          <ProtectedRoute>
            <CustomerFormPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customers/:id/assign" 
        element={
          <ProtectedRoute>
            <CustomerAssignPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/venues" 
        element={
          <ProtectedRoute>
            <VenuesPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/vendors" 
        element={
          <ProtectedRoute>
            <VendorsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tracking" 
        element={
          <ProtectedRoute>
            <TrackingPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reports" 
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        } 
      />
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
