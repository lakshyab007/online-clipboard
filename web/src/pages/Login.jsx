import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { api } from '../lib/api';

export function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await api.login({ email, password });
      onLogin(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-600">Sign in to access your clipboard</p>
        </div>

        {/* Login Card */}
        <Card className="border-slate-300 shadow-lg">
          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Alert */}
              {error && (
                <div className="bg-red-50 border border-red-300 rounded-lg p-4 flex items-start gap-3 animate-slide-in">
                  <span className="text-red-600 text-xl">⚠</span>
                  <p className="text-sm font-medium text-red-700">{error}</p>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                  icon={<Mail className="w-4 h-4" />}
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full mt-6 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Text */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Your data is encrypted and secure
        </p>
      </div>
    </div>
  );
}
