import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-emerald-600',
    error: 'bg-red-600',
    info: 'bg-secondary',
    warning: 'bg-amber-600',
  }[type] || 'bg-primary';

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  }[type] || '✓';

  return (
    <div
      className={`fixed bottom-6 right-6 ${bgColor} text-white px-6 py-4 rounded-2xl shadow-elevated z-[9999] flex items-center gap-3 max-w-sm transition-all duration-300 ${
        visible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-4'
      }`}
    >
      <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold flex-shrink-0">
        {icon}
      </span>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default Toast;
