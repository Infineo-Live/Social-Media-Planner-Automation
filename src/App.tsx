import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/authContext';
import { AppProvider } from './context/appContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './auth/protectedRoute';
import { MainLayout } from './layout/MainLayout';
import { ROUTES } from './config/constants';

import { Login } from './pages/Login';
import { Unauthorized } from './pages/Unauthorized';
import { Dashboard } from './pages/Dashboard';
import { MyTasks } from './pages/MyTasks';
import { AvailableWork } from './pages/AvailableWork';
import { Approvals } from './pages/Approvals';
import { ContentLibrary } from './pages/ContentLibrary';
import { CreateContent } from './pages/CreateContent';
import { ContentDetail } from './pages/ContentDetail';
import { NotificationsPage } from './pages/NotificationsPage';
import { TeamOverview } from './pages/TeamOverview';
import { UsersManagement } from './pages/UsersManagement';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppProvider>
            <Routes>
              <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.MY_TASKS}
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <MyTasks />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.AVAILABLE_WORK}
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <AvailableWork />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.APPROVALS}
              element={
                <ProtectedRoute allowedRoles={['Manager', 'Admin']}>
                  <MainLayout>
                    <Approvals />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.CONTENT_LIBRARY}
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ContentLibrary />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.CONTENT_CREATE}
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CreateContent />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.CONTENT_DETAIL}
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ContentDetail />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.NOTIFICATIONS}
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <NotificationsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.TEAM_OVERVIEW}
              element={
                <ProtectedRoute allowedRoles={['Manager', 'Admin']}>
                  <MainLayout>
                    <TeamOverview />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.USERS}
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <MainLayout>
                    <UsersManagement />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.SETTINGS}
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <MainLayout>
                    <SettingsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.PROFILE}
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ProfilePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
