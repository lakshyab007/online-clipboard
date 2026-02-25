import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Linkedin, ArrowRight, Search } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Clipboard
          </h1>
          <p className="text-lg text-gray-600">
            Your online clipboard for saving and sharing text snippets
          </p>
        </div>

        <div className="space-y-8">
          {/* Profile Section */}
          {user ? (
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">{user.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                  </div>

                  {user.linkedin && (
                    <div className="flex items-center gap-3">
                      <Linkedin className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">LinkedIn</p>
                        <a
                          href={user.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-700"
                        >
                          View Profile
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link to="/dashboard">
                    <Button className="w-full flex items-center justify-center gap-2">
                      Go to Dashboard
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Get Started
                </h2>
                <p className="text-gray-600 mb-6">
                  Sign up or log in to start saving your clipboard items
                </p>
                <div className="flex gap-4 justify-center">
                  <Link to="/signup">
                    <Button>Sign Up</Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline">Log In</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Share Code Section */}
          <Card>
            <CardHeader>
              <CardTitle>Access Shared Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Have a share code? Enter it below to view the shared content.
              </p>

              <form onSubmit={handleValidateCode} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={shareCode}
                    onChange={(e) => setShareCode(e.target.value.toUpperCase())}
                    placeholder="Enter share code (e.g., ABC123XY)"
                    className="flex-1"
                    disabled={loading}
                  />
                  <Button
                    type="submit"
                    disabled={loading || !shareCode}
                    className="flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    {loading ? 'Checking...' : 'View'}
                  </Button>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                {sharedContent && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Shared by {sharedContent.owner_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(sharedContent.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-md p-4 border border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">Content:</p>
                      <p className="whitespace-pre-wrap text-gray-900">
                        {sharedContent.content}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(sharedContent.content);
                        alert('Content copied to clipboard!');
                      }}
                    >
                      Copy to Clipboard
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Save Your Text
                  </h3>
                  <p className="text-sm text-gray-600">
                    Easily save and manage all your text snippets in one place
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔗</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Share with Others
                  </h3>
                  <p className="text-sm text-gray-600">
                    Generate unique codes to share your content with anyone
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Secure & Private
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your data is encrypted and only accessible to you
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
