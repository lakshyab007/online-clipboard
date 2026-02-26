import { useState, useEffect } from 'react';
import { Trash2, Edit2, Share2, X, Save, Copy, Plus, Clock, Code2 } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { api } from '../lib/api';

export function Dashboard({ user }) {
  const [items, setItems] = useState([]);
  const [newContent, setNewContent] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadClipboardItems();
  }, []);

  const loadClipboardItems = async () => {
    try {
      setLoading(true);
      const data = await api.getClipboardItems();
      setItems(data);
    } catch (err) {
      setError('Failed to load clipboard items');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    try {
      const item = await api.createClipboardItem(newContent);
      setItems([item, ...items]);
      setNewContent('');
      setSuccess('Clipboard item created! 🎉');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create item');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleUpdate = async (itemId) => {
    if (!editContent.trim()) return;

    try {
      const updatedItem = await api.updateClipboardItem(itemId, editContent);
      setItems(items.map((item) => (item.id === itemId ? updatedItem : item)));
      setEditingItem(null);
      setEditContent('');
      setSuccess('Item updated successfully! ✓');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update item');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await api.deleteClipboardItem(itemId);
      setItems(items.filter((item) => item.id !== itemId));
      setSuccess('Item deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete item');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleShare = async (itemId) => {
    try {
      const response = await api.shareClipboardItem(itemId);
      setItems(
        items.map((item) =>
          item.id === itemId
            ? { ...item, share_code: response.share_code, is_shared: true }
            : item
        )
      );
      setSuccess(`Share code generated: ${response.share_code}`);
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError('Failed to generate share code');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleUnshare = async (itemId) => {
    try {
      await api.unshareClipboardItem(itemId);
      setItems(
        items.map((item) =>
          item.id === itemId
            ? { ...item, share_code: null, is_shared: false }
            : item
        )
      );
      setSuccess('Share code removed');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to remove share code');
      setTimeout(() => setError(''), 3000);
    }
  };

  const startEdit = (item) => {
    setEditingItem(item.id);
    setEditContent(item.content);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditContent('');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard! ✓');
    setTimeout(() => setSuccess(''), 2000);
  };

  const copyShareCode = (code) => {
    navigator.clipboard.writeText(code);
    setSuccess('Share code copied! ✓');
    setTimeout(() => setSuccess(''), 2000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      <div className="section-container py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Your Clipboard</h1>
          <p className="text-lg text-slate-600">
            Manage, organize, and share your text snippets with ease
          </p>
        </div>

        {/* Alerts */}
        {success && (
          <div className="mb-6 bg-emerald-50 border border-emerald-300 rounded-lg p-4 flex items-start gap-3 animate-slide-in">
            <span className="text-emerald-600 text-xl">✓</span>
            <p className="text-sm font-medium text-emerald-700">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-300 rounded-lg p-4 flex items-start gap-3 animate-slide-in">
            <span className="text-red-600 text-xl">⚠</span>
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        {/* Create New Item */}
        <Card className="mb-10 border-slate-300 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary-600" />
              </div>
              <CardTitle>Create New Clipboard Item</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-5">
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Paste or type your text here..."
                rows="5"
                className="block w-full px-4 py-3 border-2 border-slate-200 rounded-lg font-mono text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
              />
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  {newContent.length} characters
                </p>
                <Button
                  type="submit"
                  disabled={!newContent.trim()}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Save Item
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Items List */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Your Items ({items.length})
            </h2>
          </div>

          {loading ? (
            <Card className="border-slate-300">
              <CardContent className="text-center py-16">
                <div className="inline-flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-slate-600 mt-4">Loading your clipboard...</p>
              </CardContent>
            </Card>
          ) : items.length === 0 ? (
            <Card className="border-slate-300 bg-gradient-to-br from-blue-50 to-slate-50">
              <CardContent className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <Code2 className="w-10 h-10 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No clipboard items yet
                </h3>
                <p className="text-slate-600 mb-6">
                  Create your first item above to get started!
                </p>
                <p className="text-sm text-slate-500">
                  💡 Tip: You can save code, notes, links, and any text snippets
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="border-slate-300 overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    {editingItem === item.id ? (
                      /* Edit Mode */
                      <div className="p-6 space-y-4 bg-slate-50">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Edit Content
                          </label>
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows="6"
                            className="block w-full px-4 py-3 border-2 border-slate-200 rounded-lg font-mono text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleUpdate(item.id)}
                            variant="success"
                            className="flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            Save Changes
                          </Button>
                          <Button
                            variant="outline"
                            onClick={cancelEdit}
                            className="flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <div>
                        <div className="p-6 space-y-4">
                          {/* Content */}
                          <div>
                            <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4">
                              <p className="whitespace-pre-wrap text-slate-900 font-mono text-sm leading-relaxed overflow-x-auto">
                                {item.content}
                              </p>
                            </div>
                          </div>

                          {/* Metadata */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm pt-2">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2 text-slate-600">
                                <Clock className="w-4 h-4" />
                                <span>Created: {formatDate(item.created_at)}</span>
                              </div>
                              {item.updated_at !== item.created_at && (
                                <div className="flex items-center gap-2 text-slate-600">
                                  <Clock className="w-4 h-4" />
                                  <span>Updated: {formatDate(item.updated_at)}</span>
                                </div>
                              )}
                              {item.is_shared && item.share_code && (
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                    Shared
                                  </span>
                                  <code className="bg-slate-100 px-3 py-1 rounded-md text-xs font-mono text-slate-700 border border-slate-200">
                                    {item.share_code}
                                  </code>
                                  <button
                                    onClick={() => copyShareCode(item.share_code)}
                                    className="text-primary-600 hover:text-primary-700 transition-colors p-1 hover:bg-primary-50 rounded"
                                    title="Copy share code"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-1 sm:gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(item.content)}
                                title="Copy content"
                                className="flex items-center gap-1"
                              >
                                <Copy className="w-4 h-4" />
                                <span className="hidden sm:inline">Copy</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => startEdit(item)}
                                title="Edit"
                                className="flex items-center gap-1"
                              >
                                <Edit2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Edit</span>
                              </Button>
                              {item.is_shared ? (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleUnshare(item.id)}
                                  title="Remove share"
                                  className="flex items-center gap-1 text-orange-600 hover:text-orange-700"
                                >
                                  <X className="w-4 h-4" />
                                  <span className="hidden sm:inline">Unshare</span>
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleShare(item.id)}
                                  title="Share"
                                  className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700"
                                >
                                  <Share2 className="w-4 h-4" />
                                  <span className="hidden sm:inline">Share</span>
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(item.id)}
                                title="Delete"
                                className="flex items-center gap-1 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Delete</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
