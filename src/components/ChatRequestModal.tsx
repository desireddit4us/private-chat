import React, { useState } from 'react';
import { X, User, Check, X as Reject, MessageCircle } from 'lucide-react';
import { ChatRequest } from '../types';

interface ChatRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ChatRequest | null;
  onAccept: (requestId: string, uniqueId: string) => void;
  onReject: (requestId: string) => void;
}

const ChatRequestModal: React.FC<ChatRequestModalProps> = ({
  isOpen,
  onClose,
  request,
  onAccept,
  onReject
}) => {
  const [uniqueId, setUniqueId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const generateUniqueId = () => {
    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setUniqueId(id.toUpperCase());
  };

  const handleAccept = async () => {
    if (!uniqueId.trim() || !request) return;
    
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onAccept(request.id, uniqueId);
    setIsProcessing(false);
    setUniqueId('');
    onClose();
  };

  const handleReject = async () => {
    if (!request) return;
    
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onReject(request.id);
    setIsProcessing(false);
    onClose();
  };

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Chat Request</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-orange-600 rounded-full w-12 h-12 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">u/{request.redditUsername}</p>
              <p className="text-gray-400 text-sm">{request.requestedAt}</p>
            </div>
          </div>

          {request.message && (
            <div className="bg-gray-800 rounded-lg p-3 mb-4">
              <p className="text-gray-300 text-sm">{request.message}</p>
            </div>
          )}

          <div className="bg-blue-900 border border-blue-700 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-2">
              <MessageCircle className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-200">
                <p className="font-medium mb-1">Verification Process</p>
                <p>If you accept this request, generate a unique ID that the user must send to your Reddit account (u/desireddit4us) for verification.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Unique Verification ID
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={uniqueId}
                  onChange={(e) => setUniqueId(e.target.value.toUpperCase())}
                  placeholder="Enter or generate unique ID"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                />
                <button
                  onClick={generateUniqueId}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleAccept}
            disabled={isProcessing || !uniqueId.trim()}
            className="flex-1 flex items-center justify-center space-x-2 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="h-4 w-4" />
            <span>{isProcessing ? 'Processing...' : 'Accept & Send ID'}</span>
          </button>
          
          <button
            onClick={handleReject}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center space-x-2 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <Reject className="h-4 w-4" />
            <span>{isProcessing ? 'Processing...' : 'Reject'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRequestModal;