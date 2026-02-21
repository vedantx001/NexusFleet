import React, { useMemo, useState } from 'react';
import { Briefcase, Hash, Mail, Phone, ShieldCheck, User } from 'lucide-react';
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

function getPasswordStrength(password) {
  let score = 0;
  if (!password) return { score: 0, label: 'None', color: 'bg-[var(--border)]' };
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  switch (score) {
    case 1:
      return { score, label: 'Weak', color: 'bg-[var(--danger)]' };
    case 2:
      return { score, label: 'Fair', color: 'bg-[var(--warning)]' };
    case 3:
      return { score, label: 'Good', color: 'bg-[var(--info)]' };
    case 4:
      return { score, label: 'Strong', color: 'bg-[var(--success)]' };
    default:
      return { score: 0, label: 'Too Short', color: 'bg-[var(--danger)]' };
  }
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { isDark, toggleTheme } = useThemeMode();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '',
    department: '',
    employeeId: '',
    agreement: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const strength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);

  const validate = () => {
    const nextErrors = {};
    if (!formData.fullName) nextErrors.fullName = 'Full name is required';
    if (!formData.email) nextErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) nextErrors.email = 'Invalid email format';

    if (!formData.password) nextErrors.password = 'Password is required';
    else if (strength.score < 2) nextErrors.password = 'Password is too weak';

    if (!formData.confirmPassword) nextErrors.confirmPassword = 'Confirm your password';
    else if (formData.password !== formData.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match';

    if (!formData.role) nextErrors.role = 'Role selection is required';
    if (!formData.agreement) nextErrors.agreement = 'You must agree to operational policies';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const isFormValid =
    formData.fullName &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword &&
    formData.role &&
    formData.agreement;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await signup({ name: formData.fullName, email: formData.email, password: formData.password });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setErrors((prev) => ({ ...prev, form: error?.friendlyMessage || 'Unable to create account' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Register Personnel"
      subtitle="Create a new NexusFleet operations account."
      isDark={isDark}
      toggleTheme={toggleTheme}
    >
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {errors.form ? <p className="text-sm text-[var(--danger)]">{errors.form}</p> : null}

        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] border-b border-[var(--border)] pb-2 transition-colors">
            Personal Information
          </h3>
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Full Name"
              id="fullName"
              placeholder="Jane Doe"
              icon={User}
              value={formData.fullName}
              onChange={(event) => setFormData({ ...formData, fullName: event.target.value })}
              error={errors.fullName}
              required
              className="md:col-span-2"
            />
            <InputField
              label="Work Email"
              id="signup-email"
              type="email"
              placeholder="jane@company.com"
              icon={Mail}
              value={formData.email}
              onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              error={errors.email}
              required
            />
            <InputField
              label="Phone Number"
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              icon={Phone}
              value={formData.phone}
              onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] border-b border-[var(--border)] pb-2 transition-colors">
            Account Security
          </h3>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <PasswordField
                label="Create Password"
                id="signup-password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                error={errors.password}
                required
              />
              {formData.password ? (
                <div className="mt-1 flex flex-col gap-1">
                  <div className="flex h-1.5 w-full gap-1 overflow-hidden rounded-full bg-[var(--border)]">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-full w-1/4 transition-all duration-300 ${level <= strength.score ? strength.color : 'bg-transparent'}`}
                      />
                    ))}
                  </div>
                  <p className={`text-[10px] font-medium text-right ${strength.score < 2 ? 'text-[var(--danger)]' : 'text-[var(--text-secondary)]'}`}>
                    {strength.label}
                  </p>
                </div>
              ) : null}
            </div>

            <PasswordField
              label="Confirm Password"
              id="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value })}
              error={errors.confirmPassword}
              required
            />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] border-b border-[var(--border)] pb-2 transition-colors">
            Professional Details
          </h3>
          <div className="grid gap-5 md:grid-cols-2">
            <SelectDropdown
              label="System Role"
              id="signup-role"
              icon={ShieldCheck}
              placeholder="Assign Role"
              options={ROLES}
              value={formData.role}
              onChange={(event) => setFormData({ ...formData, role: event.target.value })}
              error={errors.role}
              required
              className="md:col-span-2"
            />
            <InputField
              label="Department (Optional)"
              id="department"
              placeholder="Logistics"
              icon={Briefcase}
              value={formData.department}
              onChange={(event) => setFormData({ ...formData, department: event.target.value })}
            />
            <InputField
              label="Employee ID (Optional)"
              id="employeeId"
              placeholder="EMP-1024"
              icon={Hash}
              value={formData.employeeId}
              onChange={(event) => setFormData({ ...formData, employeeId: event.target.value })}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--border)] transition-colors">
          <Checkbox
            id="agreement"
            label="I agree to NexusFleet operational policies and terms of service."
            checked={formData.agreement}
            onChange={(event) => setFormData({ ...formData, agreement: event.target.checked })}
            error={errors.agreement}
          />
        </div>

        <div className="pt-2">
          <FormButton type="submit" isLoading={isLoading} disabled={!isFormValid} className="py-3">
            Create Account
          </FormButton>
        </div>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-4 transition-colors">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[var(--info)] hover:text-[var(--brand-accent)] transition-colors">
            Return to Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
