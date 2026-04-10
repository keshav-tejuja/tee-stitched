import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <div className="text-8xl font-black text-primary mb-4 tracking-tighter">404</div>
        <p className="text-xl font-semibold text-gray-800 mb-2">Page Not Found</p>
        <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">The page you're looking for doesn't exist or has been moved.</p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
