import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Linkedin, ArrowRight, Search, Zap, Lock, Share2, PenTool, Copy } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import { api } from '../lib/api';

export function Home({ user }) {
  const [shareCode, setShareCode] = useState('');
  const [sharedContent, setSharedContent] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleValidateCode = async (e) => {
    e.preventDefault();
    setError('');
    setSharedContent(null);
    setLoading(true);

    try {
      const data = await api.validateShareCode(shareCode);
      setSharedContent(data);
    } catch (err) {
      setError(err.message || 'Invalid share code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-32">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="section-container relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Your Cloud Clipboard, Made <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">Simple</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Save, manage, and share your text snippets with ease. Fast, secure, and always accessible.
            </p>

            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="gap-2">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button size="lg" className="gap-2">
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="section-container space-y-16 pb-20">
        {/* User Profile Section */}
        {user && (
          <Card className="border-slate-300 shadow-lg overflow-hidden">
            <CardContent className="px-8 py-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Your Profile</h2>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <User className="w-7 h-7 text-white" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                {/* Name */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Full Name</p>
                    <p className="text-lg font-semibold text-slate-900">{user.name}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Email</p>
                    <p className="text-lg font-semibold text-slate-900">{user.email}</p>
                  </div>
                </div>

                {/* LinkedIn */}
                {user.linkedin && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-sky-100 flex items-center justify-center">
                      <Linkedin className="w-6 h-6 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 font-medium">LinkedIn</p>
                      <a
                        href={user.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        View Profile →
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-200">
                <Link to="/dashboard">
                  <Button size="lg" className="w-full gap-2 justify-center">
                    Manage Your Clipboard
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Access Shared Content Section */}
        <Card className="border-slate-300 shadow-lg">
          <CardContent className="px-8 py-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Share2 className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Access Shared Content</h2>
            </div>

            <p className="text-slate-600 mb-8 text-lg">
              Got a share code? Enter it below to view the shared content instantly.
            </p>

            <form onSubmit={handleValidateCode} className="space-y-6">
              <div className="flex gap-3">
                <Input
                  type="text"
                  value={shareCode}
                  onChange={(e) => setShareCode(e.target.value.toUpperCase())}
                  placeholder="Enter share code (e.g., ABC123XY)"
                  disabled={loading}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={loading || !shareCode}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <Search className="w-4 h-4" />
                  {loading ? 'Searching...' : 'View'}
                </Button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-300 rounded-lg p-4 flex items-start gap-3 animate-slide-in">
                  <span className="text-red-600 text-xl">⚠</span>
                  <p className="text-sm font-medium text-red-700">{error}</p>
                </div>
              )}

              {/* Shared Content Display */}
              {sharedContent && (
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 border border-emerald-300 rounded-xl p-6 space-y-4 animate-slide-in">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1 text-lg">
                        {sharedContent.owner_name} shared this with you
                      </h3>
                      <p className="text-sm text-slate-600">
                        Created: {new Date(sharedContent.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-2">
                      <Copy className="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-5 border border-slate-200">
                    <p className="whitespace-pre-wrap text-slate-900 font-mono text-sm leading-relaxed">
                      {sharedContent.content}
                    </p>
                  </div>

                  <Button
                    variant="success"
                    className="w-full gap-2 justify-center"
                    onClick={() => {
                      navigator.clipboard.writeText(sharedContent.content);
                      alert('Content copied to clipboard!');
                    }}
                  >
                    <Copy className="w-4 h-4" />
                    Copy to Clipboard
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Features Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Clipboard?</h2>
            <p className="text-lg text-slate-600">Everything you need to manage your text snippets efficiently</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-slate-300 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-primary-100 to-primary-50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <PenTool className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-3 text-lg">Save Your Text</h3>
                <p className="text-slate-600 leading-relaxed">
                  Easily save and manage all your text snippets, code, and notes in one organized place
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-slate-300 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Share2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-3 text-lg">Share with Anyone</h3>
                <p className="text-slate-600 leading-relaxed">
                  Generate unique codes to instantly share your content with colleagues and friends
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-slate-300 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-blue-100 to-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-3 text-lg">Secure & Private</h3>
                <p className="text-slate-600 leading-relaxed">
                  Your data is encrypted and protected. Only you control what gets shared and with whom
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        {!user && (
          <Card className="border-slate-300 bg-gradient-to-r from-primary-50 to-blue-50 shadow-lg">
            <CardContent className="px-8 py-12 text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to get started?</h2>
              <p className="text-slate-600 mb-8 text-lg">
                Join thousands of users who are already saving and sharing their clipboard content
              </p>
              <Link to="/signup">
                <Button size="lg" className="gap-2">
                  Create Your Account
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
