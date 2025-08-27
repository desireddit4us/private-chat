import React, { useState } from 'react';
import { User, MessageCircle, DollarSign, Gift, Eye, Calendar, Shield } from 'lucide-react';

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

interface AdminDashboardProps {
  users: UserData[];
  currentUser: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, currentUser }) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState<number>(500);

  const totalRevenue = users.reduce((sum, user) => sum + user.totalPaid, 0);
  const verifiedUsers = users.filter(user => user.paymentStatus === 'verified').length;
  const totalMessages = users.reduce((sum, user) => sum + user.messageCount, 0);

  const selectedUserData = users.find(user => user.username === selectedUser);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Manage users and monitor activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{users.length}</p>
            </div>
            <User className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Verified Users</p>
              <p className="text-2xl font-bold text-white">{verifiedUsers}</p>
            </div>
            <Shield className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-white">₹{totalRevenue}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Messages</p>
              <p className="text-2xl font-bold text-white">{totalMessages}</p>
            </div>
            <MessageCircle className="h-8 w-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Payment Amount Setting */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Payment Settings</h2>
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Custom Payment Amount (₹)
            </label>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(Number(e.target.value))}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              min="1"
            />
          </div>
          <div className="text-sm text-gray-400 mt-6">
            This amount will be used for gift card payments
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Users List */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Active Users</h2>
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.username}
                onClick={() => setSelectedUser(user.username)}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedUser === user.username ? 'bg-gray-700' : 'bg-gray-900 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-600 rounded-full w-8 h-8 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">u/{user.username}</p>
                      <p className="text-xs text-gray-400">{user.lastActive}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs px-2 py-1 rounded ${
                      user.paymentStatus === 'verified' ? 'bg-green-900 text-green-300' :
                      user.paymentStatus === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {user.paymentStatus}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">₹{user.totalPaid}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Details */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">User Details</h2>
          {selectedUserData ? (
            <div className="space-y-4">
              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-3">u/{selectedUserData.username}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Joined</p>
                    <p className="text-white">{selectedUserData.joinedAt}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Messages</p>
                    <p className="text-white">{selectedUserData.messageCount}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Last Active</p>
                    <p className="text-white">{selectedUserData.lastActive}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Total Paid</p>
                    <p className="text-white">₹{selectedUserData.totalPaid}</p>
                  </div>
                </div>
              </div>

              {/* Gift Card History */}
              <div className="bg-gray-900 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
                  <Gift className="h-4 w-4" />
                  <span>Gift Card History</span>
                </h4>
                {selectedUserData.giftCards.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUserData.giftCards.map((card, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-white">₹{card.amount}</p>
                          <p className="text-gray-400">{card.date}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-xs px-2 py-1 rounded ${
                            card.status === 'verified' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                          }`}>
                            {card.status}
                          </div>
                          <p className="text-gray-400 text-xs mt-1">
                            {card.code.substring(0, 4)}****{card.code.substring(card.code.length - 4)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No gift cards redeemed</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Select a user to view details</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;