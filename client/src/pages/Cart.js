import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import Toast from '../components/Toast';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, getTotalPrice } = useContext(CartContext);
  const [toast, setToast] = useState(null);

  const handleRemove = (id, name) => {
    removeFromCart(id);
    setToast({ message: `${name || 'Item'} removed from cart`, type: 'info' });
  };

  return (
    <div className="min-h-screen bg-surface py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Shopping Cart</h1>
          <p className="text-sm text-gray-500 mt-1">{cart.length} item{cart.length !== 1 ? 's' : ''} in your bag</p>
        </div>

        {cart.length === 0 ? (
          <div className="card p-12 text-center animate-fade-in">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-800 mb-2">Your cart is empty</p>
            <p className="text-sm text-gray-500 mb-6">Time to fill it with something amazing</p>
            <button onClick={() => navigate('/customize')} className="btn-primary">
              Start Designing →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="card p-5 flex gap-4 items-center animate-fade-in group">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full rounded-xl" style={{ backgroundColor: item.color || '#e5e7eb' }}></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-primary text-sm">{item.name || 'Custom T-Shirt'}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.fabric && `${item.fabric} • `}{item.color && `${item.color} • `}Size {item.size || 'M'}{item.fit && ` • ${item.fit}`}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                      <span className="text-sm font-bold text-primary">₹{item.totalPrice * item.quantity}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id, item.name)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="card p-6 h-fit sticky top-24">
              <h2 className="text-lg font-bold text-primary mb-5">Order Summary</h2>
              
              <div className="space-y-3 mb-5 pb-5 border-b border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">₹{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-emerald-600">Free</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-primary mb-6">
                <span>Total</span>
                <span>₹{getTotalPrice()}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full mb-3 !py-3"
              >
                Proceed to Checkout →
              </button>
              
              <button
                onClick={() => navigate('/customize')}
                className="btn-secondary w-full"
              >
                Continue Shopping
              </button>

              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure checkout powered by Razorpay
              </div>
            </div>
          </div>
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Cart;
