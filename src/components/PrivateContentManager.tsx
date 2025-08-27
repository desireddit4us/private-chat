import React, { useState } from 'react';
import { Plus, Edit, Trash2, Users, Eye, Play, Pause } from 'lucide-react';
import { PrivateContent, User } from '../types';

interface PrivateContentManagerProps {
  content: PrivateContent[];
  users: User[];
  onAddContent: (content: Omit<PrivateContent, 'id' | 'uploadedAt' | 'viewCounts'>) => void;
  onEditContent: (id: string, updates: Partial<PrivateContent>) => void;
  onDeleteContent: (id: string) => void;
  onGrantAccess: (contentId: string, userId: string) => void;
  onRevokeAccess: (contentId: string, userId: string) => void;
}

const PrivateContentManager: React.FC<PrivateContentManagerProps> = ({
  content,
  users,
  onAddContent,
  onEditContent,
  onDeleteContent,
  onGrantAccess,
  onRevokeAccess
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContent, setEditingContent] = useState<PrivateContent | null>(null);
  const [managingAccess, setManagingAccess] = useState<string | null>(null);
  const [newContent, setNewContent] = useState({
    title: '',
    description: '',
    type: 'redgif' as 'redgif' | 'video' | 'image',
    url: ''
  });

  const handleAddContent = () => {
    if (!newContent.title.trim() || !newContent.url.trim()) return;
    
    onAddContent({
      ...newContent,
      accessGrantedUsers: []
    });
    
    setNewContent({ title: '', description: '', type: 'redgif', url: '' });
    setShowAddModal(false);
  };

  const verifiedUsers = users.filter(user => user.status === 'verified');

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Private Content</h2>
          <p className="text-gray-400">Manage your exclusive content and user access</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Content</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {content.map((item) => (
          <div key={item.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="capitalize">{item.type}</span>
                  <span>{item.uploadedAt}</span>
                  <span>{Object.keys(item.viewCounts).length} viewers</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingContent(item)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeleteContent(item.id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">Access Granted</span>
                <button
                  onClick={() => setManagingAccess(managingAccess === item.id ? null : item.id)}
                  className="flex items-center space-x-1 text-orange-400 hover:text-orange-300 transition-colors text-sm"
                >
                  <Users className="h-4 w-4" />
                  <span>Manage ({item.accessGrantedUsers.length})</span>
                </button>
              </div>
              
              {managingAccess === item.id && (
                <div className="bg-gray-900 rounded-lg p-3 space-y-2">
                  {verifiedUsers.map((user) => {
                    const hasAccess = item.accessGrantedUsers.includes(user.id);
                    const viewCount = item.viewCounts[user.id] || 0;
                    
                    return (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-white text-sm">u/{user.redditUsername}</span>
                          {viewCount > 0 && (
                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                              <Eye className="h-3 w-3" />
                              <span>{viewCount}</span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => hasAccess ? onRevokeAccess(item.id, user.id) : onGrantAccess(item.id, user.id)}
                          className={`px-3 py-1 rounded text-xs transition-colors ${
                            hasAccess 
                              ? 'bg-red-600 text-white hover:bg-red-700' 
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {hasAccess ? 'Revoke' : 'Grant'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {item.type === 'redgif' && (
              <div className="bg-gray-900 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">RedGIF Preview</span>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-white transition-colors">
                      <Play className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-white transition-colors">
                      <Pause className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Content Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Add New Content</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={newContent.title}
                  onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={newContent.description}
                  onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                <select
                  value={newContent.type}
                  onChange={(e) => setNewContent({ ...newContent, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="redgif">RedGIF</option>
                  <option value="video">Video</option>
                  <option value="image">Image</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">URL</label>
                <input
                  type="url"
                  value={newContent.url}
                  onChange={(e) => setNewContent({ ...newContent, url: e.target.value })}
                  placeholder={newContent.type === 'redgif' ? 'https://redgifs.com/watch/...' : 'https://...'}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddContent}
                className="flex-1 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Add Content
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivateContentManager;