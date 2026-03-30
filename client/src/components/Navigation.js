import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navigation = () => {
  const { isAuthenticated, user, logout, isAdmin } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-secondary">
          TeeStitch
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-secondary transition">
            Home
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/customize" className="hover:text-secondary transition">
                Customize
              </Link>
              <Link to="/dashboard" className="hover:text-secondary transition">
                Dashboard
              </Link>
              <Link to="/dashboard" className="hover:text-secondary transition">
                Wishlist
              </Link>
            </>
          )}
          {isAdmin && (
            <Link to="/admin" className="hover:text-accent transition font-semibold">
              Admin Panel
            </Link>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/cart" className="relative hover:text-secondary transition">
                Cart
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>
              <div className="text-sm">
                {user?.name}
              </div>
              <button
                onClick={handleLogout}
                className="bg-accent hover:bg-pink-600 px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link
                to="/login"
                className="hover:text-secondary transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn-primary text-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
