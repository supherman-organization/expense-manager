import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import MyExpenses from './pages/MyExpenses';
import NewExpense from './pages/NewExpense';
import AllExpenses from './pages/AllExpenses';
import Profile from './pages/Profile';
import CreateAccount from './pages/CreateAccount';

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
            <Route path="/nouvelle-note" element={<NewExpense />} />
            <Route path="/profil" element={<Profile />} />
          </Route>

          {/* Manager + Comptabilité */}
          <Route
            element={
              <ProtectedRoute roles={['manager', 'accounting']}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/toutes-les-notes" element={<AllExpenses />} />
          </Route>

          {/* Manager uniquement */}
          <Route
            element={
              <ProtectedRoute roles={['manager']}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/comptes" element={<CreateAccount />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}