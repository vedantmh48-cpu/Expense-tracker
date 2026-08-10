import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ExpenseProvider } from './context/ExpenseContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ActivityPage } from './pages/ActivityPage';
import { SettingsPage } from './pages/SettingsPage';
import { HowToUsePage } from './pages/HowToUsePage';
import { ContactPage } from './pages/ContactPage';
import { AuthPage } from './components/AuthPage';
import { TransactionModal } from './components/TransactionModal';
import { BudgetModal } from './components/BudgetModal';
import { ExportImportModal } from './components/ExportImportModal';

function ProtectedRoutes() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <AuthPage />;
  }

  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/how-to-use" element={<HowToUsePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>

      {/* Global Modals */}
      <TransactionModal />
      <BudgetModal />
      <ExportImportModal />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <BrowserRouter>
          <ProtectedRoutes />
        </BrowserRouter>
      </ExpenseProvider>
    </AuthProvider>
  );
}

export default App;