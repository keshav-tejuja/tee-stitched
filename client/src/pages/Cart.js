import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, getTotalPrice } = useContext(CartContext);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/customize')}
              className="btn-primary"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {cart.map((item) => (
                <div key={item.id} className="card p-6 mb-4 flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      {item.fabric} • {item.color} • Size {item.size} • {item.fit}
                    </p>
                    <p className="text-sm font-semibold mt-2">
                      Qty: {item.quantity} × ₹{item.totalPrice}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="card p-6 h-fit">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4 pb-4 border-b">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold mb-6">
                <span>Total</span>
                <span>₹{getTotalPrice()}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full mb-2"
              >
                Proceed to Checkout
              </button>
              
              <button
                onClick={() => navigate('/customize')}
                className="btn-secondary w-full"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
