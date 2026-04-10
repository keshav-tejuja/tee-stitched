import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { productService } from '../services/api';
import Toast from '../components/Toast';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { cart, addToCart, wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const res = await productService.getProducts();
        setProducts(res.data);
      } catch (err) {
        console.error("API Error:", err);
        setError('Server waking up, please wait... (If the issue persists, refresh the page)');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const categories = ['All', 'Men', 'Women'];

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter((p) => p.category === activeCategory);

  // Recommendations based on cart items
  const getRecommendations = () => {
    if (cart.length === 0) return products.slice(0, 4);
    const cartCategories = [...new Set(cart.map(item => item.category).filter(Boolean))];
    const recommended = products.filter(p => cartCategories.includes(p.category) && !cart.find(c => c._id === p._id));
    return recommended.length > 0 ? recommended.slice(0, 4) : products.slice(0, 4);
  };

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      setToast({ message: 'Product is out of stock', type: 'error' });
      return;
    }
    addToCart({
      ...product,
      quantity: 1,
      totalPrice: product.basePrice,
      id: product._id,
    });
    setToast({ message: `${product.name} added to cart!`, type: 'success' });
  };

  const handleWishlistToggle = (product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      setToast({ message: 'Removed from wishlist', type: 'info' });
    } else {
      addToWishlist(product);
      setToast({ message: 'Added to wishlist ❤️', type: 'success' });
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setEmailSubmitted(true);
      setToast({ message: 'Coupon STITCH10 sent to your email! 🎉', type: 'success' });
      setEmail('');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen flex-col bg-surface">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-primary animate-pulse"></div>
          <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-secondary/30 animate-ping"></div>
        </div>
        <p className="text-sm text-gray-500 font-medium mt-6">Loading your experience...</p>
      </div>
    );
  }

  const recommendations = getRecommendations();

  return (
    <div className="min-h-screen bg-surface">
      {/* Cart/Wishlist Reminder Banner */}
      {isAuthenticated && (cart.length > 0 || wishlist.length > 0) && (
        <div className="bg-gradient-to-r from-secondary/10 to-indigo-50 border-b border-indigo-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
            <p className="text-sm text-indigo-700 font-medium">
              {cart.length > 0 && `🛒 You have ${cart.length} item${cart.length > 1 ? 's' : ''} in your cart. `}
              {wishlist.length > 0 && `❤️ ${wishlist.length} item${wishlist.length > 1 ? 's' : ''} in wishlist.`}
            </p>
            <button onClick={() => navigate(cart.length > 0 ? '/cart' : '/dashboard')} className="text-sm font-semibold text-secondary hover:underline">
              View →
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-medium mb-6 border border-white/10">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              New Collection Dropping Soon
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
              Wear Your<br />
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Story.</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-lg leading-relaxed">
              Premium custom-stitched streetwear designed by you. Bold prints, sustainable fabrics, crafted with purpose.
            </p>
            <div className="flex flex-wrap gap-3">
              {isAuthenticated ? (
                <button onClick={() => navigate('/customize')} className="bg-white text-primary font-bold py-3.5 px-8 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02]">
                  Start Designing →
                </button>
              ) : (
                <button onClick={() => navigate('/register')} className="bg-white text-primary font-bold py-3.5 px-8 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02]">
                  Join the Movement →
                </button>
              )}
              <button onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })} className="border border-white/30 text-white font-semibold py-3.5 px-8 rounded-xl hover:bg-white/10 transition-all duration-300">
                Browse Collection
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Email Subscription */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-primary">Get 10% Off Your First Order</h3>
              <p className="text-sm text-gray-600 mt-1">Subscribe and receive your exclusive discount code.</p>
            </div>
            {emailSubmitted ? (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-3 rounded-xl text-sm font-semibold border border-emerald-200">
                ✓ Coupon STITCH10 sent to your email!
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="flex gap-2 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field !rounded-xl flex-1 md:w-64"
                  required
                />
                <button type="submit" className="btn-primary !rounded-xl whitespace-nowrap">
                  Get Code
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section id="collection" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-primary">Trending Now</h2>
            <p className="text-sm text-gray-500 mt-1">Curated picks for the bold</p>
          </div>
          <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-600 hover:text-primary'
                }`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => {
            const avgRating = product.reviewsData?.length
              ? (product.reviewsData.reduce((sum, r) => sum + r.rating, 0) / product.reviewsData.length).toFixed(1)
              : '4.5';
            const isHovered = hoveredProduct === product._id;

            return (
              <div
                key={product._id}
                className="group card overflow-hidden animate-fade-in"
                onMouseEnter={() => setHoveredProduct(product._id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Image */}
                <div className="relative overflow-hidden bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Quick Actions Overlay */}
                  <div className={`absolute inset-0 bg-black/20 flex items-center justify-center gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                      disabled={product.stock <= 0}
                      className="bg-white text-primary px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100 transition transform hover:scale-105 disabled:opacity-50"
                    >
                      + Add to Cart
                    </button>
                  </div>
                  {/* Wishlist Heart */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleWishlistToggle(product); }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                  >
                    {isInWishlist(product._id) ? (
                      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    )}
                  </button>
                  {/* Stock Badge */}
                  {product.stock <= 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                      SOLD OUT
                    </div>
                  )}
                  {product.stock > 0 && product.stock < 5 && (
                    <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                      ONLY {product.stock} LEFT
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-sm text-primary leading-tight">{product.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0 ml-2">
                      <span className="text-amber-400">★</span>
                      <span>{avgRating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{product.category} • {product.sizes?.join(', ')}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-primary">₹{product.basePrice}</p>
                    <button
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="text-xs font-semibold text-secondary hover:underline"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {error && <div className="text-red-600 mt-4 text-center text-sm">{error}</div>}
      </section>

      {/* Recommendations */}
      {isAuthenticated && recommendations.length > 0 && (
        <section className="bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary">Recommended for You</h2>
              <p className="text-sm text-gray-500 mt-1">Based on your cart and browsing history</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendations.map(product => (
                <div
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="group card overflow-hidden cursor-pointer"
                >
                  <div className="overflow-hidden bg-gray-50">
                    <img src={product.image} alt={product.name} className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-primary truncate">{product.name}</p>
                    <p className="text-sm font-bold text-secondary mt-1">₹{product.basePrice}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to create something unique?</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">Design your custom tee in minutes. Premium quality, delivered to your door.</p>
          <button
            onClick={() => navigate(isAuthenticated ? '/customize' : '/register')}
            className="bg-white text-primary font-bold py-3.5 px-8 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02]"
          >
            {isAuthenticated ? 'Start Designing' : 'Create Account'}
          </button>
        </div>
      </section>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Home;
