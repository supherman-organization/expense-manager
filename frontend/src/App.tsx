import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import MyExpenses from './pages/MyExpenses';

function Placeholder({ titre }: { titre: string }) {
  return <h1 className="text-2xl font-bold text-slate-800">{titre}</h1>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/connexion" element={<Login />} />

          {/* Espace connecté (tous rôles) — coquille commune via Layout */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<MyExpenses />} />
            <Route path="/nouvelle-note" element={<Placeholder titre="Nouvelle note de frais" />} />
            <Route path="/profil" element={<Placeholder titre="Mon profil" />} />
          </Route>

          {/* Manager + Comptabilité */}
          <Route
            element={
              <ProtectedRoute roles={['manager', 'accounting']}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/toutes-les-notes" element={<Placeholder titre="Toutes les notes" />} />
          </Route>

          {/* Manager uniquement */}
          <Route
            element={
              <ProtectedRoute roles={['manager']}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/comptes" element={<Placeholder titre="Création de comptes" />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}