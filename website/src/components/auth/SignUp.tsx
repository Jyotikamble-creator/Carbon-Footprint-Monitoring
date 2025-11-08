'use client';

import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Building } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { signupUser, setToken } from '@/lib/auth/authSlice';

export default function SignUpForm() {
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error } = useAppSelector((state) => state.auth);
  const isLoading = status === 'loading';

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Organization name validation
    if (!orgName) {
      newErrors.orgName = 'Organization name is required';
    } else if (orgName.length < 2) {
      newErrors.orgName = 'Organization name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(signupUser({
        org_name: orgName,
        email,
        password,
      })).unwrap();
      
      // On successful signup, set token and redirect to dashboard
      dispatch(setToken(result.access_token || null));
      router.push('/dashboard');
    } catch (err: unknown) {
      // Log detailed error to console for debugging
      const error = err as { message?: string; status?: number; name?: string; stack?: string; response?: unknown; request?: unknown };
      console.error('Signup failed - Full error details:', {
        error: error,
        message: error?.message,
        status: error?.status,
        name: error?.name,
        stack: error?.stack,
        response: error?.response,
        request: error?.request
      });
      
      // Check if this is a network error (backend not running)
      if (error?.message?.includes('Network Error') || 
          error?.message?.includes('ECONNREFUSED') ||
          error?.message?.includes('fetch') ||
          error?.name === 'ConnectionError' ||
          error?.status === 404) {
        console.error('🚨 BACKEND CONNECTION ERROR:');
        console.error('- Backend server is not running on port 5000');
        console.error('- Check if uvicorn is started in carbon-backend directory');
        console.error('- Verify NEXT_PUBLIC_API_URL in .env.local');
        
        setErrors({
          submit: '🚨 Backend Server Not Running - The Carbon Footprint API server is not accessible. Please start the backend server on port 5000 first.'
        });
      } else if (error?.status === 400 && error?.message?.includes('User already exists')) {
        // Handle user already exists error with helpful message
        setErrors({
          submit: '⚠️ Account Already Exists - An account with this email address already exists. Please use the Login page to sign in with your existing credentials, or use a different email address to create a new account.'
        });
      } else {
        console.error('🚨 SIGNUP ERROR:', error?.message || 'Unknown error');
        setErrors({
          submit: error?.message || 'Signup failed. Please try again.'
        });
      }
    }
  };

  return (
    <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          Create Your Account
        </h2>
        <p className="text-gray-400 text-sm">
          Get started by filling out the information below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Organization Name Field */}
        <div>
          <label htmlFor="orgName" className="block text-sm font-medium text-gray-300 mb-2">
            Organization Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className="h-5 w-5 text-gray-500" />
            </div>
            <input
              id="orgName"
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Your Company Name"
              className={`w-full pl-10 pr-4 py-3 bg-gray-700/30 border ${
                errors.orgName ? 'border-red-500' : 'border-gray-600'
              } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
            />
          </div>
          {errors.orgName && (
            <p className="mt-1 text-sm text-red-400">{errors.orgName}</p>
          )}
        </div>

        {/* Email Address Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-500" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.name@company.com"
              className={`w-full pl-10 pr-4 py-3 bg-gray-700/30 border ${
                errors.email ? 'border-red-500' : 'border-gray-600'
              } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-500" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a strong password"
              className={`w-full pl-10 pr-12 py-3 bg-gray-700/30 border ${
                errors.password ? 'border-red-500' : 'border-gray-600'
              } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-400 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-400">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-500" />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className={`w-full pl-10 pr-12 py-3 bg-gray-700/30 border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
              } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-400 transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Show any Redux auth errors */}
        {error && (
          <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Show form submission errors */}
        {errors.submit && (
          <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-sm text-red-400 whitespace-pre-line">{errors.submit}</p>
            {errors.submit.includes('Account Already Exists') && (
              <div className="mt-2">
                <Link
                  href="/auth/login"
                  className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors underline"
                >
                  → Go to Login Page
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>

        {/* Log In Link */}
        <div className="text-center mt-6">
          <span className="text-gray-400 text-sm">
            Already have an account?{' '}
          </span>
          <Link
            href="/auth/login"
            className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors font-medium"
          >
            Log In
          </Link>
        </div>
      </form>
    </div>
  );
}