import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import { api } from '../lib/api';

export function Signup({ onLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...signupData } = formData;
      const user = await api.signup(signupData);
      onLogin(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Get Started</h1>
          <p className="text-slate-600">Create your account to start managing your clipboard</p>
        </div>

        {/* Signup Card */}
        <Card className="border-slate-300 shadow-lg">
          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <div className="bg-red-50 border border-red-300 rounded-lg p-4 flex items-start gap-3 animate-slide-in">
                  <span className="text-red-600 text-xl">⚠</span>
                  <p className="text-sm font-medium text-red-700">{error}</p>
                </div>
              )}

              {/* Name Input */}
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                disabled={loading}
              />

              {/* Email Input */}
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                disabled={loading}
              />

              {/* Password Input */}
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={loading}
                helperText="At least 6 characters"
              />

              {/* Confirm Password Input */}
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={loading}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full mt-6 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Creating account...
                  </>
                ) : (
                  <>
                    Sign Up
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Text */}
        <p className="text-center text-xs text-slate-500 mt-6">
          We respect your privacy. Your data is encrypted and secure.
        </p>
      </div>
    </div>
  );
}
