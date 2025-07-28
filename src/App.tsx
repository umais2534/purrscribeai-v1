import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import routes from "tempo-routes";
import { useAuth } from "./hooks/useAuth";

// Auth Pages
import LoginPage from "./components/auth/LoginPage02";
import PaywallPage from "./components/auth/PaywallPage";

// Dashboard Pages
import Dashboard from "./components/dashboard/Dashboard";
import TranscribePage from "./components/transcription/TranscribePage";
import HistoryPage from "./components/transcription/HistoryPage";
import PetsPage from "./components/pets/PetsPage";
import ClinicsPage from "./components/clinics/ClinicsPage";
import ProfilePage from "./components/profile/ProfilePage";
import FilesPage from "./components/files/FilesPage";
import CallsPage from "./components/calls/CallsPage";
import VisitTypeTemplatesPage from "./components/transcription/VisitTypeTemplatesPage";

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while Auth0 is initializing
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Loading authentication...</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<p className="p-4">Loading...</p>}>
      <>
        {/* Tempo routes for storyboards */}
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/paywall"
            element={
              isAuthenticated ? <PaywallPage /> : <Navigate to="/login" />
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/transcribe"
            element={
              isAuthenticated ? <TranscribePage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/history"
            element={
              isAuthenticated ? <HistoryPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/pets"
            element={isAuthenticated ? <PetsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/clinics"
            element={
              isAuthenticated ? <ClinicsPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/profile"
            element={
              isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/files"
            element={isAuthenticated ? <FilesPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/calls"
            element={isAuthenticated ? <CallsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/templates"
            element={
              isAuthenticated ? (
                <VisitTypeTemplatesPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Redirect root to login or dashboard based on auth status */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />

          {/* Tempo storybook route */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" element={<div />} />
          )}
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
