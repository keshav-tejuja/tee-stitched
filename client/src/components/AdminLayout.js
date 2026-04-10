import React from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const links = [
  { to: '/admin', label: 'Dashboard', icon: '📊' },
  { to: '/admin/orders', label: 'Orders', icon: '📦' },
  { to: '/admin/inventory', label: 'Inventory', icon: '🏭' },
  { to: '/admin/analytics', label: 'Analytics', icon: '📈' },
  { to: '/admin/customers', label: 'Customers', icon: '👥' },
];

const AdminLayout = () => {
  const location = useLocation();
  const { isAdmin } = useContext(AuthContext);

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="card p-10 text-center max-w-sm animate-fade-in">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h1 className="text-xl font-bold text-primary mb-2">Unauthorized Access</h1>
          <p className="text-sm text-gray-500 mb-6">You must be an administrator to view this page.</p>
          <Link to="/" className="btn-primary inline-block">Go to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex-shrink-0">
        <div className="p-6 sticky top-[73px]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <h2 className="text-lg font-bold text-primary">Admin</h2>
          </div>
          <div className="badge badge-green text-[10px] mb-6">
            🔐 Protected Access
          </div>
          
          <nav className="flex flex-col gap-1">
            {links.map(link => {
              const isActive =
                link.to === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                    }`}
                >
                  <span className="text-base">{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;