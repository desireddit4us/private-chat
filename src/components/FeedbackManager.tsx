import React, { useState } from 'react';
import { Star, MessageSquare, ExternalLink, Check, X } from 'lucide-react';
import { Feedback, User } from '../types';

interface FeedbackManagerProps {
  feedback: Feedback[];
  users: User[];
  onAddFeedback: (feedback: Omit<Feedback, 'id' | 'submittedAt'>) => void;
  onVerifyFeedback: (id: string) => void;
  onDeleteFeedback: (id: string) => void;
}

const FeedbackManager: React.FC<FeedbackManagerProps> = ({
  feedback,
  users,
  onAddFeedback,
  onVerifyFeedback,
  onDeleteFeedback
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    userId: '',
    phrase: '',
    content: '',
    rating: 5,
    isVerified: false,
    redditPostUrl: ''
  });

  const handleAddFeedback = () => {
    if (!newFeedback.userId || !newFeedback.phrase.trim() || !newFeedback.content.trim()) return;
    
    onAddFeedback(newFeedback);
    setNewFeedback({
      userId: '',
      phrase: '',
      content: '',
      rating: 5,
      isVerified: false,
      redditPostUrl: ''
    });
    setShowAddModal(false);
  };

  const generatePhrase = () => {
    const words = ['stellar', 'amazing', 'premium', 'exclusive', 'verified', 'authentic', 'quality', 'professional'];
    const numbers = Math.floor(Math.random() * 9999) + 1000;
    const word = words[Math.floor(Math.random() * words.length)];
    return `${word}-${numbers}`;
  };

  const verifiedUsers = users.filter(user => user.status === 'verified');

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Feedback & Reviews</h2>
          <p className="text-gray-400">Manage user feedback and verification phrases</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Add Feedback</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {feedback.map((item) => {
          const user = users.find(u => u.id === item.userId);
          
          return (
            <div key={item.id} className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-white font-medium">u/{user?.redditUsername}</span>
                    {item.isVerified && (
                      <div className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                        Verified
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                        }`}
                      />
                    ))}
                    <span className="text-gray-400 text-sm ml-2">({item.rating}/5)</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{item.content}</p>
                  <div className="bg-gray-900 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Verification Phrase:</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(item.phrase)}
                        className="text-orange-400 hover:text-orange-300 text-xs"
                      >
                        Copy
                      </button>
                    </div>
                    <code className="text-orange-400 font-mono text-sm">{item.phrase}</code>
                  </div>
                  {item.redditPostUrl && (
                    <a
                      href={item.redditPostUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>View Reddit Post</span>
                    </a>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {!item.isVerified && (
                    <button
                      onClick={() => onVerifyFeedback(item.id)}
                      className="p-2 text-green-400 hover:text-green-300 transition-colors"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteFeedback(item.id)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Submitted: {item.submittedAt}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Feedback Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Add User Feedback</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">User</label>
                <select
                  value={newFeedback.userId}
                  onChange={(e) => setNewFeedback({ ...newFeedback, userId: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select a user</option>
                  {verifiedUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      u/{user.redditUsername}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Verification Phrase</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newFeedback.phrase}
                    onChange={(e) => setNewFeedback({ ...newFeedback, phrase: e.target.value })}
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                  />
                  <button
                    onClick={() => setNewFeedback({ ...newFeedback, phrase: generatePhrase() })}
                    className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  >
                    Generate
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                <select
                  value={newFeedback.rating}
                  onChange={(e) => setNewFeedback({ ...newFeedback, rating: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} Star{rating !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Feedback Content</label>
                <textarea
                  value={newFeedback.content}
                  onChange={(e) => setNewFeedback({ ...newFeedback, content: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={4}
                  placeholder="Enter the user's feedback..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Reddit Post URL (Optional)</label>
                <input
                  type="url"
                  value={newFeedback.redditPostUrl}
                  onChange={(e) => setNewFeedback({ ...newFeedback, redditPostUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="https://reddit.com/r/..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddFeedback}
                className="flex-1 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Add Feedback
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

export default FeedbackManager;