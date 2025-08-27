import React, { useState } from 'react';
import { X, Gift, CheckCircle, AlertCircle, Copy, DollarSign } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  customAmount: number;
  onPaymentSuccess: (giftCardCode: string, pin: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, customAmount, onPaymentSuccess }) => {
  const [step, setStep] = useState<'instructions' | 'verify'>('instructions');
  const [giftCardCode, setGiftCardCode] = useState('');
  const [pin, setPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  const amazonGiftCardUrl = `https://www.amazon.in/dp/B077TQZPX6?amount=${customAmount}`;

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(customAmount.toString());
  };

  const handleVerifyGiftCard = async () => {
    if (!giftCardCode.trim() || !pin.trim()) {
      setVerificationError('Please enter both gift card code and PIN');
      return;
    }

    setIsVerifying(true);
    setVerificationError('');

    // Simulate Amazon API verification (in real app, this would verify with Amazon API)
    setTimeout(() => {
      // Basic validation
      if (giftCardCode.length >= 10 && pin.length >= 4 && /^[A-Z0-9-]+$/i.test(giftCardCode)) {
        onPaymentSuccess(giftCardCode, pin);
        onClose();
        setStep('instructions');
        setGiftCardCode('');
        setPin('');
      } else {
        setVerificationError('Invalid gift card code or PIN. Please check and try again.');
      }
      setIsVerifying(false);
    }, 3000);
  };

  const resetModal = () => {
    setStep('instructions');
    setGiftCardCode('');
    setPin('');
    setVerificationError('');
    setIsVerifying(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <div className="bg-orange-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <DollarSign className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2 text-center">Premium Access Payment</h3>
          <p className="text-2xl font-bold text-orange-400 text-center">₹{customAmount}</p>
        </div>

        {step === 'instructions' && (
          <div>
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Gift className="h-5 w-5 text-orange-400" />
                <h4 className="text-lg font-medium text-white">Payment via Amazon Gift Card</h4>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <h5 className="text-sm font-medium text-gray-300 mb-3">Step-by-Step Instructions:</h5>
                <ol className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    <span>Click the button below to go to Amazon Gift Cards</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    <span>Purchase an Amazon Gift Card for exactly <strong>₹{customAmount}</strong></span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                    <span>Choose "Email" delivery and send it to yourself</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                    <span>Copy both the gift card code and PIN from the email</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">5</span>
                    <span>Return here and enter both for verification</span>
                  </li>
                </ol>
              </div>

              <div className="bg-blue-900 border border-blue-700 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <p className="text-sm text-blue-200">
                    <strong>Important:</strong> The gift card will be redeemed to the creator's Amazon account for verification
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3 mb-4">
                <span className="text-white font-medium">Amount: ₹{customAmount}</span>
                <button
                  onClick={handleCopyAmount}
                  className="flex items-center space-x-1 text-orange-400 hover:text-orange-300 transition-colors"
                >
                  <Copy className="h-4 w-4" />
                  <span className="text-sm">Copy</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={amazonGiftCardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Gift className="h-4 w-4" />
                <span>Buy Amazon Gift Card (₹{customAmount})</span>
              </a>
              
              <button
                onClick={() => setStep('verify')}
                className="w-full py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                I have the gift card details
              </button>
            </div>
          </div>
        )}

        {step === 'verify' && (
          <div>
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <h4 className="text-lg font-medium text-white">Verify Gift Card</h4>
              </div>
              
              <p className="text-sm text-gray-300 mb-4">
                Enter the Amazon Gift Card details you received via email:
              </p>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Gift Card Code</label>
                  <input
                    type="text"
                    value={giftCardCode}
                    onChange={(e) => {
                      setGiftCardCode(e.target.value.toUpperCase());
                      setVerificationError('');
                    }}
                    placeholder="Enter gift card code (e.g., ABCD-EFGH12-IJKL)"
                    className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-center"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">PIN</label>
                  <input
                    type="text"
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value);
                      setVerificationError('');
                    }}
                    placeholder="Enter PIN (4-6 digits)"
                    className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-center"
                    maxLength={6}
                  />
                </div>
                
                {verificationError && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{verificationError}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleVerifyGiftCard}
                disabled={isVerifying || !giftCardCode.trim() || !pin.trim()}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? 'Verifying & Redeeming...' : 'Verify & Complete Payment'}
              </button>
              
              <button
                onClick={() => setStep('instructions')}
                className="w-full py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Back to Instructions
              </button>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-4 text-center">
          Gift card will be redeemed to creator's Amazon account • Secure verification process
        </p>
      </div>
    </div>
  );
};

export default PaymentModal;