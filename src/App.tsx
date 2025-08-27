import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Settings, Crown, Image, DollarSign, Shield, LogOut } from 'lucide-react';
import UsernameEntry from './components/UsernameEntry';
import PaymentModal from './components/PaymentModal';
import SecureImageViewer from './components/SecureImageViewer';
import AdminDashboard from './components/AdminDashboard';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'premium_image';
  imageUrl?: string;
}

interface UserData {
  username: string;
  joinedAt: string;
  messageCount: number;
  lastActive: string;
  paymentStatus: 'none' | 'pending' | 'verified';
  totalPaid: number;
  giftCards: Array<{
    code: string;
    amount: number;
    date: string;
    status: 'verified' | 'pending';
  }>;
}

function App() {
  const [currentUser, setCurrentUser] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentView, setCurrentView] = useState<'chat' | 'admin'>('chat');
  const [messageText, setMessageText] = useState('');
  const [customAmount, setCustomAmount] = useState(500);
  const [paymentModal, setPaymentModal] = useState(false);
  const [imageViewer, setImageViewer] = useState<{ isOpen: boolean; imageUrl: string; title: string }>({
    isOpen: false,
    imageUrl: '',
    title: ''
  });
  
  const adminUsername = 'desireddit4us';
  
  // Mock data
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: adminUsername,
      content: 'Welcome to our private chat! I\'m here to provide you with exclusive content.',
      timestamp: '10:30 AM',
      type: 'text'
    }
  ]);

  const [users, setUsers] = useState<UserData[]>([
    {
      username: 'testuser123',
      joinedAt: '2024-01-15',
      messageCount: 25,
      lastActive: '2 minutes ago',
      paymentStatus: 'verified',
      totalPaid: 1500,
      giftCards: [
        {
          code: 'AMZN-GIFT-1234567890',
          amount: 1000,
          date: '2024-01-15',
          status: 'verified'
        },
        {
          code: 'AMZN-GIFT-0987654321',
          amount: 500,
          date: '2024-01-20',
          status: 'verified'
        }
      ]
    }
  ]);

  const currentUserData = users.find(user => user.username === currentUser);
  const isVerifiedUser = currentUserData?.paymentStatus === 'verified';

  const handleUsernameSubmit = (username: string) => {
    setCurrentUser(username);
    setIsAdmin(username === adminUsername);
    
    // Add user to database if not exists
    if (!users.find(user => user.username === username) && username !== adminUsername) {
      const newUser: UserData = {
        username,
        joinedAt: new Date().toISOString().split('T')[0],
        messageCount: 0,
        lastActive: 'Just now',
        paymentStatus: 'none',
        totalPaid: 0,
        giftCards: []
      };
      setUsers(prev => [...prev, newUser]);
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser,
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageText('');

    // Update user message count
    if (!isAdmin) {
      setUsers(prev => prev.map(user => 
        user.username === currentUser 
          ? { ...user, messageCount: user.messageCount + 1, lastActive: 'Just now' }
          : user
      ));
    }
  };

  const handlePaymentSuccess = (giftCardCode: string, pin: string) => {
    // Update user payment status
    setUsers(prev => prev.map(user => 
      user.username === currentUser 
        ? { 
            ...user, 
            paymentStatus: 'verified',
            totalPaid: user.totalPaid + customAmount,
            giftCards: [...user.giftCards, {
              code: giftCardCode,
              amount: customAmount,
              date: new Date().toISOString().split('T')[0],
              status: 'verified'
            }]
          }
        : user
    ));

    // Send confirmation message
    const confirmationMessage: Message = {
      id: Date.now().toString(),
      senderId: adminUsername,
      content: `Payment verified! ₹${customAmount} received. You now have access to premium content.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };

    setMessages(prev => [...prev, confirmationMessage]);
  };

  const handleSendPremiumImage = (imageUrl: string) => {
    const imageMessage: Message = {
      id: Date.now().toString(),
      senderId: adminUsername,
      content: 'Premium content for verified users only',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'premium_image',
      imageUrl
    };

    setMessages(prev => [...prev, imageMessage]);
  };

  const handleLogout = () => {
    // Remove user from active users
    const activeUsers = JSON.parse(localStorage.getItem('activeUsers') || '[]');
    const updatedUsers = activeUsers.filter((user: string) => user !== currentUser);
    localStorage.setItem('activeUsers', JSON.stringify(updatedUsers));
    
    setCurrentUser('');
    setIsAdmin(false);
    setCurrentView('chat');
    setMessages([{
      id: '1',
      senderId: adminUsername,
      content: 'Welcome to our private chat! I\'m here to provide you with exclusive content.',
      timestamp: '10:30 AM',
      type: 'text'
    }]);
  };

  if (!currentUser) {
    return <UsernameEntry onUsernameSubmit={handleUsernameSubmit} />;
  }

  const renderChatView = () => (
    <div className="flex h-full">
      {/* Chat Area */}
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
                  {isAdmin ? 'Admin Panel' : `Chat with u/${adminUsername}`}
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <p className="text-xs text-gray-400">Online</p>
                  {!isAdmin && currentUserData && (
                    <div className={`text-xs px-2 py-1 rounded ${
                      currentUserData.paymentStatus === 'verified' ? 'bg-green-900 text-green-300' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {currentUserData.paymentStatus === 'verified' ? 'Verified' : 'Free User'}
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
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === currentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === currentUser
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-800 text-white'
                }`}
              >
                {message.type === 'premium_image' ? (
                  <div>
                    <p className="text-sm mb-2">{message.content}</p>
                    {isVerifiedUser || isAdmin ? (
                      <div
                        onClick={() => setImageViewer({
                          isOpen: true,
                          imageUrl: message.imageUrl!,
                          title: 'Premium Content'
                        })}
                        className="cursor-pointer bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <Image className="h-4 w-4" />
                          <span className="text-sm">View Premium Image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-700 rounded-lg p-3 opacity-50">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4" />
                          <span className="text-sm">Premium content - Payment required</span>
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
          {!isAdmin && !isVerifiedUser && (
            <div className="mb-3 p-3 bg-orange-900 border border-orange-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-orange-400" />
                  <span className="text-orange-200 text-sm">Get premium access for exclusive content</span>
                </div>
                <button
                  onClick={() => setPaymentModal(true)}
                  className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition-colors"
                >
                  Pay ₹{customAmount}
                </button>
              </div>
            </div>
          )}
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button 
              onClick={handleSendMessage}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          
          {isAdmin && (
            <div className="mt-3 flex space-x-2">
              <button
                onClick={() => handleSendPremiumImage('https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg?auto=compress&cs=tinysrgb&w=800')}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center space-x-2"
              >
                <Image className="h-4 w-4" />
                <span>Send Premium Image</span>
              </button>
            </div>
          )}
        </div>
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
            <span>Private Chat</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">u/{currentUser}</p>
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
              <button
                onClick={() => setCurrentView('admin')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'admin' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Settings className="h-5 w-5" />
                <span>Admin Dashboard</span>
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 h-screen">
        {currentView === 'chat' && renderChatView()}
        {currentView === 'admin' && isAdmin && (
          <AdminDashboard users={users} currentUser={currentUser} />
        )}
      </div>
      
      {/* Modals */}
      <PaymentModal
        isOpen={paymentModal}
        onClose={() => setPaymentModal(false)}
        customAmount={customAmount}
        onPaymentSuccess={handlePaymentSuccess}
      />
      
      <SecureImageViewer
        isOpen={imageViewer.isOpen}
        onClose={() => setImageViewer({ isOpen: false, imageUrl: '', title: '' })}
        imageUrl={imageViewer.imageUrl}
        title={imageViewer.title}
      />
    </div>
  );
}

export default App;