import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import OverviewPage from './pages/dashboard/OverviewPage';
import HabitsPage from './pages/dashboard/HabitsPage';
import WorkoutsPage from './pages/dashboard/WorkoutsPage';
import FinancePage from './pages/dashboard/FinancePage';

import { ThemeProvider } from './context/ThemeContext';

const App = () => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route path="/dashboard" element={<DashboardLayout />}>
                            <Route index element={<Navigate to="overview" replace />} />
                            <Route path="overview" element={<OverviewPage />} />
                            <Route path="habits" element={<HabitsPage />} />
                            <Route path="workouts" element={<WorkoutsPage />} />
                            <Route path="finance" element={<FinancePage />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    );
};

export default App;
