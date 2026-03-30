import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { inventoryService } from '../services/api';

const AdminInventory = () => {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);
  const [items, setItems] = useState([]);
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStock = async (id) => {
    const qty = prompt('Enter new stock quantity');
    if (qty === null) return;
    try {
      await inventoryService.updateStock(id, Number(qty));
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>

      <form onSubmit={handleAdd} className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Item ID"
          className="border px-3 py-2 rounded"
          value={newItem.itemId}
          onChange={e => setNewItem({ ...newItem, itemId: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Material Type"
          className="border px-3 py-2 rounded"
          value={newItem.materialType}
          onChange={e => setNewItem({ ...newItem, materialType: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Color"
          className="border px-3 py-2 rounded"
          value={newItem.color}
          onChange={e => setNewItem({ ...newItem, color: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Stock Quantity"
          className="border px-3 py-2 rounded"
          value={newItem.stockQuantity}
          onChange={e => setNewItem({ ...newItem, stockQuantity: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Minimum Threshold"
          className="border px-3 py-2 rounded"
          value={newItem.minimumThreshold}
          onChange={e => setNewItem({ ...newItem, minimumThreshold: e.target.value })}
          required
        />
        <button type="submit" className="btn-primary ml-auto">
          Add Material
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2 text-left">Item ID</th>
              <th className="px-4 py-2 text-left">Material</th>
              <th className="px-4 py-2 text-left">Color</th>
              <th className="px-4 py-2 text-left">Stock</th>
              <th className="px-4 py-2 text-left">Threshold</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const status = computeStatus(item.stockQuantity, item.minimumThreshold);
              const badgeColor =
                status === 'Critical'
                  ? 'bg-red-100 text-red-800'
                  : status === 'Low Stock'
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-green-100 text-green-800';
              return (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{item.itemId}</td>
                  <td className="px-4 py-3">{item.materialType}</td>
                  <td className="px-4 py-3 capitalize">{item.color}</td>
                  <td className="px-4 py-3">{item.stockQuantity}</td>
                  <td className="px-4 py-3">{item.minimumThreshold}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>{status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleUpdateStock(item._id)}
                      className="text-blue-600 underline"
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
  );
};

export default AdminInventory;
