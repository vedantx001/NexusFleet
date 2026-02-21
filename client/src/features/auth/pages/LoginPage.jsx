import React, { useState } from 'react';
import { ArrowRight, Mail, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthLayout from '../components/AuthLayout';
import Checkbox from '../components/forms/Checkbox';
import FormButton from '../components/forms/FormButton';
import InputField from '../components/forms/InputField';
import PasswordField from '../components/forms/PasswordField';
import SelectDropdown from '../components/forms/SelectDropdown';
import { ROLES } from '../constants/roles';
import useAuth from '../hooks/useAuth';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '', role: '', rememberMe: false });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!formData.email) nextErrors.email = 'Email address is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) nextErrors.email = 'Please enter a valid email';
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
      setErrors((prev) => ({ ...prev, form: error?.friendlyMessage || 'Unable to sign in. Please verify your credentials.' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to access your fleet dashboard."
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

        <motion.div variants={itemVariants}>
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
        </motion.div>

        <motion.div variants={itemVariants}>
          <PasswordField
            label="Password"
            id="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(event) => setFormData({ ...formData, password: event.target.value })}
            error={errors.password}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <SelectDropdown
            label="System Role"
            id="role"
            icon={ShieldCheck}
            placeholder="Select operational role"
            options={ROLES}
            value={formData.role}
            onChange={(event) => setFormData({ ...formData, role: event.target.value })}
            variant="auth"
            error={errors.role}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center justify-between pt-1">
          <Checkbox
            id="rememberMe"
            label="Remember me for 30 days"
            checked={formData.rememberMe}
            onChange={(event) => setFormData({ ...formData, rememberMe: event.target.checked })}
          />
          <button type="button" className="text-sm font-semibold text-(--brand-accent) hover:text-sky-300 transition-colors">
            Forgot Password?
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-4">
          <FormButton type="submit" isLoading={isLoading}>
            Access Dashboard <ArrowRight size={18} />
          </FormButton>
        </motion.div>

        <motion.div variants={itemVariants} className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-[#111827] text-gray-400 font-medium">OR</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center">
          <p className="text-sm text-gray-400">
            New to the fleet?{' '}
            <Link to="/register" className="font-semibold text-(--brand-accent) hover:text-sky-300 transition-colors">
              Request Account Registration
            </Link>
          </p>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
}
