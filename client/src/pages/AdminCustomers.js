import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { userService } from '../services/api';
import { getMockCustomers, getCategoryBadge, getAbandonedCartUsers, getUsersWithCartItems } from '../data/mockCustomers';
import Toast from '../components/Toast';

const AdminCustomers = () => {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [mockData] = useState(getMockCustomers());
  const [abandonedUsers] = useState(getUsersWithCartItems().filter(u => !u.hasOrdered || u.cartItems > 0));
  const [toast, setToast] = useState(null);
  const [activeView, setActiveView] = useState('analytics');

  const navigate = useNavigate();
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await userService.getAllUsers();
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendDiscount = (user) => {
    setToast({ message: `10% discount email sent to ${user.email}! 📧`, type: 'success' });
  };

  // CRM Stats
  const frequentBuyers = mockData.filter(c => c.category === 'Frequent Buyer').length;
  const activeBuyers = mockData.filter(c => c.category === 'Active Buyer').length;
  const inactiveBuyers = mockData.filter(c => c.category === 'Inactive Buyer').length;
  const totalRevenue = mockData.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary">Customer Intelligence</h2>
          <p className="text-sm text-gray-500 mt-0.5">CRM analytics & customer segmentation</p>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { id: 'analytics', label: 'CRM Analytics' },
          { id: 'abandoned', label: 'Abandoned Carts' },
          { id: 'list', label: 'Customer List' },
        ].map(v => (
          <button
            key={v.id}
            onClick={() => setActiveView(v.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeView === v.id ? 'bg-white text-primary shadow-sm' : 'text-gray-500'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Analytics View */}
      {activeView === 'analytics' && (
        <div className="animate-fade-in">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="card p-5">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total Revenue</p>
              <p className="text-2xl font-bold text-primary mt-1">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="card p-5 border-l-4 border-emerald-400">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Frequent Buyers</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{frequentBuyers}</p>
            </div>
            <div className="card p-5 border-l-4 border-blue-400">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Active Buyers</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{activeBuyers}</p>
            </div>
            <div className="card p-5 border-l-4 border-gray-300">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Inactive Buyers</p>
              <p className="text-2xl font-bold text-gray-500 mt-1">{inactiveBuyers}</p>
            </div>
          </div>

          {/* Customer Ranking Table */}
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-primary">Customer Ranking by Lifetime Value</h3>
              <p className="text-xs text-gray-400 mt-0.5">Sorted by total spending</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-5 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Rank</th>
                    <th className="px-5 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                    <th className="px-5 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total Spent</th>
                    <th className="px-5 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Orders</th>
                    <th className="px-5 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Last Order</th>
                    <th className="px-5 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Segment</th>
                    <th className="px-5 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Cart</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.map((customer, idx) => (
                    <tr key={customer._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          idx === 0 ? 'bg-amber-100 text-amber-700' :
                          idx === 1 ? 'bg-gray-100 text-gray-600' :
                          idx === 2 ? 'bg-orange-100 text-orange-700' :
                          'text-gray-400'
                        }`}>
                          {idx + 1}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-secondary to-indigo-400 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{customer.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-primary text-sm">{customer.name}</p>
                            <p className="text-[10px] text-gray-400">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-bold text-primary">₹{customer.totalSpent.toLocaleString()}</td>
                      <td className="px-5 py-4 text-gray-600">{customer.totalOrders}</td>
                      <td className="px-5 py-4 text-xs text-gray-500">
                        {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge text-[10px] ${getCategoryBadge(customer.category)}`}>
                          {customer.category}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {customer.cartItems > 0 ? (
                          <span className="badge badge-yellow text-[10px]">{customer.cartItems} items</span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Abandoned Cart View */}
      {activeView === 'abandoned' && (
        <div className="animate-fade-in">
          <div className="card p-5 mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛒</span>
              <div>
                <p className="text-sm font-semibold text-amber-800">Cart Abandonment Recovery</p>
                <p className="text-xs text-amber-600">{abandonedUsers.length} users have items in their cart but haven't completed their purchase</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {abandonedUsers.map(user => (
              <div key={user._id} className="card p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-primary text-sm">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{user.cartItems} items in cart</p>
                    {user.totalOrders === 0 && (
                      <p className="text-[10px] text-red-500 font-medium">Never ordered</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleSendDiscount(user)}
                    className="btn-primary !py-2 !px-4 text-xs !bg-amber-600 hover:!bg-amber-700 flex items-center gap-1.5"
                  >
                    📧 Send 10% Discount
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer List View */}
      {activeView === 'list' && (
        <div className="card overflow-hidden animate-fade-in">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-primary">Registered Customers</h3>
            <p className="text-xs text-gray-400 mt-0.5">From your backend database</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-5 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 text-xs font-bold">{c.name?.charAt(0)}</span>
                        </div>
                        <span className="font-medium text-primary">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{c.email}</td>
                    <td className="px-5 py-4">
                      <span className={`badge ${c.role === 'admin' ? 'badge-purple' : 'badge-blue'}`}>
                        {c.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminCustomers;
