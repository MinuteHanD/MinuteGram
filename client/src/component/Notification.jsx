import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

const Notification = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) {
          onClose();
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  const icons = {
    success: <CheckCircle className="w-6 h-6 text-green-400" />,
    error: <XCircle className="w-6 h-6 text-red-400" />,
    info: <Info className="w-6 h-6 text-blue-400" />,
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg p-4 flex items-center gap-4 animate-fade-in-up">
      {icons[type]}
      <p className="text-white">{message}</p>
      <button onClick={() => setVisible(false)} className="text-zinc-400 hover:text-white">
        <XCircle className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Notification;
