import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  Settings, 
  Crown, 
  Image, 
  Shield, 
  LogOut,
  Users,
  UserCheck,
  MessageSquare,
  Star,
  Upload,
  Clock,
  Mic,
  Paperclip
} from 'lucide-react';
import UsernameEntry from './components/UsernameEntry';
import ChatRequestModal from './components/ChatRequestModal';
import TimedImageViewer from './components/TimedImageViewer';
import PrivateContentManager from './components/PrivateContentManager';
import FeedbackManager from './components/FeedbackManager';
import { User, ChatRequest, Message, PrivateContent, Feedback, AdminSettings } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentView, setCurrentView] = useState<'chat' | 'chat-requests' | 'verified-users' | 'active-chats' | 'users' | 'feedback' | 'private-content' | 'settings'>('chat');
  const [messageText, setMessageText] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  
  const adminUsername = 'desireddit4us'; // This is the admin username - enter this to login as admin
  
  // State management
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      redditUsername: 'testuser123',
      uniqueId: 'VERIFY-ABC123',
      status: 'verified',
      joinedAt: '2024-01-15',
      lastActive: '2 minutes ago',
      isOnline: true,
      messageCount: 25,
      hasAccess: true,
      accessGrantedContent: []
    }
  ]);

  const [chatRequests, setChatRequests] = useState<ChatRequest[]>([
    {
      id: '1',
      redditUsername: 'newuser456',
      requestedAt: '2024-01-20 10:30 AM',
      status: 'pending',
      message: 'Hi, I would like to access your private content. I\'m a genuine user.'
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: adminUsername,
      recipientId: '1',
      content: 'Welcome! You are now verified and have access to exclusive content.',
      timestamp: '10:30 AM',
      type: 'text'
    }
  ]);

  const [privateContent, setPrivateContent] = useState<PrivateContent[]>([
    {
      id: '1',
      title: 'Exclusive RedGIF Collection',
      description: 'Premium content for verified users only',
      type: 'redgif',
      url: 'https://redgifs.com/watch/example',
      uploadedAt: '2024-01-15',
      accessGrantedUsers: ['1'],
      viewCounts: { '1': 5 }
    }
  ]);

  const [feedback, setFeedback] = useState<Feedback[]>([
    {
      id: '1',
      userId: '1',
      phrase: 'stellar-4567',
      content: 'Amazing content and great communication. Highly recommended!',
      rating: 5,
      submittedAt: '2024-01-18',
      isVerified: true,
      redditPostUrl: 'https://reddit.com/r/example/comments/123'
    }
  ]);

  const [timedImageViewer, setTimedImageViewer] = useState<{
    isOpen: boolean;
    imageUrl: string;
    duration: number;
    messageId: string;
  }>({
    isOpen: false,
    imageUrl: '',
    duration: 0,
    messageId: ''
  });

  const [chatRequestModal, setChatRequestModal] = useState<{
    isOpen: boolean;
    request: ChatRequest | null;
  }>({
    isOpen: false,
    request: null
  });

  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    allowScreenshots: false,
    allowDownloads: false,
    allowScreenRecording: false,
    maxFileSize: 10,
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mp3', 'pdf'],
    customTabs: [
      { id: 'chat-requests', name: 'Chat Requests', visible: true, component: 'ChatRequests' },
      { id: 'verified-users', name: 'Verified Users', visible: true, component: 'VerifiedUsers' },
      { id: 'active-chats', name: 'Active Chats', visible: true, component: 'ActiveChats' },
      { id: 'users', name: 'Users', visible: true, component: 'Users' },
      { id: 'feedback', name: 'Feedback', visible: true, component: 'Feedback' },
      { id: 'private-content', name: 'Private Content', visible: true, component: 'PrivateContent' }
    ]
  });

  // Security measures
  useEffect(() => {
    if (!adminSettings.allowScreenshots) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.key === 'u') ||
          (e.ctrlKey && e.key === 's') ||
          e.key === 'PrintScreen'
        ) {
          e.preventDefault();
          return false;
        }
      };

      const handleContextMenu = (e: MouseEvent) => e.preventDefault();
      
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('contextmenu', handleContextMenu);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('contextmenu', handleContextMenu);
      };
    }
  }, [adminSettings.allowScreenshots]);

  const handleUsernameSubmit = (username: string) => {
    if (username === adminUsername) {
      setCurrentUser(username);
      setIsAdmin(true);
      return;
    }

    // Check if user already exists
    const existingUser = users.find(user => user.redditUsername === username);
    if (existingUser) {
      if (existingUser.status === 'verified') {
        setCurrentUser(existingUser.id);
        setSelectedUser(existingUser.id);
      } else {
        alert('Your chat request is still pending admin approval.');
        return;
      }
    } else {
      // Create new chat request
      const newRequest: ChatRequest = {
        id: Date.now().toString(),
        redditUsername: username,
        requestedAt: new Date().toLocaleString(),
        status: 'pending'
      };
      setChatRequests(prev => [...prev, newRequest]);
      alert('Chat request submitted! Please wait for admin approval.');
      return;
    }
  };

  const handleAcceptChatRequest = (requestId: string, uniqueId: string) => {
    const request = chatRequests.find(r => r.id === requestId);
    if (!request) return;

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      redditUsername: request.redditUsername,
      uniqueId,
      status: 'pending', // Will be verified after Reddit confirmation
      joinedAt: new Date().toISOString().split('T')[0],
      lastActive: 'Just now',
      isOnline: true,
      messageCount: 0,
      hasAccess: false,
      accessGrantedContent: []
    };

    setUsers(prev => [...prev, newUser]);
    setChatRequests(prev => prev.filter(r => r.id !== requestId));

    // Send verification message
    const verificationMessage: Message = {
      id: Date.now().toString(),
      senderId: adminUsername,
      recipientId: newUser.id,
      content: `Your chat request has been accepted! Please send this unique ID to u/${adminUsername} on Reddit for verification: ${uniqueId}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };

    setMessages(prev => [...prev, verificationMessage]);
  };

  const handleRejectChatRequest = (requestId: string) => {
    setChatRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || (!isAdmin && !selectedUser)) return;

    const recipientId = isAdmin ? selectedUser : users.find(u => u.redditUsername === currentUser)?.id || '';
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: isAdmin ? adminUsername : currentUser,
      recipientId,
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageText('');

    // Update user message count
    if (!isAdmin) {
      setUsers(prev => prev.map(user => 
        user.id === currentUser 
          ? { ...user, messageCount: user.messageCount + 1, lastActive: 'Just now' }
          : user
      ));
    }
  };

  const handleSendTimedImage = (imageUrl: string, duration: number) => {
    if (!selectedUser) return;

    const expiresAt = new Date(Date.now() + duration * 1000).toISOString();
    
    const imageMessage: Message = {
      id: Date.now().toString(),
      senderId: adminUsername,
      recipientId: selectedUser,
      content: `Timed image (${duration}s)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'timed_image',
      fileUrl: imageUrl,
      timerDuration: duration,
      expiresAt,
      isExpired: false
    };

    setMessages(prev => [...prev, imageMessage]);
  };

  const handleLogout = () => {
    setCurrentUser('');
    setIsAdmin(false);
    setCurrentView('chat');
    setSelectedUser('');
  };

  if (!currentUser) {
    return <UsernameEntry onUsernameSubmit={handleUsernameSubmit} />;
  }

  const currentUserData = users.find(user => user.id === currentUser);
  const activeChats = messages.reduce((acc, message) => {
    const otherUserId = message.senderId === adminUsername ? message.recipientId : message.senderId;
    if (!acc.includes(otherUserId) && otherUserId !== adminUsername) {
      acc.push(otherUserId);
    }
    return acc;
  }, [] as string[]);

  const renderChatView = () => {
    const chatMessages = isAdmin 
      ? messages.filter(m => m.senderId === selectedUser || m.recipientId === selectedUser)
      : messages.filter(m => m.senderId === currentUser || m.recipientId === currentUser);

    return (
      <div className="flex h-full">
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-800 bg-gray-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-600 rounded-full w-8 h-8 flex items-center justify-center">
                  <Crown className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-white">
                    {isAdmin 
                      ? (selectedUser ? `Chat with u/${users.find(u => u.id === selectedUser)?.redditUsername}` : 'Select a user to chat')
                      : `Chat with u/${adminUsername}`
                    }
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <p className="text-xs text-gray-400">Online</p>
                    {!isAdmin && currentUserData && (
                      <div className={`text-xs px-2 py-1 rounded ${
                        currentUserData.status === 'verified' ? 'bg-green-900 text-green-300' :
                        'bg-yellow-900 text-yellow-300'
                      }`}>
                        {currentUserData.status}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {(!isAdmin || selectedUser) && chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === currentUser || (isAdmin && message.senderId === adminUsername) ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderId === currentUser || (isAdmin && message.senderId === adminUsername)
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-800 text-white'
                  }`}
                >
                  {message.type === 'timed_image' ? (
                    <div>
                      <p className="text-sm mb-2">{message.content}</p>
                      {!message.isExpired ? (
                        <div
                          onClick={() => setTimedImageViewer({
                            isOpen: true,
                            imageUrl: message.fileUrl!,
                            duration: message.timerDuration!,
                            messageId: message.id
                          })}
                          className="cursor-pointer bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">View Timed Image ({message.timerDuration}s)</span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-700 rounded-lg p-3 opacity-50">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">Image expired</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                  <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-800 bg-gray-900">
            <div className="flex space-x-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={isAdmin && !selectedUser}
              />
              <button
                onClick={handleSendMessage}
                disabled={isAdmin && !selectedUser}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            
            {isAdmin && selectedUser && (
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={() => handleSendTimedImage('https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg?auto=compress&cs=tinysrgb&w=800', 10)}
                  className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center space-x-2"
                >
                  <Clock className="h-4 w-4" />
                  <span>Send 10s Image</span>
                </button>
                <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-2">
                  <Mic className="h-4 w-4" />
                  <span>Voice</span>
                </button>
                <button className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center space-x-2">
                  <Paperclip className="h-4 w-4" />
                  <span>File</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* User List (Admin only) */}
        {isAdmin && (
          <div className="w-64 border-l border-gray-800 bg-gray-900">
            <div className="p-4 border-b border-gray-800">
              <h3 className="font-medium text-white">Active Users</h3>
            </div>
            <div className="p-2 space-y-1">
              {users.filter(user => user.status === 'verified').map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedUser === user.id ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                    <span className="text-sm">u/{user.redditUsername}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderChatRequests = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Chat Requests</h2>
      <div className="space-y-4">
        {chatRequests.filter(r => r.status === 'pending').map((request) => (
          <div key={request.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-white">u/{request.redditUsername}</h3>
                <p className="text-gray-400 text-sm">{request.requestedAt}</p>
                {request.message && (
                  <p className="text-gray-300 mt-2">{request.message}</p>
                )}
              </div>
              <button
                onClick={() => setChatRequestModal({ isOpen: true, request })}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Review
              </button>
            </div>
          </div>
        ))}
        {chatRequests.filter(r => r.status === 'pending').length === 0 && (
          <p className="text-gray-400 text-center py-8">No pending chat requests</p>
        )}
      </div>
    </div>
  );

  const renderVerifiedUsers = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Verified Users</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.filter(user => user.status === 'verified').map((user) => (
          <div key={user.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-600 rounded-full w-10 h-10 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">u/{user.redditUsername}</h3>
                  <p className="text-gray-400 text-sm">{user.lastActive}</p>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${user.isOnline ? 'bg-green-400' : 'bg-gray-600'}`}></div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Joined</p>
                <p className="text-white">{user.joinedAt}</p>
              </div>
              <div>
                <p className="text-gray-400">Messages</p>
                <p className="text-white">{user.messageCount}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <Crown className="h-6 w-6 text-orange-400" />
            <span>Private Platform</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {isAdmin ? 'Admin Panel' : `u/${currentUserData?.redditUsername}`}
          </p>
        </div>
        
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            <button
              onClick={() => setCurrentView('chat')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                currentView === 'chat' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <MessageCircle className="h-5 w-5" />
              <span>Chat</span>
            </button>
            
            {isAdmin && (
              <>
                <button
                  onClick={() => setCurrentView('chat-requests')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'chat-requests' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Chat Requests</span>
                  {chatRequests.filter(r => r.status === 'pending').length > 0 && (
                    <span className="bg-red-600 text-white text-xs rounded-full px-2 py-1">
                      {chatRequests.filter(r => r.status === 'pending').length}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => setCurrentView('verified-users')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'verified-users' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <UserCheck className="h-5 w-5" />
                  <span>Verified Users</span>
                </button>
                
                <button
                  onClick={() => setCurrentView('feedback')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'feedback' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Star className="h-5 w-5" />
                  <span>Feedback</span>
                </button>
                
                <button
                  onClick={() => setCurrentView('private-content')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'private-content' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Upload className="h-5 w-5" />
                  <span>Private Content</span>
                </button>
                
                <button
                  onClick={() => setCurrentView('settings')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'settings' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </button>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 h-screen">
        {currentView === 'chat' && renderChatView()}
        {currentView === 'chat-requests' && isAdmin && renderChatRequests()}
        {currentView === 'verified-users' && isAdmin && renderVerifiedUsers()}
        {currentView === 'feedback' && isAdmin && (
          <FeedbackManager
            feedback={feedback}
            users={users}
            onAddFeedback={(newFeedback) => setFeedback(prev => [...prev, { ...newFeedback, id: Date.now().toString(), submittedAt: new Date().toISOString() }])}
            onVerifyFeedback={(id) => setFeedback(prev => prev.map(f => f.id === id ? { ...f, isVerified: true } : f))}
            onDeleteFeedback={(id) => setFeedback(prev => prev.filter(f => f.id !== id))}
          />
        )}
        {currentView === 'private-content' && isAdmin && (
          <PrivateContentManager
            content={privateContent}
            users={users}
            onAddContent={(content) => setPrivateContent(prev => [...prev, { ...content, id: Date.now().toString(), uploadedAt: new Date().toISOString().split('T')[0], viewCounts: {} }])}
            onEditContent={(id, updates) => setPrivateContent(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))}
            onDeleteContent={(id) => setPrivateContent(prev => prev.filter(c => c.id !== id))}
            onGrantAccess={(contentId, userId) => setPrivateContent(prev => prev.map(c => c.id === contentId ? { ...c, accessGrantedUsers: [...c.accessGrantedUsers, userId] } : c))}
            onRevokeAccess={(contentId, userId) => setPrivateContent(prev => prev.map(c => c.id === contentId ? { ...c, accessGrantedUsers: c.accessGrantedUsers.filter(u => u !== userId) } : c))}
          />
        )}
      </div>
      
      {/* Modals */}
      <ChatRequestModal
        isOpen={chatRequestModal.isOpen}
        onClose={() => setChatRequestModal({ isOpen: false, request: null })}
        request={chatRequestModal.request}
        onAccept={handleAcceptChatRequest}
        onReject={handleRejectChatRequest}
      />
      
      <TimedImageViewer
        isOpen={timedImageViewer.isOpen}
        onClose={() => setTimedImageViewer({ isOpen: false, imageUrl: '', duration: 0, messageId: '' })}
        imageUrl={timedImageViewer.imageUrl}
        duration={timedImageViewer.duration}
        onExpire={() => {
          setMessages(prev => prev.map(m => 
            m.id === timedImageViewer.messageId ? { ...m, isExpired: true } : m
          ));
          setTimedImageViewer({ isOpen: false, imageUrl: '', duration: 0, messageId: '' });
        }}
      />
    </div>
  );
}

export default App;