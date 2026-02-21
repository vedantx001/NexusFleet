import React, { useState } from 'react';
import { ArrowRight, Mail, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Checkbox from '../components/forms/Checkbox';
import FormButton from '../components/forms/FormButton';
import InputField from '../components/forms/InputField';
import PasswordField from '../components/forms/PasswordField';
import SelectDropdown from '../components/forms/SelectDropdown';
import { ROLES } from '../constants/roles';
import useAuth from '../hooks/useAuth';
import useThemeMode from '../hooks/useThemeMode';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark, toggleTheme } = useThemeMode();
  const [formData, setFormData] = useState({ email: '', password: '', role: '', rememberMe: false });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!formData.email) nextErrors.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) nextErrors.email = 'Please enter a valid email';
    if (!formData.password) nextErrors.password = 'Password is required';
    if (!formData.role) nextErrors.role = 'Please select your role';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await login({ email: formData.email, password: formData.password });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setErrors((prev) => ({ ...prev, form: error?.friendlyMessage || 'Unable to sign in' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="NexusFleet Command Access"
      subtitle="Sign in to your operational dashboard."
      isDark={isDark}
      toggleTheme={toggleTheme}
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {errors.form ? <p className="text-sm text-[var(--danger)]">{errors.form}</p> : null}
        <InputField
          label="Work Email Address"
          id="email"
          type="email"
          placeholder="officer@company.com"
          icon={Mail}
          value={formData.email}
          onChange={(event) => setFormData({ ...formData, email: event.target.value })}
          error={errors.email}
          required
        />

        <PasswordField
          label="Password"
          id="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(event) => setFormData({ ...formData, password: event.target.value })}
          error={errors.password}
          required
        />

        <SelectDropdown
          label="System Role"
          id="role"
          icon={ShieldCheck}
          placeholder="Select operational role"
          options={ROLES}
          value={formData.role}
          onChange={(event) => setFormData({ ...formData, role: event.target.value })}
          error={errors.role}
          required
        />

        <div className="flex items-center justify-between pt-2">
          <Checkbox
            id="rememberMe"
            label="Remember me for 30 days"
            checked={formData.rememberMe}
            onChange={(event) => setFormData({ ...formData, rememberMe: event.target.checked })}
          />
          <button type="button" className="text-sm font-medium text-[var(--info)] hover:text-[var(--brand-accent)] transition-colors">
            Forgot Password?
          </button>
        </div>

        <div className="pt-2">
          <FormButton type="submit" isLoading={isLoading} className="py-3">
            Access Dashboard <ArrowRight size={18} />
          </FormButton>
        </div>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-6 transition-colors">
          New to the fleet?{' '}
          <Link to="/register" className="font-semibold text-[var(--info)] hover:text-[var(--brand-accent)] transition-colors">
            Request Account Registration
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
