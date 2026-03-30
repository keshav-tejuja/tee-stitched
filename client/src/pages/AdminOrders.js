import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { orderService } from '../services/api';

const statusOptions = [
  'pending',
  'in production',
  'stitching',
  'ready for dispatch',
  'delivered',
];

const statusBadge = (status) => {
  const map = {
    pending: 'bg-yellow-100 text-yellow-800',
    'in production': 'bg-blue-100 text-blue-800',
    stitching: 'bg-purple-100 text-purple-800',
    'ready for dispatch': 'bg-orange-100 text-orange-800',
    delivered: 'bg-green-100 text-green-800',
  };
  return map[status] || 'bg-gray-100 text-gray-800';
};

const AdminOrders = () => {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await orderService.getAllOrders();
      setOrders(res.data);
      setFiltered(res.data);
      // reapply current filter criteria
      handleFilter();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilter = async () => {
    try {
      const params = {};
      if (statusFilter && statusFilter !== 'all') params.status = statusFilter;
      if (searchTerm.trim()) params.search = searchTerm;
      const res = await orderService.getAllOrders(params);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(handleFilter, [statusFilter, searchTerm]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const openDetails = (order) => {
    setSelected(order);
    setShowModal(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Orders Management</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          className="border px-3 py-2 rounded"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          {statusOptions.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search by Order ID or Customer"
          className="border px-3 py-2 rounded flex-1"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-left">Specs</th>
              <th className="px-4 py-2 text-left">Qty</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Est. Delivery</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">
                  <button onClick={() => openDetails(order)} className="text-blue-600 underline">
                    {order.orderId}
                  </button>
                </td>
                <td className="px-4 py-3">{order.userId?.name || ''}</td>
                <td className="px-4 py-3">Custom Stitched T-Shirt</td>
                <td className="px-4 py-3 text-xs">
                  {order.size} • {order.fabric} • {order.color}
                </td>
                <td className="px-4 py-3">{order.quantity}</td>
                <td className="px-4 py-3 text-xs">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-xs">
                  {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : '-'}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(order.status)}`}> 
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    className="border px-2 py-1 rounded"
                    value={order.status}
                    onChange={e => handleStatusChange(order._id, e.target.value)}
                  >
                    {statusOptions.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* details modal */}
      {showModal && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg">
            <h3 className="text-xl font-bold mb-4">Order Details</h3>
            <p><strong>Order ID:</strong> {selected.orderId}</p>
            <p><strong>Customer:</strong> {selected.userId?.name}</p>
            <p><strong>Size:</strong> {selected.size}</p>
            <p><strong>Fabric:</strong> {selected.fabric}</p>
            <p><strong>Color:</strong> {selected.color}</p>
            <p><strong>Quantity:</strong> {selected.quantity}</p>
            <p><strong>Status:</strong> {selected.status}</p>
            <p><strong>Ordered:</strong> {new Date(selected.createdAt).toLocaleString()}</p>
            <p><strong>Estimated Delivery:</strong> {selected.estimatedDelivery ? new Date(selected.estimatedDelivery).toLocaleDateString() : '-'} </p>
            <div className="mt-4 text-right">
              <button onClick={() => setShowModal(false)} className="btn-primary">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;