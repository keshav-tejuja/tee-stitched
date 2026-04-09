import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import { CartContext } from '../context/CartContext';
import { getReviewsForProduct } from '../data/reviewsData';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [questionText, setQuestionText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await productService.getProduct(id);
        setProduct(res.data);
      } catch (err) {
        console.error("API Error:", err);
        setError('Server waking up, please wait... (If the issue persists, refresh the page)');
      }
    };
    loadProduct();
  }, [id]);

  if (!product && !error) {
    return (
      <div className="flex justify-center items-center h-screen flex-col">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
        <p className="text-xl text-gray-600 font-semibold">Server waking up, please wait...</p>
      </div>
    );
  }

  // Use the shared data for reviews
  const displayReviews = product.reviewsData?.length > 0 
    ? product.reviewsData 
    : getReviewsForProduct(product._id || id);

  const averageRating = displayReviews.length > 0
    ? (displayReviews.reduce((sum, r) => sum + r.rating, 0) / displayReviews.length).toFixed(1)
    : '0.0';

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      alert('Product is out of stock');
      return;
    }
    if (quantity < 1) {
      alert('Quantity must be at least 1');
      return;
    }
    addToCart({ ...product, id: product._id, quantity, totalPrice: product.basePrice });
    alert('Added to cart');
    navigate('/cart');
  };

  const sanitizeInput = (text) => text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();

  const handleReviewSubmit = () => {
    if (!reviewText.trim()) {
      alert('Input cannot be empty');
      return;
    }
    const cleanReview = sanitizeInput(reviewText);
    if (!cleanReview) {
      alert('Invalid input');
      return;
    }
    const newReview = {
      userId: 'You',
      rating: Number(reviewRating),
      comment: cleanReview,
      createdAt: 'Just now',
    };
    setProduct({ ...product, reviewsData: [newReview, ...(product.reviewsData || [])] });
    setReviewText('');
    alert('Review added (Sanitized)');
  };

  const handleQuestionSubmit = () => {
    if (!questionText.trim()) {
      alert('Input cannot be empty');
      return;
    }
    const cleanQuestion = sanitizeInput(questionText);
    if (!cleanQuestion) {
      alert('Invalid input');
      return;
    }
    const newQA = { q: cleanQuestion, a: 'Thank you for the question! Our team will respond within 24 hours.' };
    setProduct({ ...product, qa: [newQA, ...(product.qa || [])] });
    setQuestionText('');
    alert('Question submitted (Sanitized)');
  };

  const recommended = product.category
    ? (product.recommended || []).concat([])
    : [];

  // local fallback if API doesn't provide recommended list
  const MOCK_RECOMMENDATIONS = [
    { name: 'Classic Solid Polo', category: product.category || 'Polo', price: '₹999' },
    { name: 'Premium Oxford Shirt', category: 'Shirts', price: '₹1499' },
    { name: 'Everyday V-Neck', category: 'T-Shirts', price: '₹799' },
    { name: 'Activewear Blend Tee', category: 'Sports', price: '₹899' },
  ];
  const displayRecommended = recommended.length > 0 ? recommended : MOCK_RECOMMENDATIONS;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Promotional Banner (7P Marketing) */}
        <div className="bg-indigo-600 text-white text-center py-2 px-4 rounded-lg mb-6 font-semibold shadow-sm animate-pulse-slow">
          🎉 Special Offer: Buy 2 Get 1 Free on all custom orders! Use code <span className="bg-white text-indigo-700 px-2 py-0.5 rounded ml-1">STITCHED25</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 card p-6">
            <div className="flex gap-6 flex-col md:flex-row">
              <div className="w-full md:w-1/2">
                <img src={product.image} alt={product.name} className="w-full h-96 object-cover rounded shadow-md" />
              </div>
              <div className="w-full md:w-1/2">
                <div className="flex justify-between items-start mb-2">
                  <h1 className="text-3xl font-bold">{product.name}</h1>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">Trusted by 10k+</span>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm text-gray-500 flex-1">Category: {product.category}</p>
                  <p className="text-sm font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">🏷️ Vendor: Stitched Premium Hub</p>
                </div>

                <p className="text-xl text-secondary font-bold mb-2">₹{product.basePrice}</p>
                <p className="text-sm mb-4 text-gray-700 leading-relaxed">{product.description}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <p className="text-sm font-semibold">
                    Stock: <span className={`${product.stock <= 0 ? 'text-red-600' : product.stock < 5 ? 'text-orange-600 bg-orange-50 px-2 py-1 rounded font-bold' : 'text-green-600'}`}>
                      {product.stock <= 0 ? 'Out of Stock' : product.stock < 5 ? `⚠️ Low Stock! Only ${product.stock} left` : 'In Stock'}
                    </span>
                  </p>
                  <p className="text-sm flex items-center gap-1">
                    <span className="text-yellow-500 font-bold">{averageRating} ★</span> 
                    <span className="text-gray-500 underline cursor-pointer hover:text-indigo-600">({displayReviews.length} reviews)</span>
                  </p>
                </div>

                <div className="mb-4">
                  <label className="font-semibold mr-2">Qty:</label>
                  <input className="input-field w-20 inline" type="number" min="1" max="20" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
                </div>

                <div className="flex gap-2 mb-2">
                  <button onClick={handleAddToCart} disabled={product.stock <= 0} className="btn-primary">Add to Cart</button>
                  <button
                    onClick={() => isInWishlist(product._id) ? removeFromWishlist(product._id) : addToWishlist(product)}
                    className="btn-secondary"
                  >
                    {isInWishlist(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">Customization</h2>
            <p className="text-gray-700 mb-6">Choose size, color, and fabric from product page then head to Customize to design details.</p>
            <button className="btn-primary w-full" onClick={() => navigate('/customize')}>Go to Customize</button>
          </div>
        </div>

        {/* Review section */}
        <div className="card p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Reviews</h2>
            <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">✅ Input Validated & Sanitized</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="number" min="1" max="5" value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))} className="input-field" placeholder="Rating (1-5)" />
            <input value={reviewText} onChange={(e) => setReviewText(e.target.value)} className="input-field" placeholder="Write your review" />
          </div>
          <button onClick={handleReviewSubmit} className="btn-primary">Submit Review</button>

          {displayReviews.length > 0 ? (
            <div className="mt-6 space-y-3">
              {displayReviews.map((review, idx) => (
                <div key={idx} className="border rounded p-4 bg-white shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-gray-800">{review.userId} <span className="text-yellow-500 ml-1">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span></p>
                    {/* Map either reason or reasonTag */}
                    {(review.reasonTag || review.reason) && (
                      <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
                        {review.reasonTag || review.reason}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{review.comment}</p>
                  <p className="text-xs text-gray-400">{review.createdAt}</p>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500 mt-4">No reviews yet.</p>}
        </div>

        {/* Q&A section */}
        <div className="card p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Q&A</h2>
            <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">✅ Input Validated & Sanitized</span>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="input-field flex-1"
              placeholder="Ask a question about this product"
            />
            <button onClick={handleQuestionSubmit} className="btn-primary">Submit</button>
          </div>

          <div className="space-y-3">
            {product.qa && product.qa.length > 0 ? product.qa.map((qaItem, idx) => (
              <div key={idx} className="border rounded p-3">
                <p><strong>Q:</strong> {qaItem.q}</p>
                <p><strong>A:</strong> {qaItem.a}</p>
              </div>
            )) : <p className="text-gray-500">No questions yet.</p>}
          </div>
        </div>

        {/* Recommendations */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold mb-4">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* fallback product cards are available through home grid, to avoid repeated fetch timing wait we show existing static in product object if available */}
            {displayRecommended.map((item, idx) => (
              <div key={idx} className="border border-gray-200 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition cursor-pointer text-center flex flex-col items-center justify-center h-32">
                <p className="font-semibold text-gray-800 mb-1">{item.name}</p>
                <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                {item.price && <p className="text-indigo-600 font-bold">{item.price}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
    </div>
  );
};

export default ProductDetails;
