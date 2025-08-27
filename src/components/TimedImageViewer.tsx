import React, { useState, useEffect, useRef } from 'react';
import { X, Clock, Eye } from 'lucide-react';

interface TimedImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  duration: number; // in seconds
  onExpire: () => void;
}

const TimedImageViewer: React.FC<TimedImageViewerProps> = ({
  isOpen,
  onClose,
  imageUrl,
  duration,
  onExpire
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isExpired, setIsExpired] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !isExpired) {
      setTimeLeft(duration);
      
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsExpired(true);
            onExpire();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Security measures
      const handleContextMenu = (e: MouseEvent) => e.preventDefault();
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

      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.userSelect = 'none';

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.userSelect = '';
      };
    }
  }, [isOpen, duration, isExpired, onExpire]);

  const formatTime = (seconds: number) => {
    if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  if (isExpired) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full mx-4 text-center">
          <div className="bg-red-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Image Expired</h3>
          <p className="text-gray-400 mb-6">This timed image has expired and is no longer available.</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
      <div ref={containerRef} className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="absolute top-4 left-4 z-10 bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Clock className="h-4 w-4" />
          <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
        </div>
        
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg flex items-center space-x-2">
          <Eye className="h-4 w-4" />
          <span className="text-sm">Timed View - No Screenshots</span>
        </div>
        
        <img
          src={imageUrl}
          alt="Timed content"
          className="max-w-full max-h-full object-contain select-none pointer-events-none"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            WebkitUserDrag: 'none',
            WebkitTouchCallout: 'none'
          }}
        />
        
        <div className="absolute inset-0 pointer-events-none" onContextMenu={(e) => e.preventDefault()} />
      </div>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-900 border border-red-700 text-red-200 px-4 py-2 rounded-lg text-sm">
        This image will disappear in {formatTime(timeLeft)} - Screenshots prohibited
      </div>
    </div>
  );
};

export default TimedImageViewer;