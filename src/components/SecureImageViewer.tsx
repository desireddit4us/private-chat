import React, { useEffect, useRef } from 'react';
import { X, Shield } from 'lucide-react';

interface SecureImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

const SecureImageViewer: React.FC<SecureImageViewerProps> = ({ isOpen, onClose, imageUrl, title }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Disable right-click context menu
      const handleContextMenu = (e: MouseEvent) => e.preventDefault();
      
      // Disable keyboard shortcuts
      const handleKeyDown = (e: KeyboardEvent) => {
        // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S, Print Screen, etc.
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

      // Disable drag and drop
      const handleDragStart = (e: DragEvent) => e.preventDefault();
      
      // Add event listeners
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('dragstart', handleDragStart);
      
      // Disable text selection
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      
      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('dragstart', handleDragStart);
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
      <div ref={containerRef} className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg flex items-center space-x-2">
          <Shield className="h-4 w-4" />
          <span className="text-sm">Protected Content</span>
        </div>
        
        <img
          src={imageUrl}
          alt={title}
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
        
        {/* Overlay to prevent right-click on image */}
        <div 
          className="absolute inset-0 pointer-events-none"
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
      
      {/* Warning message */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-900 border border-red-700 text-red-200 px-4 py-2 rounded-lg text-sm">
        Screenshots and screen recording are monitored and prohibited
      </div>
    </div>
  );
};

export default SecureImageViewer;