import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/inventory', label: 'Inventory' },
  { to: '/admin/analytics', label: 'Demand Analytics' },
  { to: '/admin/customers', label: 'Customers' },
];

const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
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