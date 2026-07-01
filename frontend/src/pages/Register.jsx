import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    const res = await register(name, email, password);
    setLoading(false);
    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 animate-fadeIn">
      {/* Left panel - Decorative Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-indigo-850 to-indigo-650 p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white bg-opacity-10 rounded-full translate-x-20 -translate-y-20 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white bg-opacity-5 rounded-full -translate-x-20 translate-y-20 blur-2xl" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="p-2.5 bg-white bg-opacity-20 backdrop-blur-md rounded-xl">
            <Wallet size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">CentWise</span>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold leading-tight mb-4">
            Simplify your budget. <br />
            Optimize your assets.
          </h2>
          <p className="text-indigo-100 max-w-md font-medium text-base">
            Create an account in less than a minute to launch your dynamic expense tracker. Take complete control of your financial journey.
          </p>
        </div>

        <div className="text-xs text-indigo-200 relative z-10">
          &copy; {new Date().getFullYear()} CentWise. Built with the MERN stack.
        </div>
      </div>

      {/* Right panel - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Get started for free and organize your cashflow ledger.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="block w-full pl-10 pr-4 py-2 border.5 border-gray-300 dark:border-gray-600 rounded-xl bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-250"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="block w-full pl-10 pr-4 py-2 border.5 border-gray-300 dark:border-gray-600 rounded-xl bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-250"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2 border.5 border-gray-300 dark:border-gray-600 rounded-xl bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-250"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-2 border.5 border-gray-300 dark:border-gray-600 rounded-xl bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-250"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-all duration-200 transform hover:-translate-y-0.5 mt-2"
            >
              {loading ? (
                <span>Building account...</span>
              ) : (
                <>
                  <span>Sign Up</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Login Redirect */}
          <div className="text-center lg:text-left mt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
