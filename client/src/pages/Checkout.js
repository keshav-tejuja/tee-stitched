import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import { orderService } from '../services/api';
import Toast from '../components/Toast';

const COUPONS = {
  STITCH10: { discount: 10, label: '10% Off' },
  SAVE20: { discount: 20, label: '20% Off' },
  STITCHED25: { discount: 25, label: '25% Off' },
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, checkout, setCheckout, clearCart, getTotalPrice } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { triggerOrderNotifications } = useContext(NotificationContext);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const handleAddressChange = (field, value) => {
    setCheckout({
      ...checkout,
      shippingAddress: {
        ...checkout.shippingAddress,
        [field]: value,
      },
    });
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon({ code, ...COUPONS[code] });
      setToast({ message: `Coupon applied! ${COUPONS[code].label}`, type: 'success' });
    } else {
      setCouponError('Invalid coupon code');
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const subtotal = getTotalPrice();
  const discountAmount = appliedCoupon ? Math.round(subtotal * appliedCoupon.discount / 100) : 0;
  const finalTotal = subtotal - discountAmount;

  const handlePlaceOrder = async () => {
    if (!Object.values(checkout.shippingAddress).every(v => v)) {
      setToast({ message: 'Please fill in all shipping details', type: 'error' });
      return;
    }

    if (cart.length === 0) {
      setToast({ message: 'Your cart is empty', type: 'error' });
      return;
    }

    const outOfStockItems = cart.filter(item => item.stock <= 0);
    if (outOfStockItems.length > 0) {
      setToast({ message: `Cannot place order. Out of stock: ${outOfStockItems.map(i => i.name).join(', ')}`, type: 'error' });
      return;
    }

    const MY_TEST_KEY_ID = "rzp_test_SZ00ZKyveoJB7z";
    const amountInPaise = finalTotal * 100;

    const options = {
      key: MY_TEST_KEY_ID,
      amount: amountInPaise.toString(),
      currency: "INR",
      name: "STITCHED Store",
      description: "Premium Custom Streetwear",
      handler: async (response) => {
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

          // Trigger order lifecycle notifications
          const orderId = `ORD-${Date.now().toString().slice(-6)}`;
          triggerOrderNotifications(orderId);

          setToast({ message: `Payment successful! Order placed.`, type: 'success' });
          clearCart();
          setTimeout(() => navigate('/dashboard'), 2000);
        } catch (error) {
          console.error('Error placing order:', error);
          setToast({ message: 'Payment was successful but there was an error saving your order.', type: 'error' });
        } finally {
          setLoading(false);
        }
      },
      theme: { color: "#0a0a0a" }
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', function (response) {
      setToast({ message: `Payment Failed: ${response.error.description}`, type: 'error' });
    });
    rzp1.open();
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-surface py-8 px-4">
        <div className="max-w-2xl mx-auto card p-12 text-center animate-fade-in">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-800 mb-2">Your cart is empty</p>
          <p className="text-sm text-gray-500 mb-6">Add some items before checking out</p>
          <button onClick={() => navigate('/customize')} className="btn-primary">
            Go to Customize
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl font-bold text-primary">Checkout</h1>
          <span className="badge badge-green flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure Checkout
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Shipping Address */}
            <div className="card p-6 animate-fade-in">
              <h2 className="text-lg font-bold text-primary mb-5">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Street Address</label>
                  <input
                    type="text"
                    value={checkout.shippingAddress.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    className="input-field"
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">City</label>
                    <input type="text" value={checkout.shippingAddress.city} onChange={(e) => handleAddressChange('city', e.target.value)} className="input-field" placeholder="Mumbai" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">State</label>
                    <input type="text" value={checkout.shippingAddress.state} onChange={(e) => handleAddressChange('state', e.target.value)} className="input-field" placeholder="Maharashtra" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Zip Code</label>
                    <input type="text" value={checkout.shippingAddress.zipCode} onChange={(e) => handleAddressChange('zipCode', e.target.value)} className="input-field" placeholder="400001" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Country</label>
                    <input type="text" value={checkout.shippingAddress.country} onChange={(e) => handleAddressChange('country', e.target.value)} className="input-field" placeholder="India" />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-6 animate-fade-in">
              <h2 className="text-lg font-bold text-primary mb-5">Payment Method</h2>
              <div className="space-y-2">
                {[
                  { label: 'UPI (Google Pay, PhonePe, Paytm)', icon: '📱' },
                  { label: 'Credit / Debit Card', icon: '💳' },
                  { label: 'Net Banking', icon: '🏦' },
                ].map((method, idx) => (
                  <label key={idx} className="flex items-center gap-3 p-4 border border-gray-150 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all group">
                    <input type="radio" name="payment" defaultChecked={idx === 0} className="w-4 h-4 text-secondary accent-secondary" />
                    <span className="text-lg">{method.icon}</span>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-primary">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-2">
            <div className="card p-6 sticky top-24 animate-fade-in">
              <h2 className="text-lg font-bold text-primary mb-5">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-5 pb-5 border-b border-gray-100">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate pr-2">
                      {item.size} {item.color} {item.fabric} × {item.quantity}
                    </span>
                    <span className="font-semibold flex-shrink-0">₹{item.totalPrice * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="mb-5 pb-5 border-b border-gray-100">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Coupon Code</label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold text-sm">{appliedCoupon.code}</span>
                      <span className="text-xs text-emerald-600">({appliedCoupon.label})</span>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-xs text-red-500 hover:underline font-medium">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. STITCH10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="input-field flex-1 !py-2"
                    />
                    <button onClick={handleApplyCoupon} className="btn-secondary !py-2 !px-4 text-sm">
                      Apply
                    </button>
                  </div>
                )}
                {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-600">Discount ({appliedCoupon.label})</span>
                    <span className="text-emerald-600 font-semibold">-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex justify-between text-lg font-bold text-primary mb-6">
                <span>Total</span>
                <span>₹{finalTotal}</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl mb-5 border border-gray-100">
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  🔒 Secure payment via Razorpay (Test Mode). Use test card details.
                </p>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="btn-primary w-full !py-3.5 disabled:opacity-50 text-base"
              >
                {loading ? 'Processing...' : `Pay ₹${finalTotal}`}
              </button>
            </div>
          </div>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Checkout;
