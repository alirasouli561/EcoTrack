import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { RoleBasedLayout } from './components/desktop/RoleBasedLayout';
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import TermsPage from './pages/auth/TermsPage';
import PrivacyPage from './pages/auth/PrivacyPage';
import ActivateAccountPage from './pages/auth/ActivateAccountPage';

import AdminDashboard from './pages/desktop/admin/Dashboard';
import RolesPage from './pages/desktop/admin/Roles';
import UsersPage from './pages/desktop/admin/Users';
import CreateUserPage from './pages/desktop/admin/CreateUser';
import UserDetailPage from './pages/desktop/admin/UserDetail';
import ConteneursPage from './pages/desktop/admin/Conteneurs';
import ZonesPage from './pages/desktop/admin/Zones';
import SignalementsPage from './pages/desktop/admin/Signalements';
import SignalementDetailPage from './pages/desktop/admin/SignalementDetail';
import AlertsPage from './pages/desktop/admin/Alerts';
import LogsPage from './pages/desktop/admin/Logs';
import MonitoringPage from './pages/desktop/admin/Monitoring';
import ConfigurationPage from './pages/desktop/admin/Configuration';

import GestionnaireDashboard from './pages/desktop/gestionnaire/GestionnaireDashboard';
import TourneePage from './pages/desktop/gestionnaire/tournee';

import MobileLayout from './pages/mobile/MobileLayout';
import CitizenHome from './pages/mobile/CitizenHome';
import CitizenMap from './pages/mobile/CitizenMap';
import CitizenSignaler from './pages/mobile/CitizenSignaler';
import CitizenSignalerSuccess from './pages/mobile/CitizenSignalerSuccess';
import CitizenMesSignalements from './pages/mobile/CitizenMesSignalements';
import CitizenSignalementDetail from './pages/mobile/CitizenSignalementDetail';
import CitizenDefis from './pages/mobile/CitizenDefis';
import CitizenProfil from './pages/mobile/CitizenProfil';
import CitizenEditProfil from './pages/mobile/CitizenEditProfil';
import CitizenNotifications from './pages/mobile/CitizenNotifications';
import CitizenTri from './pages/mobile/CitizenTri';
import CitizenBoutique from './pages/mobile/CitizenBoutique';
import CitizenPointsHistorique from './pages/mobile/CitizenPointsHistorique';

function RootRedirect() {
  const { user } = useAuth();
  const role = user?.role || user?.role_par_defaut;

  if (role === 'CITOYEN') {
    return <Navigate to="/citoyen" replace />;
  }
  if (role === 'GESTIONNAIRE') {
    return <Navigate to="/gestionnaire" replace />;
  }
  return <Navigate to="/admin" replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/activate" element={<ActivateAccountPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          
          {/* Desktop Routes (Admin & Gestionnaire) */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <RoleBasedLayout>
                <AdminDashboard />
              </RoleBasedLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute>
              <RoleBasedLayout>
                <UsersPage />
              </RoleBasedLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users/create" element={
            <ProtectedRoute>
              <RoleBasedLayout>
                <CreateUserPage />
              </RoleBasedLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users/:id" element={
            <ProtectedRoute>
              <RoleBasedLayout>
                <UserDetailPage />
              </RoleBasedLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/roles" element={
            <ProtectedRoute>
              <RoleBasedLayout>
                <RolesPage />
              </RoleBasedLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/zones" element={
            <ProtectedRoute>
              <RoleBasedLayout>
                <ZonesPage />
              </RoleBasedLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/conteneurs" element={
            <ProtectedRoute>
              <RoleBasedLayout>
                <ConteneursPage />
              </RoleBasedLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/signalements" element={
            <ProtectedRoute>
              <RoleBasedLayout>
                <SignalementsPage />
              </RoleBasedLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/signalements/:id" element={
            <ProtectedRoute>
              <RoleBasedLayout>
                <SignalementDetailPage />
              </RoleBasedLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/alerts" element={
            <ProtectedRoute>
              <RoleBasedLayout>
                <AlertsPage />
              </RoleBasedLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/logs" element={
            <ProtectedRoute>
              <RoleBasedLayout>
                <LogsPage />
              </RoleBasedLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/monitoring" element={
            <ProtectedRoute>
              <RoleBasedLayout>
                <MonitoringPage />
              </RoleBasedLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/config" element={
            <ProtectedRoute>
              <RoleBasedLayout>
                <ConfigurationPage />
              </RoleBasedLayout>
            </ProtectedRoute>
          } />

          {/* Routes Citoyen (Mobile) — all nested under MobileLayout */}
          <Route path="/citoyen" element={<ProtectedRoute><MobileLayout /></ProtectedRoute>}>
            <Route index element={<CitizenHome />} />
            <Route path="carte" element={<CitizenMap />} />
            <Route path="signaler" element={<CitizenSignaler />} />
            <Route path="signaler/success" element={<CitizenSignalerSuccess />} />
            <Route path="signalements" element={<CitizenMesSignalements />} />
            <Route path="signalements/:id" element={<CitizenSignalementDetail />} />
            <Route path="defis" element={<CitizenDefis />} />
            <Route path="profil" element={<CitizenProfil />} />
            <Route path="profil/modifier" element={<CitizenEditProfil />} />
            <Route path="notifications" element={<CitizenNotifications />} />
            <Route path="tri" element={<CitizenTri />} />
            <Route path="boutique" element={<CitizenBoutique />} />
            <Route path="points-historique" element={<CitizenPointsHistorique />} />
            <Route path="*" element={<CitizenHome />} />
          </Route>

          {/* Routes Gestionnaire */}
          <Route path="/gestionnaire" element={
            <ProtectedRoute>
              <RoleBasedLayout>
                <GestionnaireDashboard />
              </RoleBasedLayout>
            </ProtectedRoute>
          } />
          <Route path="/gestionnaire/tournees" element={
            <ProtectedRoute>
              <RoleBasedLayout>
                <TourneePage />
              </RoleBasedLayout>
            </ProtectedRoute>
          } />
          <Route path="/gestionnaire/*" element={
            <ProtectedRoute>
              <RoleBasedLayout>
                <GestionnaireDashboard />
              </RoleBasedLayout>
            </ProtectedRoute>
          } />

          <Route path="/" element={
            <ProtectedRoute>
              <RootRedirect />
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={<Navigate to="/admin" replace />} />

          <Route path="/unauthorized" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
                <p className="text-gray-600">Vous n'avez pas accès à cette page</p>
                <a href="/login" className="text-green-600 hover:underline">Retour à la connexion</a>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;