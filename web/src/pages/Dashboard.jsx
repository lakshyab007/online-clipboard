import { useState, useEffect } from 'react';
import { Trash2, Edit2, Share2, X, Save, Copy } from 'lucide-react';
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
      setSuccess('Item created successfully!');
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
      setSuccess('Item updated successfully!');
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
      setSuccess('Item deleted successfully!');
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
    setSuccess('Copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const copyShareCode = (code) => {
    navigator.clipboard.writeText(code);
    setSuccess('Share code copied!');
    setTimeout(() => setSuccess(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Manage your clipboard items, {user?.name}
          </p>
        </div>

        {/* Notifications */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Create New Item */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Clipboard Item</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Enter your text here..."
                rows="4"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button type="submit" disabled={!newContent.trim()}>
                Save Item
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Clipboard Items List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Clipboard Items ({items.length})
          </h2>

          {loading ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500">Loading your items...</p>
              </CardContent>
            </Card>
          ) : items.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500">
                  No clipboard items yet. Create one above to get started!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    {editingItem === item.id ? (
                      /* Edit Mode */
                      <div className="space-y-4">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows="4"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdate(item.id)}
                            className="flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </Button>
                          <Button
                            size="sm"
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
                        <div className="mb-4">
                          <p className="whitespace-pre-wrap text-gray-900 bg-gray-50 p-4 rounded-md border border-gray-200">
                            {item.content}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            <p>
                              Created: {new Date(item.created_at).toLocaleString()}
                            </p>
                            {item.updated_at !== item.created_at && (
                              <p>
                                Updated: {new Date(item.updated_at).toLocaleString()}
                              </p>
                            )}
                            {item.is_shared && item.share_code && (
                              <div className="mt-2 flex items-center gap-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Shared
                                </span>
                                <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                                  {item.share_code}
                                </code>
                                <button
                                  onClick={() => copyShareCode(item.share_code)}
                                  className="text-blue-600 hover:text-blue-700"
                                  title="Copy share code"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(item.content)}
                              className="flex items-center gap-2"
                              title="Copy content"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEdit(item)}
                              className="flex items-center gap-2"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            {item.is_shared ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleUnshare(item.id)}
                                className="flex items-center gap-2 text-orange-600"
                                title="Remove share"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleShare(item.id)}
                                className="flex items-center gap-2 text-green-600"
                                title="Share"
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(item.id)}
                              className="flex items-center gap-2 text-red-600"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
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
