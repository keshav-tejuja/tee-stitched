import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { orderService } from '../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, checkout, setCheckout, clearCart, getTotalPrice } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleAddressChange = (field, value) => {
    setCheckout({
      ...checkout,
      shippingAddress: {
        ...checkout.shippingAddress,
        [field]: value,
      },
    });
  };

  const handlePlaceOrder = async () => {
    // Validate shipping address
    if (!Object.values(checkout.shippingAddress).every(v => v)) {
      alert('Please fill in all shipping details');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const outOfStockItems = cart.filter(item => item.stock <= 0);
    if (outOfStockItems.length > 0) {
      alert(`Cannot place order. Out of stock: ${outOfStockItems.map(i => i.name).join(', ')}`);
      return;
    }

    // =========================================================
    // 👇 PASTE YOUR RAZORPAY TEST KEY ID HERE 👇
    // =========================================================
    const MY_TEST_KEY_ID = "rzp_test_SZ00ZKyveoJB7z";
    const amountInPaise = getTotalPrice() * 100;

    const options = {
      key: MY_TEST_KEY_ID,
      amount: amountInPaise.toString(),
      currency: "INR",
      name: "TeeStitch Store",
      description: "Test Payment",
      handler: async (response) => {
        console.log("✅ Payment Successful!");
        console.log("Payment ID:", response.razorpay_payment_id);

        setLoading(true);
        try {
          for (const item of cart) {
            await orderService.createOrder({
              productId: item._id || item.id || null,
              designId: item.id || new Date().getTime(),
              quantity: item.quantity,
              fabric: item.fabric,
              color: item.color,
              size: item.size,
              fit: item.fit,
              shippingAddress: checkout.shippingAddress,
            });
          }

          alert(`Payment Successful! Order placed.\nPayment ID: ${response.razorpay_payment_id}`);
          clearCart();
          navigate('/dashboard');
        } catch (error) {
          console.error('Error placing order:', error);
          alert('Payment was successful but there was an error saving your order. Please try again.');
        } finally {
          setLoading(false);
        }
      },
      theme: { color: "#3399cc" }
    };

    const rzp1 = new window.Razorpay(options);

    rzp1.on('payment.failed', function (response) {
      console.error("❌ Payment Failed!");
      console.error("Error Description:", response.error.description);
      alert(`Payment Failed!\nReason: ${response.error.description}`);
    });

    rzp1.open();
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-2xl mx-auto card p-8 text-center">
          <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/customize')}
            className="btn-primary"
          >
            Go Back to Customize
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Address */}
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Street Address</label>
                <input
                  type="text"
                  value={checkout.shippingAddress.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  className="input-field"
                  placeholder="Enter street address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">City</label>
                  <input
                    type="text"
                    value={checkout.shippingAddress.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="input-field"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">State</label>
                  <input
                    type="text"
                    value={checkout.shippingAddress.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    className="input-field"
                    placeholder="Enter state"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Zip Code</label>
                  <input
                    type="text"
                    value={checkout.shippingAddress.zipCode}
                    onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                    className="input-field"
                    placeholder="Enter zip code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Country</label>
                  <input
                    type="text"
                    value={checkout.shippingAddress.country}
                    onChange={(e) => handleAddressChange('country', e.target.value)}
                    className="input-field"
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-4 mb-6 pb-6 border-b">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.size} {item.color} {item.fabric} × {item.quantity}
                  </span>
                  <span className="font-semibold">₹{item.totalPrice * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{getTotalPrice()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>

            <div className="border-t pt-4 flex justify-between text-lg font-bold mb-6">
              <span>Total Amount</span>
              <span>₹{getTotalPrice()}</span>
            </div>

            <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
              <p className="text-sm font-semibold text-green-700 flex items-center gap-2 mb-1">
                🔒 Secure Payment (Simulated using Razorpay Test Mode)
              </p>
              <p className="text-sm text-green-600">
                You will be safely redirected. Please use test payment details.
              </p>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 py-3"
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
