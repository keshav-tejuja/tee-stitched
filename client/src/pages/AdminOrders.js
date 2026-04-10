import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { orderService } from '../services/api';

const statusOptions = ['pending', 'in production', 'stitching', 'ready for dispatch', 'delivered'];

const statusBadge = (status) => {
  const map = {
    pending: 'badge-yellow',
    'in production': 'badge-blue',
    stitching: 'badge-purple',
    'ready for dispatch': 'bg-orange-50 text-orange-700 border border-orange-200',
    delivered: 'badge-green',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
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
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary">Orders Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">Track and manage all customer orders</p>
        </div>
        <span className="badge badge-blue text-[10px]">{filtered.length} orders</span>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <select
          className="input-field !w-auto"
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
          placeholder="Search by Order ID or Customer..."
          className="input-field flex-1"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Order ID', 'Customer', 'Product', 'Specs', 'Qty', 'Date', 'Est. Delivery', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <button onClick={() => openDetails(order)} className="text-secondary hover:underline font-semibold text-xs">
                      {order.orderId}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{order.userId?.name || ''}</td>
                  <td className="px-4 py-3 text-xs">Custom Tee</td>
                  <td className="px-4 py-3 text-[10px] text-gray-500">{order.size} • {order.fabric} • {order.color}</td>
                  <td className="px-4 py-3 text-xs">{order.quantity}</td>
                  <td className="px-4 py-3 text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-[10px] text-gray-400">{order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${statusBadge(order.status)} text-[10px]`}>{order.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="input-field !w-auto !py-1 !px-2 !text-xs"
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
      </div>

      {/* Details Modal */}
      {showModal && selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="card p-6 w-11/12 max-w-lg animate-scale-in" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-primary mb-4">Order Details</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-400">Order ID:</span> <span className="font-semibold">{selected.orderId}</span></p>
              <p><span className="text-gray-400">Customer:</span> <span className="font-semibold">{selected.userId?.name}</span></p>
              <p><span className="text-gray-400">Size:</span> <span className="font-semibold">{selected.size}</span></p>
              <p><span className="text-gray-400">Fabric:</span> <span className="font-semibold">{selected.fabric}</span></p>
              <p><span className="text-gray-400">Color:</span> <span className="font-semibold">{selected.color}</span></p>
              <p><span className="text-gray-400">Quantity:</span> <span className="font-semibold">{selected.quantity}</span></p>
              <p><span className="text-gray-400">Status:</span> <span className={`badge ${statusBadge(selected.status)} text-[10px] ml-1`}>{selected.status}</span></p>
              <p><span className="text-gray-400">Ordered:</span> <span className="font-semibold">{new Date(selected.createdAt).toLocaleString()}</span></p>
              <p><span className="text-gray-400">Est. Delivery:</span> <span className="font-semibold">{selected.estimatedDelivery ? new Date(selected.estimatedDelivery).toLocaleDateString() : '-'}</span></p>
            </div>
            <div className="mt-6 text-right">
              <button onClick={() => setShowModal(false)} className="btn-primary">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;