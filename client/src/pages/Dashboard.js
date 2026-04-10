import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { NotificationContext } from '../context/NotificationContext';
import { orderService, designService, userService } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const { cart, wishlist, removeFromWishlist } = useContext(CartContext);
  const { notifications } = useContext(NotificationContext);
  const [orders, setOrders] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [ordersRes, designsRes, pointsRes] = await Promise.all([
          orderService.getUserOrders(),
          designService.getUserDesigns(),
          userService.getUserLoyaltyPoints(),
        ]);

        setOrders(ordersRes.data);
        setDesigns(designsRes.data);
        setLoyaltyPoints(pointsRes.data.loyaltyPoints);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate]);

  const handleDeleteDesign = async (designId) => {
    if (!window.confirm('Are you sure you want to delete this design?')) return;

    try {
      await designService.deleteDesign(designId);
      setDesigns(designs.filter((d) => d._id !== designId));
    } catch (error) {
      console.error('Error deleting design:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'badge-yellow',
      'in production': 'badge-blue',
      stitching: 'badge-purple',
      'ready for dispatch': 'bg-orange-50 text-orange-700 border border-orange-200',
      delivered: 'badge-green',
      cancelled: 'badge-red',
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-surface">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-primary animate-pulse"></div>
          <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-secondary/30 animate-ping"></div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'orders', label: 'Orders', count: orders.length },
    { id: 'designs', label: 'Designs', count: designs.length },
    { id: 'wishlist', label: 'Wishlist', count: wishlist.length },
  ];

  return (
    <div className="min-h-screen bg-surface py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-primary">My Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.name}!</p>
        </div>

        {/* Cart/Wishlist Reminder */}
        {(cart.length > 0 || wishlist.length > 0) && (
          <div className="card p-4 mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏰</span>
                <div>
                  <p className="text-sm font-semibold text-amber-800">Items waiting for you!</p>
                  <p className="text-xs text-amber-600">
                    {cart.length > 0 && `${cart.length} item${cart.length > 1 ? 's' : ''} in your cart. `}
                    {wishlist.length > 0 && `${wishlist.length} item${wishlist.length > 1 ? 's' : ''} in your wishlist.`}
                  </p>
                </div>
              </div>
              <button onClick={() => navigate(cart.length > 0 ? '/cart' : '/')} className="btn-primary !py-2 !px-4 text-xs !bg-amber-600 hover:!bg-amber-700">
                View Items
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
          <div className="card p-5">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total Orders</p>
            <p className="text-3xl font-bold text-primary mt-1">{orders.length}</p>
          </div>
          <div className="card p-5">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Wishlist</p>
            <p className="text-3xl font-bold text-primary mt-1">{wishlist.length}</p>
          </div>
          <div className="card p-5">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Saved Designs</p>
            <p className="text-3xl font-bold text-primary mt-1">{designs.length}</p>
          </div>
          <div className="card p-5 bg-gradient-to-br from-secondary to-indigo-600 text-white border-0">
            <p className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">Loyalty Points</p>
            <p className="text-3xl font-bold mt-1">{loyaltyPoints}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit animate-fade-in">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="animate-fade-in">
            {orders.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📦</span>
                </div>
                <p className="font-semibold text-gray-800 mb-2">No orders yet</p>
                <p className="text-sm text-gray-500 mb-4">Start with your first custom tee!</p>
                <button onClick={() => navigate('/customize')} className="btn-primary">Design Your First T-Shirt</button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="card p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-primary">{order.orderId}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <span className={`badge ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-xs text-gray-400">Specifications</p>
                        <p className="font-medium text-gray-700 mt-0.5">
                          {order.size} • {order.color} • {order.fabric} ({order.fit})
                        </p>
                        {order.estimatedDelivery && (
                          <p className="text-xs text-gray-400 mt-1">
                            Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Total</p>
                        <p className="text-lg font-bold text-primary">₹{order.totalPrice}</p>
                      </div>
                    </div>

                    {/* Status Tracker */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between text-xs">
                        {['Placed', 'Packed', 'Shipped', 'Delivered'].map((step, idx) => {
                          const statusOrder = ['pending', 'in production', 'ready for dispatch', 'delivered'];
                          const currentIndex = statusOrder.includes(order.status) 
                            ? statusOrder.indexOf(order.status) 
                            : (order.status === 'stitching' ? 1 : 0);
                          const filled = idx <= currentIndex;
                          return (
                            <div key={step} className="flex items-center flex-1">
                              <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${
                                  filled ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-400'
                                }`}>
                                  {idx === 0 ? '📦' : idx === 1 ? '🏷️' : idx === 2 ? '🚚' : '✅'}
                                </div>
                                <span className={`mt-1.5 font-medium ${filled ? 'text-secondary' : 'text-gray-400'}`}>{step}</span>
                              </div>
                              {idx < 3 && (
                                <div className={`flex-1 h-0.5 mx-1 rounded-full ${filled ? 'bg-secondary' : 'bg-gray-200'}`}></div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
                      Shipping to: {order.shippingAddress?.city}, {order.shippingAddress?.state}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Designs Tab */}
        {activeTab === 'designs' && (
          <div className="animate-fade-in">
            {designs.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✏️</span>
                </div>
                <p className="font-semibold text-gray-800 mb-2">No saved designs</p>
                <p className="text-sm text-gray-500 mb-4">Create and save your custom designs</p>
                <button onClick={() => navigate('/customize')} className="btn-primary">Create Your First Design</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {designs.map((design) => (
                  <div key={design._id} className="card overflow-hidden group">
                    <div className="h-40 flex items-center justify-center" style={{ backgroundColor: design.color }}>
                      <p className="text-white text-sm font-bold uppercase tracking-wider opacity-80">{design.fabric}</p>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-primary mb-2">{design.name}</h3>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                        <p><span className="font-medium text-gray-700">Fabric:</span> {design.fabric}</p>
                        <p><span className="font-medium text-gray-700">Size:</span> {design.size}</p>
                        <p><span className="font-medium text-gray-700">Fit:</span> {design.fit}</p>
                        <p><span className="font-medium text-gray-700">Saved:</span> {new Date(design.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => navigate('/customize')} className="flex-1 btn-secondary text-xs !py-2">
                          Use Design
                        </button>
                        <button
                          onClick={() => handleDeleteDesign(design._id)}
                          className="px-3 py-2 text-xs text-red-500 hover:bg-red-50 rounded-xl transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div className="animate-fade-in">
            {wishlist.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❤️</span>
                </div>
                <p className="font-semibold text-gray-800 mb-2">Your wishlist is empty</p>
                <p className="text-sm text-gray-500 mb-4">Browse and save items you love</p>
                <button onClick={() => navigate('/')} className="btn-primary">Browse Products</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {wishlist.map((item) => (
                  <div key={item._id} className="card overflow-hidden group">
                    <div className="overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-primary text-sm">{item.name}</h3>
                      <p className="text-lg font-bold text-primary mt-1">₹{item.basePrice}</p>
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => navigate(`/product/${item._id}`)} className="flex-1 btn-primary text-xs !py-2">
                          View Product
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item._id)}
                          className="px-3 py-2 text-xs text-red-500 hover:bg-red-50 rounded-xl transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
