import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Landmark, CheckCircle2, Circle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BRAND_NAME } from '../utils/branding';

type Step = 'login' | 'set-password';

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  hint?: ReactNode;
}

function PasswordInput({ id, label, value, onChange, autoComplete, hint }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative mt-1">
        <Lock
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          id={id}
          type={show ? 'text' : 'password'}
          autoComplete={autoComplete}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-10 text-slate-800 placeholder:text-slate-400 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 transition hover:text-slate-600"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {hint && <div className="mt-1.5">{hint}</div>}
    </div>
  );
}

function Requirement({ met, label }: { met: boolean; label: string }) {
  return (
    <p className={`flex items-center gap-1.5 text-xs ${met ? 'text-green-600' : 'text-slate-400'}`}>
      {met ? <CheckCircle2 size={14} /> : <Circle size={14} />}
      {label}
    </p>
  );
}

export default function Login() {
  const { user, login, setPassword: submitPassword } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  // Valeurs dérivées calculées pendant le rendu.
  const hasMinLength = password.length >= 8;
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const canSubmitPassword = hasMinLength && passwordsMatch;

  // Bascule manuelle vers l'écran « choisir mon mot de passe » .
  function goToSetPassword() {
    setError(null);
    setPassword('');
    setConfirmPassword('');
    setStep('set-password');
  }

  function backToLogin() {
    setError(null);
    setPassword('');
    setConfirmPassword('');
    setStep('login');
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await login(email, password);
      if (result.mustSetPassword) {
        setPassword('');
        setStep('set-password');
        return;
      }
      navigate('/', { replace: true });
    } catch {
      setError('Email ou mot de passe incorrect.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSetPassword(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setSubmitting(true);
    try {
      await submitPassword(email, password);
      navigate('/', { replace: true });
    } catch {
      setError('Impossible de définir le mot de passe. Vérifiez votre email.');
    } finally {
      setSubmitting(false);
    }
  }

  const emailInputClass =
    'w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 text-slate-800 placeholder:text-slate-400 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30';

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl md:grid-cols-2">
        {/* Panneau gauche */}
        <div
          className="hidden flex-col items-center justify-center bg-primary bg-cover bg-center p-10 text-center md:flex"
          style={{ backgroundImage: "linear-gradient(rgba(15,23,42,0.85), rgba(15,23,42,0.85)), url('/office.jpg')", }}
        >
          <Landmark size={72} strokeWidth={1.5} className="text-white" />
          <h2 className="mt-6 font-display text-3xl font-extrabold text-white">{BRAND_NAME}</h2>
          <p className="mt-3 max-w-xs text-sm text-slate-300">
            Centralisez, suivez et validez vos notes de frais en toute simplicité.

          </p>
        </div>

        {/*Panneau droit : formulaire */}
        <div className="p-8 sm:p-10">
          {/* Marque compacte, visible uniquement sur mobile */}
          <div className="mb-6 flex items-center gap-2 md:hidden">
            <Landmark size={28} className="text-primary" />
            <span className="font-display text-lg font-extrabold text-primary">{BRAND_NAME}</span>
          </div>

          <h1 className="font-display text-2xl font-bold text-primary">
            {step === 'login' ? 'Connexion' : 'Première connexion'}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {step === 'login'
              ? 'Veuillez saisir vos identifiants pour accéder à votre espace.'
              : 'Choisissez le mot de passe qui protégera votre compte.'}
          </p>

          {error && (
            <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          {step === 'login' ? (
            <>
              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                    Email professionnel
                  </label>
                  <div className="relative mt-1">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="prenom.nom@entreprise.com"
                      className={emailInputClass}
                    />
                  </div>
                </div>

                <PasswordInput
                  id="password"
                  label="Mot de passe"
                  value={password}
                  onChange={setPassword}
                  autoComplete="current-password"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-primary px-4 py-2.5 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Connexion…' : 'Se connecter'}
                </button>
              </form>

              <div className="mt-6 border-t border-slate-100 pt-4 text-center text-sm text-muted">
                Première connexion ?{' '}
                <button
                  type="button"
                  onClick={goToSetPassword}
                  className="font-semibold text-secondary hover:underline"
                >
                  Définissez votre mot de passe
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSetPassword} className="mt-6 space-y-4">
              <div>
                <label htmlFor="sp-email" className="block text-sm font-medium text-slate-700">
                  Email professionnel
                </label>
                <div className="relative mt-1">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="sp-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="prenom.nom@entreprise.com"
                    className={emailInputClass}
                  />
                </div>
              </div>

              <PasswordInput
                id="new-password"
                label="Nouveau mot de passe"
                value={password}
                onChange={setPassword}
                autoComplete="new-password"
                hint={<Requirement met={hasMinLength} label="Au moins 8 caractères" />}
              />

              <PasswordInput
                id="confirm-password"
                label="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={setConfirmPassword}
                autoComplete="new-password"
                hint={
                  confirmPassword.length > 0 ? (
                    <Requirement met={passwordsMatch} label="Les mots de passe correspondent" />
                  ) : undefined
                }
              />

              <button
                type="submit"
                disabled={submitting || !canSubmitPassword}
                className="w-full rounded-lg bg-primary px-4 py-2.5 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Validation…' : 'Définir mon mot de passe'}
              </button>

              <button
                type="button"
                onClick={backToLogin}
                className="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-muted transition hover:text-primary"
              >
                <ArrowLeft size={16} />
                Retour à la connexion
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}