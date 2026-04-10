import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { orderService, analyticsService, userService, inventoryService, productService } from '../services/api';
import { getReviewsForProduct } from '../data/reviewsData';
import { getMockCustomers, getAbandonedCartUsers } from '../data/mockCustomers';
import Toast from '../components/Toast';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated } = useContext(AuthContext);
  
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [insights, setInsights] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [totalInventory, setTotalInventory] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const mockCustomers = getMockCustomers();
  const abandonedCarts = getAbandonedCartUsers();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, analyticsRes, insightsRes, invRes, productsRes] = await Promise.all([
          orderService.getAllOrders(),
          analyticsService.getDemandAnalytics(),
          analyticsService.getCustomerInsights(),
          inventoryService.getInventory(),
          productService.getProducts(),
        ]);

        setOrders(ordersRes.data);
        setAnalytics(analyticsRes.data);
        setInsights(insightsRes.data);
        setInventory(invRes.data);
        setProducts(productsRes.data);
        setTotalInventory(invRes.data.length);
        setLowStockCount(invRes.data.filter(i => i.status === 'Low Stock' || i.status === 'Critical').length);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-primary animate-pulse"></div>
          <div className="absolute inset-0 w-12 h-12 rounded-2xl bg-secondary/30 animate-ping"></div>
        </div>
      </div>
    );
  }

  const COLORS = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#06B6D4', '#8B5CF6'];

  const sizesData = analytics?.popularSizes
    ? Object.entries(analytics.popularSizes).map(([size, count]) => ({ name: size, value: count }))
    : [];

  const fabricsData = analytics?.popularFabrics
    ? Object.entries(analytics.popularFabrics).map(([fabric, count]) => ({ name: fabric, value: count }))
    : [];

  const fitsData = analytics?.popularFits
    ? Object.entries(analytics.popularFits).map(([fit, count]) => ({ name: fit, value: count }))
    : [];

  const colorsData = analytics?.popularColors
    ? Object.entries(analytics.popularColors).map(([color, count]) => ({ name: color, value: count }))
    : [];

  const handleSendDiscount = (user) => {
    setToast({ message: `10% discount email sent to ${user.email}! 📧`, type: 'success' });
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Demand-driven supply chain insights</p>
        </div>
        <span className="badge badge-red text-[10px]">🔐 Admin Only</span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
        {[
          { label: 'Total Orders', value: analytics?.totalOrders || 0, color: 'from-blue-50 to-blue-100', textColor: 'text-blue-600' },
          { label: 'Revenue', value: `₹${analytics?.totalRevenue || 0}`, color: 'from-emerald-50 to-emerald-100', textColor: 'text-emerald-600' },
          { label: 'Items Sold', value: analytics?.totalItemsSold || 0, color: 'from-purple-50 to-purple-100', textColor: 'text-purple-600' },
          { label: 'Avg Order', value: `₹${analytics?.averageOrderValue || 0}`, color: 'from-pink-50 to-pink-100', textColor: 'text-pink-600' },
          { label: 'In Production', value: orders.filter(o => o.status === 'in production').length, color: 'from-blue-50 to-blue-100', textColor: 'text-blue-600' },
          { label: 'Inventory', value: totalInventory, color: 'from-amber-50 to-amber-100', textColor: 'text-amber-600' },
          { label: 'Low Stock', value: lowStockCount, color: 'from-orange-50 to-orange-100', textColor: 'text-orange-600' },
        ].map((metric, idx) => (
          <div key={idx} className={`card p-4 bg-gradient-to-br ${metric.color} border-0`}>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{metric.label}</p>
            <p className={`text-2xl font-bold ${metric.textColor} mt-1`}>{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card p-5">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total Customers</p>
          <p className="text-3xl font-bold text-secondary mt-1">{insights?.totalCustomers || 0}</p>
        </div>
        <div className="card p-5">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Retention Rate</p>
          <p className="text-3xl font-bold text-secondary mt-1">{insights?.customerRetentionRate || 0}%</p>
        </div>
        <div className="card p-5">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">New This Month</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{insights?.newCustomersThisMonth || 0}</p>
        </div>
      </div>

      {/* Abandoned Cart Alert */}
      {abandonedCarts.length > 0 && (
        <div className="card p-5 mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-amber-800">Cart Abandonment Alert</p>
                <p className="text-xs text-amber-600">{abandonedCarts.length} users have items in cart but haven't ordered</p>
              </div>
            </div>
            <button onClick={() => navigate('/admin/customers')} className="btn-primary !py-2 !px-4 text-xs !bg-amber-600 hover:!bg-amber-700">
              View & Take Action →
            </button>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Popular Sizes */}
        <div className="card p-6">
          <h3 className="font-bold text-primary mb-4">Demand by Size</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={sizesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
              <Bar dataKey="value" fill="#6366F1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fabric Preference */}
        <div className="card p-6">
          <h3 className="font-bold text-primary mb-4">Fabric Preference</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={fabricsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {fabricsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Fit Preference */}
        <div className="card p-6">
          <h3 className="font-bold text-primary mb-4">Fit Preference</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={fitsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
              <Bar dataKey="value" fill="#EC4899" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Color Preference */}
        <div className="card p-6">
          <h3 className="font-bold text-primary mb-4">Color Preference</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={colorsData.slice(0, 5)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {colorsData.slice(0, 5).map((entry, index) => (
                  <Cell key={`cell-color-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden mb-8">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-primary">Products Inventory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Name', 'Category', 'Price', 'Stock', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const lowStock = product.stock <= 5;
                return (
                  <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-medium text-primary">{product.name}</td>
                    <td className="px-5 py-4 text-gray-500">{product.category}</td>
                    <td className="px-5 py-4 font-semibold">₹{product.basePrice}</td>
                    <td className="px-5 py-4">{product.stock}</td>
                    <td className="px-5 py-4">
                      <span className={`badge ${product.stock <= 0 ? 'badge-red' : lowStock ? 'badge-yellow' : 'badge-green'} text-[10px]`}>
                        {product.stock <= 0 ? 'Out of Stock' : lowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        className="text-sm text-secondary hover:underline font-medium"
                        onClick={async () => {
                          const newStock = parseInt(prompt('Enter new stock quantity', product.stock));
                          if (isNaN(newStock) || newStock < 0) return;
                          try {
                            await productService.updateStock(product._id, newStock);
                            const res = await productService.getProducts();
                            setProducts(res.data);
                            setToast({ message: 'Stock updated!', type: 'success' });
                          } catch (err) {
                            console.error(err);
                            setToast({ message: 'Failed to update stock', type: 'error' });
                          }
                        }}
                      >
                        Edit Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Insights */}
      <div className="card overflow-hidden mb-8">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-primary">Review Insights (CRM)</h3>
          <p className="text-xs text-gray-400 mt-0.5">Product sentiment analysis</p>
        </div>
        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {products.slice(0, 4).map((product) => {
            const mockReviews = product.reviewsData?.length > 0 ? product.reviewsData : getReviewsForProduct(product._id);
            const totalReviews = mockReviews.length;
            const avgRating = totalReviews > 0 ? (mockReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) : 0;
            const goodReviews = mockReviews.filter(r => r.rating >= 4).length;
            const badReviews = mockReviews.filter(r => r.rating <= 2).length;
            
            const positiveReviews = mockReviews.filter(r => r.rating >= 4);
            const positiveReasonCount = {};
            positiveReviews.forEach(r => {
              const reason = r.reason || r.reasonTag || "General";
              positiveReasonCount[reason] = (positiveReasonCount[reason] || 0) + 1;
            });

            let topPositiveReason = null;
            let topPositivePercent = 0;
            if (positiveReviews.length > 0) {
              const sorted = Object.entries(positiveReasonCount).sort((a, b) => b[1] - a[1]);
              topPositiveReason = sorted[0][0];
              topPositivePercent = Math.round((sorted[0][1] / positiveReviews.length) * 100);
            }

            const negativeReviews = mockReviews.filter(r => r.rating <= 2);
            const negativeReasonCount = {};
            negativeReviews.forEach(r => {
              const reason = r.reason || r.reasonTag || "General";
              negativeReasonCount[reason] = (negativeReasonCount[reason] || 0) + 1;
            });

            let topNegativeReason = null;
            let topNegativePercent = 0;
            if (negativeReviews.length > 0) {
              const sorted = Object.entries(negativeReasonCount).sort((a, b) => b[1] - a[1]);
              topNegativeReason = sorted[0][0];
              topNegativePercent = Math.round((sorted[0][1] / negativeReviews.length) * 100);
            }

            return (
              <div key={product._id} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-start mb-3">
                  <p className="font-semibold text-primary text-sm">{product.name}</p>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                    <span className="text-sm font-bold text-primary">{avgRating}</span>
                  </div>
                </div>
                <div className="flex gap-4 text-xs mb-3">
                  <span className="text-gray-500">Reviews: <span className="font-bold text-primary">{totalReviews}</span></span>
                  <span className="text-emerald-600 font-medium">👍 {goodReviews}</span>
                  <span className="text-red-500 font-medium">👎 {badReviews}</span>
                </div>
                <div className="space-y-1.5">
                  {topPositiveReason && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="badge badge-green text-[10px]">👍 {topPositivePercent}%</span>
                      <span className="text-gray-600">liked <span className="font-medium text-primary">{topPositiveReason}</span></span>
                    </div>
                  )}
                  {topNegativeReason && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="badge badge-red text-[10px]">👎 {topNegativePercent}%</span>
                      <span className="text-gray-600">disliked <span className="font-medium text-primary">{topNegativeReason}</span></span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Orders */}
      {analytics?.monthlyOrders && analytics.monthlyOrders.length > 0 && (
        <div className="card p-6 mb-8">
          <h3 className="font-bold text-primary mb-4">Monthly Orders Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={analytics.monthlyOrders}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
              <Line type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={2} dot={{ fill: '#6366F1', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Orders */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-primary">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Order ID', 'Customer', 'Specs', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map((order) => (
                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-primary">{order.orderId}</td>
                  <td className="px-5 py-4 text-gray-600">{order.userId?.name || 'Unknown'}</td>
                  <td className="px-5 py-4 text-xs text-gray-500">{order.size} • {order.fabric} • {order.color}</td>
                  <td className="px-5 py-4 font-bold text-emerald-600">₹{order.totalPrice}</td>
                  <td className="px-5 py-4">
                    <span className="badge badge-yellow text-[10px]">{order.status}</span>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminDashboard;
