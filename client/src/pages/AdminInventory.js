import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { inventoryService } from '../services/api';
import Toast from '../components/Toast';

const AdminInventory = () => {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState(null);
  const [newItem, setNewItem] = useState({
    itemId: '',
    materialType: '',
    color: '',
    stockQuantity: '',
    minimumThreshold: '',
  });

  const navigate = useNavigate();
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await inventoryService.getInventory();
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const computeStatus = (qty, min) => {
    if (qty < 20) return 'Critical';
    if (qty < min) return 'Low Stock';
    return 'In Stock';
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newItem,
        stockQuantity: Number(newItem.stockQuantity),
        minimumThreshold: Number(newItem.minimumThreshold),
      };
      await inventoryService.addItem(payload);
      setNewItem({ itemId: '', materialType: '', color: '', stockQuantity: '', minimumThreshold: '' });
      fetchItems();
      setToast({ message: 'Material added successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to add material', type: 'error' });
    }
  };

  const handleUpdateStock = async (id) => {
    const qty = prompt('Enter new stock quantity');
    if (qty === null) return;
    try {
      await inventoryService.updateStock(id, Number(qty));
      fetchItems();
      setToast({ message: 'Stock updated!', type: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to update stock', type: 'error' });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary">Inventory Management</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage raw materials and supplies</p>
      </div>

      {/* Add Material Form */}
      <div className="card p-5 mb-6">
        <h3 className="font-semibold text-primary text-sm mb-4">Add New Material</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <input type="text" placeholder="Item ID" className="input-field" value={newItem.itemId} onChange={e => setNewItem({ ...newItem, itemId: e.target.value })} required />
          <input type="text" placeholder="Material Type" className="input-field" value={newItem.materialType} onChange={e => setNewItem({ ...newItem, materialType: e.target.value })} required />
          <input type="text" placeholder="Color" className="input-field" value={newItem.color} onChange={e => setNewItem({ ...newItem, color: e.target.value })} required />
          <input type="number" placeholder="Stock Qty" className="input-field" value={newItem.stockQuantity} onChange={e => setNewItem({ ...newItem, stockQuantity: e.target.value })} required />
          <input type="number" placeholder="Min Threshold" className="input-field" value={newItem.minimumThreshold} onChange={e => setNewItem({ ...newItem, minimumThreshold: e.target.value })} required />
          <button type="submit" className="btn-primary">Add Material</button>
        </form>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Item ID', 'Material', 'Color', 'Stock', 'Threshold', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const status = computeStatus(item.stockQuantity, item.minimumThreshold);
                const badgeClass = status === 'Critical' ? 'badge-red' : status === 'Low Stock' ? 'badge-yellow' : 'badge-green';
                return (
                  <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-medium text-primary">{item.itemId}</td>
                    <td className="px-5 py-4 text-gray-600">{item.materialType}</td>
                    <td className="px-5 py-4 capitalize text-gray-600">{item.color}</td>
                    <td className="px-5 py-4 font-semibold">{item.stockQuantity}</td>
                    <td className="px-5 py-4 text-gray-500">{item.minimumThreshold}</td>
                    <td className="px-5 py-4">
                      <span className={`badge ${badgeClass} text-[10px]`}>{status}</span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleUpdateStock(item._id)}
                        className="text-sm text-secondary hover:underline font-medium"
                      >
                        Update Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminInventory;
