import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';

function Placeholder({ titre }: { titre: string }) {
  return <h1 className="text-2xl font-bold text-slate-800">{titre}</h1>;
}
 export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/connexion" element={< Login/>} />
          <Route path="/" element={
            <ProtectedRoute>
              <Placeholder titre="Mes notes de frais" />
              </ProtectedRoute>
          } />
          <Route path="/nouvelle-note" element={
            <ProtectedRoute>
              <Placeholder titre="Nouvelle note de frais" />
            </ProtectedRoute>
          } />
          <Route path="/toutes-les-notes" element={
            <ProtectedRoute roles={['manager', 'accounting']}>
              <Placeholder titre="Toutes les notes" />
            </ProtectedRoute >
          } />
          <Route
            path="/comptes" element={
              <ProtectedRoute roles={['manager']}>
                <Placeholder titre="Création de comptes" />
              </ProtectedRoute>
            }/>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  );
 }