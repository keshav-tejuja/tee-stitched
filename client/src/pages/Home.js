import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { productService } from '../services/api';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { addToCart, wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
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

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      alert('Product is out of stock.');
      return;
    }
    addToCart({
      ...product,
      quantity: 1,
      totalPrice: product.basePrice,
      id: product._id,
    });
    alert('Added to cart');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen flex-col">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
        <p className="text-xl text-gray-600 font-semibold">Server waking up, please wait...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <section className="bg-white py-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
            <div>
              <h1 className="text-5xl font-bold">Stitched - Wear Your Story</h1>
              <p className="text-gray-600 mt-4">Discover curated custom tees with true handcrafted details, rich textures, and premium comfort.</p>
              {isAuthenticated ? (
                <button onClick={() => navigate('/customize')} className="btn-primary mt-4">Start Designing</button>
              ) : (
                <button onClick={() => navigate('/register')} className="btn-primary mt-4">Sign Up</button>
              )}
            </div>
            <div className="hidden lg:block">
              <img src="https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg" alt="banner" className="rounded-lg w-full h-[300px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Trending Collection</h2>
          <div className="space-x-2">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-lg ${activeCategory === cat ? 'bg-secondary text-white' : 'bg-gray-200'}`}
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
              : '0.0';

            return (
              <div key={product._id} className="card p-4 flex flex-col justify-between">
                <img src={product.image} alt={product.name} className="h-44 w-full object-cover rounded-lg mb-3" />
                <div className="mb-3">
                  <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                  <p className="text-xl font-bold text-secondary">₹{product.basePrice}</p>
                  <p className="text-xs text-gray-500 mb-1">{product.category} | {product.sizes.join(', ')}</p>
                  <p className="text-sm font-semibold">
                    {product.stock <= 0 ? 'Out of Stock' : product.stock < 5 ? `Only ${product.stock} left` : 'In Stock'}
                  </p>
                  <p className="text-sm mt-2 flex items-center gap-1">
                    ⭐ {avgRating} ({product.reviewsData?.length || 0} reviews)
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="btn-secondary flex-1"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock <= 0}
                    className="btn-primary flex-1 disabled:opacity-50"
                  >
                    Add to Cart
                  </button>
                </div>
                <button
                  onClick={() => isInWishlist(product._id) ? removeFromWishlist(product._id) : addToWishlist(product)}
                  className="mt-3 text-sm text-center p-2 rounded-lg border border-gray-300"
                >
                  {isInWishlist(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
              </div>
            );
          })}
        </div>

        {error && <div className="text-red-600 mt-4">{error}</div>}
      </section>
    </div>
  );
};

export default Home;
