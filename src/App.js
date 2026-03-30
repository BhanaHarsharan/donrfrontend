import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Questionnaire from './components/Questionnaire/Questionnaire';
import QRDisplay from './components/QRDisplay';
import StaffVerify from './components/StaffVerify';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/questionnaire"
        element={
          <PrivateRoute>
            <Questionnaire />
          </PrivateRoute>
        }
      />
      <Route
        path="/qr"
        element={
          <PrivateRoute>
            <QRDisplay />
          </PrivateRoute>
        }
      />
      <Route path="/staff/verify" element={<StaffVerify />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;