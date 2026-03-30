import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { orderService, designService, userService } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const { wishlist, removeFromWishlist } = useContext(CartContext);
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
      alert('Design deleted successfully');
    } catch (error) {
      console.error('Error deleting design:', error);
      alert('Error deleting design');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in production': 'bg-blue-100 text-blue-800',
      stitching: 'bg-purple-100 text-purple-800',
      'ready for dispatch': 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome, {user?.name}!</p>

        {/* Loyalty Points Card */}
        <div className="card p-6 mb-8 bg-gradient-to-r from-secondary to-indigo-700 text-white">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">Loyalty Points Balance</p>
            <p className="text-5xl font-bold">{loyaltyPoints}</p>
            <p className="text-sm mt-2">Earn points on every purchase!</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-4 font-semibold transition ${
              activeTab === 'orders'
                ? 'text-secondary border-b-2 border-secondary'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Order History
          </button>
          <button
            onClick={() => setActiveTab('designs')}
            className={`py-2 px-4 font-semibold transition ${
              activeTab === 'designs'
                ? 'text-secondary border-b-2 border-secondary'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Saved Designs
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`py-2 px-4 font-semibold transition ${
              activeTab === 'wishlist'
                ? 'text-secondary border-b-2 border-secondary'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Wishlist ({wishlist.length})
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
                <button
                  onClick={() => navigate('/customize')}
                  className="btn-primary"
                >
                  Design Your First T-Shirt
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="card p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{order.orderId}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-600">Specifications</p>
                        <p className="font-semibold">
                          {order.size} • {order.color} • {order.fabric} ({order.fit})
                        </p>
                        <p className="text-gray-600 text-xs mt-1">
                          Est. Delivery: {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Price</p>
                        <p className="font-semibold text-lg">₹{order.totalPrice}</p>
                      </div>
                    </div>

                    {/* status tracker */}
                    <div className="mb-4">
                      <p className="text-gray-600 text-sm mb-1">Progress</p>
                      <div className="flex items-center space-x-2 text-xs">
                        {['Order Placed', 'Production', 'Stitching', 'Ready', 'Delivered'].map((step, idx) => {
                          const stepStatus = step.toLowerCase().replace(/ /g, idx === 1 ? " in production" : '');
                          // determine if step is completed
                          const statusOrder = ['pending', 'in production', 'stitching', 'ready for dispatch', 'delivered'];
                          const currentIndex = statusOrder.indexOf(order.status);
                          const filled = idx <= currentIndex;
                          return (
                            <div key={step} className="flex items-center">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${filled ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'}`}>{idx+1}</div>
                              <span className={`ml-1 ${filled ? 'text-primary' : 'text-gray-500'}`}>{step}</span>
                              {idx < 4 && <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 pt-4 border-t">
                      <p>Shipping to: {order.shippingAddress.city}, {order.shippingAddress.state}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Designs Tab */}
        {activeTab === 'designs' && (
          <div>
            {designs.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-gray-600 mb-4">You haven't saved any designs yet</p>
                <button
                  onClick={() => navigate('/customize')}
                  className="btn-primary"
                >
                  Create Your First Design
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {designs.map((design) => (
                  <div key={design._id} className="card p-6">
                    <div className="mb-4">
                      <h3 className="font-bold text-lg mb-2">{design.name}</h3>
                      <div
                        className="w-full h-48 rounded-lg mb-4 flex items-center justify-center"
                        style={{ backgroundColor: design.color }}
                      >
                        <p className="text-white text-sm text-center px-4">
                          {design.fabric.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm space-y-1 mb-4">
                      <p><strong>Fabric:</strong> {design.fabric}</p>
                      <p><strong>Size:</strong> {design.size}</p>
                      <p><strong>Fit:</strong> {design.fit}</p>
                      <p><strong>Saved:</strong> {new Date(design.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate('/customize')}
                        className="flex-1 btn-secondary text-sm py-2"
                      >
                        Use This Design
                      </button>
                      <button
                        onClick={() => handleDeleteDesign(design._id)}
                        className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlist.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-gray-600 mb-4">Your wishlist is empty.</p>
                <button onClick={() => navigate('/')} className="btn-primary">Browse Products</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {wishlist.map((item) => (
                  <div key={item._id} className="card p-4 flex gap-4">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">₹{item.basePrice}</p>
                      <button
                        onClick={() => removeFromWishlist(item._id)}
                        className="text-red-600 text-sm mt-2"
                      >
                        Remove
                      </button>
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
