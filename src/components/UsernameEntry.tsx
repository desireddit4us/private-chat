import React, { useState } from 'react';
import { User, Shield, AlertCircle, MessageCircle } from 'lucide-react';

interface UsernameEntryProps {
  onUsernameSubmit: (username: string) => void;
}

const UsernameEntry: React.FC<UsernameEntryProps> = ({ onUsernameSubmit }) => {
  const [username, setUsername] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter your Reddit username');
      return;
    }

    // Remove u/ prefix if user added it
    const cleanUsername = username.replace(/^u\//, '');
    
    if (cleanUsername.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    setIsVerifying(true);
    setError('');

    // Simulate Reddit API verification (in real app, verify with Reddit API)
    setTimeout(() => {
      // Check if username is already in use (simulate database check)
      const existingUsers = JSON.parse(localStorage.getItem('activeUsers') || '[]');
      if (existingUsers.includes(cleanUsername)) {
        setError('This username is already in an active chat session');
        setIsVerifying(false);
        return;
      }

      // Add to active users
      existingUsers.push(cleanUsername);
      localStorage.setItem('activeUsers', JSON.stringify(existingUsers));
      
      onUsernameSubmit(cleanUsername);
      setIsVerifying(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-orange-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Private Platform Access</h1>
          <p className="text-gray-400">Enter your Reddit username to request access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reddit Username
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                u/
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="your_reddit_username"
                className="w-full pl-8 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={isVerifying}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-400 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-blue-900 border border-blue-700 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Shield className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-200">
                <p className="font-medium mb-1">Access Request Process</p>
                <p>Your request will be reviewed by the admin. If approved, you'll receive a unique verification ID to confirm via Reddit.</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <MessageCircle className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300">
                <p className="font-medium mb-1">Verification Steps</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Submit your Reddit username</li>
                  <li>Wait for admin approval</li>
                  <li>Receive unique verification ID</li>
                  <li>Send ID to u/desireddit4us on Reddit</li>
                  <li>Get verified and access exclusive content</li>
                </ol>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isVerifying || !username.trim()}
            className="w-full py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? 'Submitting Request...' : 'Request Access'}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-6">
          Only verified users can access private content. Your Reddit username is used for verification purposes only.
        </p>
      </div>
    </div>
  );
};

export default UsernameEntry;