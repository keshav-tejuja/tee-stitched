import React from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const links = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/inventory', label: 'Inventory' },
  { to: '/admin/analytics', label: 'Demand Analytics' },
  { to: '/admin/customers', label: 'Customers' },
];

const AdminLayout = () => {
  const location = useLocation();
  const { isAdmin } = useContext(AuthContext);

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="card p-8 text-center max-w-sm">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Unauthorized Access</h1>
          <p className="text-gray-600 mb-4">You must be an administrator to view this page.</p>
          <Link to="/" className="btn-primary inline-block">Go to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-primary mb-2">Admin Panel</h2>
          <div className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 inline-block rounded border border-green-200">
            🔐 Protected Admin Access
          </div>
          <nav className="mt-6 flex flex-col gap-3">
            {links.map(link => {
              const isActive =
                link.to === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-3 py-2 rounded hover:bg-gray-100 transition 
                    ${isActive ? 'bg-gray-200 font-semibold' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;