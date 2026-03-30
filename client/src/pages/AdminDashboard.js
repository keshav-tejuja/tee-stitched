import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { orderService, analyticsService, userService, inventoryService, productService } from '../services/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const COLORS = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#06B6D4', '#8B5CF6'];

  // Prepare data for charts
  const sizesData = analytics?.popularSizes
    ? Object.entries(analytics.popularSizes).map(([size, count]) => ({
        name: size,
        value: count,
      }))
    : [];

  const fabricsData = analytics?.popularFabrics
    ? Object.entries(analytics.popularFabrics).map(([fabric, count]) => ({
        name: fabric,
        value: count,
      }))
    : [];

  const fitsData = analytics?.popularFits
    ? Object.entries(analytics.popularFits).map(([fit, count]) => ({
        name: fit,
        value: count,
      }))
    : [];

  const colorsData = analytics?.popularColors
    ? Object.entries(analytics.popularColors).map(([color, count]) => ({
        name: color,
        value: count,
      }))
    : [];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-primary">Admin Analytics Dashboard</h1>
        <p className="text-gray-600 mb-8">Demand-driven supply chain insights and customer analytics</p>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 mb-8">
          <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100">
            <p className="text-gray-600 text-sm font-semibold mb-2">Total Orders</p>
            <p className="text-4xl font-bold text-blue-600">{analytics?.totalOrders || 0}</p>
          </div>

          <div className="card p-6 bg-gradient-to-br from-green-50 to-green-100">
            <p className="text-gray-600 text-sm font-semibold mb-2">Total Revenue</p>
            <p className="text-4xl font-bold text-green-600">₹{analytics?.totalRevenue || 0}</p>
          </div>

          <div className="card p-6 bg-gradient-to-br from-purple-50 to-purple-100">
            <p className="text-gray-600 text-sm font-semibold mb-2">Items Sold</p>
            <p className="text-4xl font-bold text-purple-600">{analytics?.totalItemsSold || 0}</p>
          </div>

          <div className="card p-6 bg-gradient-to-br from-pink-50 to-pink-100">
            <p className="text-gray-600 text-sm font-semibold mb-2">Avg Order Value</p>
            <p className="text-4xl font-bold text-pink-600">₹{analytics?.averageOrderValue || 0}</p>
          </div>
          <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100">
            <p className="text-gray-600 text-sm font-semibold mb-2">Orders In Production</p>
            <p className="text-4xl font-bold text-blue-600">{orders.filter(o => o.status === 'in production').length}</p>
          </div>

          <div className="card p-6 bg-gradient-to-br from-yellow-50 to-yellow-100">
            <p className="text-gray-600 text-sm font-semibold mb-2">Inventory Items</p>
            <p className="text-4xl font-bold text-yellow-600">{totalInventory}</p>
          </div>

          <div className="card p-6 bg-gradient-to-br from-orange-50 to-orange-100">
            <p className="text-gray-600 text-sm font-semibold mb-2">Low Stock Alerts</p>
            <p className="text-4xl font-bold text-orange-600">{lowStockCount}</p>
          </div>
        </div>

        {/* Customer Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <p className="text-gray-600 text-sm font-semibold mb-2">Total Customers</p>
            <p className="text-3xl font-bold text-secondary">{insights?.totalCustomers || 0}</p>
          </div>

          <div className="card p-6">
            <p className="text-gray-600 text-sm font-semibold mb-2">Retention Rate</p>
            <p className="text-3xl font-bold text-accent">{insights?.customerRetentionRate || 0}%</p>
          </div>

          <div className="card p-6">
            <p className="text-gray-600 text-sm font-semibold mb-2">New This Month</p>
            <p className="text-3xl font-bold text-green-600">{insights?.newCustomersThisMonth || 0}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Popular Sizes */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Demand by Size</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sizesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Popular Fabrics */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Fabric Preference</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fabricsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {fabricsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Popular Fits */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Fit Preference</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fitsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#EC4899" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Popular Colors */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Color Preference</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={colorsData.slice(0, 5)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {colorsData.slice(0, 5).map((entry, index) => (
                    <Cell key={`cell-color-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Products Table */}
        <div className="card p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Products Inventory</h3>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Stock</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const lowStock = product.stock <= 5;
                  return (
                    <tr key={product._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{product.name}</td>
                      <td className="px-4 py-2">{product.category}</td>
                      <td className="px-4 py-2">₹{product.basePrice}</td>
                      <td className="px-4 py-2">{product.stock}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${lowStock ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                          {product.stock <= 0 ? 'Out of Stock' : lowStock ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={async () => {
                            const newStock = parseInt(prompt('Enter new stock quantity', product.stock));
                            if (isNaN(newStock) || newStock < 0) return;
                            try {
                              await productService.updateStock(product._id, newStock);
                              const res = await productService.getProducts();
                              setProducts(res.data);
                              alert('Stock updated');
                            } catch (err) {
                              console.error(err);
                              alert('Failed updating stock');
                            }
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Orders Chart */}
        {analytics?.monthlyOrders && analytics.monthlyOrders.length > 0 && (
          <div className="card p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Monthly Orders</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.monthlyOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent Orders */}
        <div className="card p-6">
          <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Order ID</th>
                  <th className="px-4 py-2 text-left font-semibold">Customer</th>
                  <th className="px-4 py-2 text-left font-semibold">Specs</th>
                  <th className="px-4 py-2 text-left font-semibold">Amount</th>
                  <th className="px-4 py-2 text-left font-semibold">Status</th>
                  <th className="px-4 py-2 text-left font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">{order.orderId}</td>
                    <td className="px-4 py-3">{order.userId?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-xs">
                      {order.size} • {order.fabric} • {order.color}
                    </td>
                    <td className="px-4 py-3 font-bold text-green-600">₹{order.totalPrice}</td>
                    <td className="px-4 py-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
