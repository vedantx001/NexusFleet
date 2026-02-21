import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Loader from '../../../components/common/Loader';
import useAuth from '../hooks/useAuth';
import AuthCard from '../components/AuthCard';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.friendlyMessage || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-full px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <AuthCard
          title="Welcome back"
          subtitle="Sign in to continue"
          footer={
            <span>
              New here?{' '}
              <Link className="font-semibold text-indigo-300 hover:text-indigo-200" to="/register">
                Create an account
              </Link>
            </span>
          }
        >
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="text-sm font-medium text-slate-200" htmlFor="email">Email</label>
              <input
                id="email"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/30 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 mt-1"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-200" htmlFor="password">Password</label>
              <input
                id="password"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/30 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 mt-1"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <ErrorMessage message={error} />

            <button className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition bg-indigo-500 text-white hover:bg-indigo-400 active:bg-indigo-500/90 w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader label="Signing in" /> : 'Sign in'}
            </button>
          </form>
        </AuthCard>
      </div>
    </div>
  );
}
