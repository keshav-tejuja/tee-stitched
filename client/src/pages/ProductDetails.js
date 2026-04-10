import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import { CartContext } from '../context/CartContext';
import { getReviewsForProduct } from '../data/reviewsData';
import Toast from '../components/Toast';

const REVIEW_TAGS = ['Fit', 'Comfort', 'Quality', 'Design', 'Delivery', 'Value'];

const StarRating = ({ rating, onRate, size = 'lg' }) => {
  const [hover, setHover] = useState(0);
  const starSize = size === 'lg' ? 'w-7 h-7' : 'w-4 h-4';
  
  return (
    <div className="flex gap-0.5 star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate && onRate(star)}
          onMouseEnter={() => onRate && setHover(star)}
          onMouseLeave={() => onRate && setHover(0)}
          className={`star ${onRate ? 'cursor-pointer' : 'cursor-default'} transition-transform`}
        >
          <svg
            className={`${starSize} ${
              star <= (hover || rating) ? 'text-amber-400' : 'text-gray-200'
            } transition-colors`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTag, setReviewTag] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const [res, allRes] = await Promise.all([
          productService.getProduct(id),
          productService.getProducts(),
        ]);
        setProduct(res.data);
        setProducts(allRes.data);
      } catch (err) {
        console.error("API Error:", err);
        setError('Server waking up, please wait...');
      }
    };
    loadProduct();
  }, [id]);

  if (!product && !error) {
    return (
      <div className="flex justify-center items-center h-screen bg-surface">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-primary animate-pulse"></div>
          <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-secondary/30 animate-ping"></div>
        </div>
      </div>
    );
  }

  const displayReviews = product?.reviewsData?.length > 0 
    ? product.reviewsData 
    : getReviewsForProduct(product?._id || id);

  const averageRating = displayReviews.length > 0
    ? (displayReviews.reduce((sum, r) => sum + r.rating, 0) / displayReviews.length).toFixed(1)
    : '0.0';

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      setToast({ message: 'Product is out of stock', type: 'error' });
      return;
    }
    addToCart({ ...product, id: product._id, quantity, totalPrice: product.basePrice });
    setToast({ message: 'Added to cart! 🎉', type: 'success' });
    setTimeout(() => navigate('/cart'), 1000);
  };

  const sanitizeInput = (text) => text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();

  const handleReviewSubmit = () => {
    if (!reviewText.trim()) {
      setToast({ message: 'Please write a review', type: 'error' });
      return;
    }
    const cleanReview = sanitizeInput(reviewText);
    if (!cleanReview) {
      setToast({ message: 'Invalid input', type: 'error' });
      return;
    }
    const newReview = {
      userId: 'You',
      rating: Number(reviewRating),
      comment: cleanReview,
      reason: reviewTag || null,
      createdAt: 'Just now',
    };
    setProduct({ ...product, reviewsData: [newReview, ...(product.reviewsData || [])] });
    setReviewText('');
    setReviewRating(5);
    setReviewTag('');
    setToast({ message: 'Review added! ✨', type: 'success' });
  };

  const handleQuestionSubmit = () => {
    if (!questionText.trim()) {
      setToast({ message: 'Please enter a question', type: 'error' });
      return;
    }
    const cleanQuestion = sanitizeInput(questionText);
    if (!cleanQuestion) {
      setToast({ message: 'Invalid input', type: 'error' });
      return;
    }
    const newQA = { q: cleanQuestion, a: 'Thank you for the question! Our team will respond within 24 hours.' };
    setProduct({ ...product, qa: [newQA, ...(product.qa || [])] });
    setQuestionText('');
    setToast({ message: 'Question submitted!', type: 'success' });
  };

  // Recommendations based on category
  const recommendations = products
    .filter(p => p.category === product?.category && p._id !== product?._id)
    .slice(0, 4);

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: displayReviews.filter(r => r.rating === star).length,
    percent: displayReviews.length > 0 ? Math.round((displayReviews.filter(r => r.rating === star).length / displayReviews.length) * 100) : 0,
  }));

  return (
    <div className="min-h-screen bg-surface py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Promo Banner */}
        <div className="bg-gradient-to-r from-secondary/10 to-indigo-50 text-secondary text-center py-2.5 px-4 rounded-2xl mb-6 text-sm font-semibold border border-indigo-100 animate-fade-in">
          🎉 Use code <span className="bg-secondary text-white px-2.5 py-0.5 rounded-lg ml-1 text-xs">STITCH10</span> for 10% off your first order!
        </div>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10 animate-fade-in">
          {/* Image */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden">
              <img src={product?.image} alt={product?.name} className="w-full h-[400px] object-cover" />
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{product?.category}</p>
                <h1 className="text-2xl font-bold text-primary mt-1">{product?.name}</h1>
              </div>
              <span className="badge badge-green text-[10px]">Trusted by 10k+</span>
            </div>

            <div className="flex items-center gap-3 mt-3 mb-4">
              <StarRating rating={Math.round(Number(averageRating))} size="sm" />
              <span className="text-sm text-gray-500">{averageRating} ({displayReviews.length} reviews)</span>
            </div>

            <p className="text-2xl font-bold text-primary mb-3">₹{product?.basePrice}</p>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{product?.description}</p>

            {/* Stock */}
            <div className="mb-4">
              <span className={`badge ${product?.stock <= 0 ? 'badge-red' : product?.stock < 5 ? 'badge-yellow' : 'badge-green'}`}>
                {product?.stock <= 0 ? 'Out of Stock' : product?.stock < 5 ? `Only ${product?.stock} left` : 'In Stock'}
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-5">
              <label className="text-sm font-medium text-gray-600">Qty:</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">−</button>
                <span className="font-bold text-primary w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(20, quantity + 1))} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button onClick={handleAddToCart} disabled={product?.stock <= 0} className="btn-primary flex-1 disabled:opacity-50">
                Add to Cart
              </button>
              <button
                onClick={() => isInWishlist(product?._id) ? removeFromWishlist(product?._id) : addToWishlist(product)}
                className={`btn-secondary !px-4 ${isInWishlist(product?._id) ? 'text-red-500' : ''}`}
              >
                {isInWishlist(product?._id) ? '❤️' : '🤍'}
              </button>
            </div>

            <p className="text-[10px] text-gray-400 mt-3">🏷️ Vendor: Stitched Premium Hub</p>
          </div>

          {/* Customize CTA */}
          <div className="lg:col-span-1">
            <div className="card p-5 text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">✏️</span>
              </div>
              <h3 className="font-bold text-sm text-primary mb-2">Make it Yours</h3>
              <p className="text-xs text-gray-500 mb-4">Add custom text, pick colors, and more</p>
              <button className="btn-accent w-full text-sm" onClick={() => navigate('/customize')}>Customize →</button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Rating Summary */}
          <div className="card p-6 animate-fade-in">
            <h3 className="font-bold text-primary mb-4">Rating Summary</h3>
            <div className="text-center mb-4">
              <p className="text-4xl font-bold text-primary">{averageRating}</p>
              <StarRating rating={Math.round(Number(averageRating))} size="sm" />
              <p className="text-xs text-gray-400 mt-1">{displayReviews.length} reviews</p>
            </div>
            <div className="space-y-2">
              {ratingDistribution.map(({ star, count, percent }) => (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-3 text-gray-500">{star}</span>
                  <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${percent}%` }}></div>
                  </div>
                  <span className="w-6 text-right text-gray-400">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Write Review */}
          <div className="lg:col-span-2 card p-6 animate-fade-in">
            <h3 className="font-bold text-primary mb-4">Write a Review</h3>
            
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Your Rating</label>
              <StarRating rating={reviewRating} onRate={setReviewRating} />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tag (optional)</label>
              <div className="flex flex-wrap gap-1.5">
                {REVIEW_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setReviewTag(reviewTag === tag ? '' : tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      reviewTag === tag
                        ? 'bg-secondary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Your Review</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="input-field !h-24 resize-none"
                placeholder="Share your experience with this product..."
              />
            </div>

            <button onClick={handleReviewSubmit} className="btn-primary">
              Submit Review
            </button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="card p-6 mb-8 animate-fade-in">
          <h3 className="font-bold text-primary mb-4">Customer Reviews ({displayReviews.length})</h3>
          <div className="space-y-3">
            {displayReviews.map((review, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100/80 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-secondary to-indigo-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{review.userId?.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary">{review.userId}</p>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(review.reasonTag || review.reason) && (
                      <span className="badge badge-purple text-[10px]">{review.reasonTag || review.reason}</span>
                    )}
                    <span className="text-[10px] text-gray-400">{review.createdAt}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 ml-10">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Q&A */}
        <div className="card p-6 mb-8 animate-fade-in">
          <h3 className="font-bold text-primary mb-4">Questions & Answers</h3>
          <div className="flex gap-2 mb-4">
            <input
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="input-field flex-1"
              placeholder="Ask a question about this product..."
            />
            <button onClick={handleQuestionSubmit} className="btn-primary">Ask</button>
          </div>
          <div className="space-y-3">
            {product?.qa?.length > 0 ? product.qa.map((qaItem, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-xl">
                <p className="text-sm"><strong className="text-primary">Q:</strong> {qaItem.q}</p>
                <p className="text-sm text-gray-600 mt-1"><strong className="text-secondary">A:</strong> {qaItem.a}</p>
              </div>
            )) : <p className="text-sm text-gray-400">No questions yet. Be the first to ask!</p>}
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold text-primary mb-4">You May Also Like</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendations.map((item) => (
                <div
                  key={item._id}
                  onClick={() => { navigate(`/product/${item._id}`); window.scrollTo(0, 0); }}
                  className="card overflow-hidden cursor-pointer group"
                >
                  <div className="overflow-hidden">
                    <img src={item.image} alt={item.name} className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-primary truncate">{item.name}</p>
                    <p className="text-sm font-bold text-secondary mt-1">₹{item.basePrice}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default ProductDetails;
