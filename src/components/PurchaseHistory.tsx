import React from 'react';
import { Download, Calendar, CheckCircle } from 'lucide-react';

interface Purchase {
  id: string;
  contentId: string;
  contentTitle: string;
  amount: number;
  date: string;
  giftCardCode: string;
  status: 'completed' | 'pending' | 'failed';
}

interface PurchaseHistoryProps {
  purchases: Purchase[];
}

const PurchaseHistory: React.FC<PurchaseHistoryProps> = ({ purchases }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Purchase History</h2>
      
      {purchases.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No purchases yet</p>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-white">{purchase.contentTitle}</h3>
                <span className={`text-sm font-medium ${getStatusColor(purchase.status)}`}>
                  {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{purchase.date}</span>
                  </div>
                  <span>₹{purchase.amount}</span>
                </div>
                
                {purchase.status === 'completed' && (
                  <button className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 transition-colors">
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                )}
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                Gift Card: {purchase.giftCardCode.substring(0, 4)}****{purchase.giftCardCode.substring(purchase.giftCardCode.length - 4)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;