import React, { useMemo, useState } from 'react';
import { Briefcase, Hash, Mail, Phone, ShieldCheck, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '../components/AuthLayout';
import Checkbox from '../components/forms/Checkbox';
import FormButton from '../components/forms/FormButton';
import InputField from '../components/forms/InputField';
import PasswordField from '../components/forms/PasswordField';
import SelectDropdown from '../components/forms/SelectDropdown';
import { ROLES } from '../constants/roles';
import useAuth from '../hooks/useAuth';

function getPasswordStrength(password) {
  let score = 0;
  if (!password) return { score: 0, label: 'None', color: 'bg-white/10' };
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  switch (score) {
    case 1:
      return { score, label: 'Weak', color: 'bg-(--danger)' };
    case 2:
      return { score, label: 'Fair', color: 'bg-(--warning)' };
    case 3:
      return { score, label: 'Good', color: 'bg-sky-400' };
    case 4:
      return { score, label: 'Strong', color: 'bg-(--success)' };
    default:
      return { score: 0, label: 'Too Short', color: 'bg-(--danger)' };
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

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
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) nextErrors.email = 'Invalid email format';

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
      await signup({ name: formData.fullName, email: formData.email, password: formData.password, role: formData.role });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setErrors((prev) => ({ ...prev, form: error?.friendlyMessage || 'Unable to create account. Please try again.' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Start managing your fleet today."
    >
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
        noValidate
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {errors.form ? (
          <motion.div variants={itemVariants} className="p-3 rounded-lg bg-(--danger)/10 border border-(--danger)/30">
            <p className="text-sm text-(--danger) font-medium text-center">{errors.form}</p>
          </motion.div>
        ) : null}

        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center gap-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-(--brand-accent)">
              Personal Info
            </h3>
            <div className="flex-1 h-px bg-white/10" />
          </div>
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
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4 pt-2">
          <div className="flex items-center gap-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-(--brand-accent)">
              Security
            </h3>
            <div className="flex-1 h-px bg-white/10" />
          </div>
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
              <AnimatePresence>
                {formData.password && !errors.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 flex flex-col gap-1.5"
                  >
                    <div className="flex h-1.5 w-full gap-1 overflow-hidden rounded-full bg-white/5">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-full w-1/4 transition-colors duration-500 rounded-full ${level <= strength.score ? strength.color : 'bg-transparent'}`}
                        />
                      ))}
                    </div>
                    <p className={`text-[10px] font-bold tracking-wide uppercase text-right transition-colors duration-500 ${strength.score < 2 ? 'text-(--danger)' : 'text-(--brand-accent)'}`}>
                      {strength.label}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
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
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4 pt-2">
          <div className="flex items-center gap-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-(--brand-accent)">
              Role Details
            </h3>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <SelectDropdown
              label="System Role"
              id="signup-role"
              icon={ShieldCheck}
              placeholder="Assign Role"
              options={ROLES}
              value={formData.role}
              onChange={(event) => setFormData({ ...formData, role: event.target.value })}
              variant="auth"
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
        </motion.div>

        <motion.div variants={itemVariants} className="pt-4 border-t border-white/10 mt-6">
          <Checkbox
            id="agreement"
            label="I agree to NexusFleet operational policies and terms of service."
            checked={formData.agreement}
            onChange={(event) => setFormData({ ...formData, agreement: event.target.checked })}
            error={errors.agreement}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="pt-4">
          <FormButton type="submit" isLoading={isLoading} disabled={!isFormValid}>
            Create Account
          </FormButton>
        </motion.div>

        <motion.div variants={itemVariants} className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-[#111827] text-gray-400 font-medium">OR</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-(--brand-accent) hover:text-sky-300 transition-colors">
              Return to Login
            </Link>
          </p>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
}
