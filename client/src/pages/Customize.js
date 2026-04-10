import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { productService, designService } from '../services/api';
import Toast from '../components/Toast';

const Customize = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [design, setDesign] = useState({
    name: 'My Custom Shirt',
    fabric: 'cotton',
    color: 'black',
    size: 'M',
    fit: 'regular',
    customText: '',
  });
  const [designName, setDesignName] = useState('');
  const [isSavingDesign, setIsSavingDesign] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await productService.getProducts();
        setProducts(response.data);
        const first = response.data[0];
        setSelectedProduct(first);
        setDesign((prev) => ({
          ...prev,
          fabric: first?.fabrics?.[0] || prev.fabric,
          color: first?.colors?.[0] || prev.color,
          size: first?.sizes?.[0] || prev.size,
          fit: first?.fits?.[0] || prev.fit,
        }));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [isAuthenticated, navigate]);

  const handleDesignChange = (field, value) => {
    setDesign({ ...design, [field]: value });
  };

  const handleAddToCart = () => {
    if (!selectedProduct || selectedProduct.stock <= 0) {
      setToast({ message: 'Cannot add out-of-stock product', type: 'error' });
      return;
    }

    if (quantity < 1) {
      setToast({ message: 'Quantity must be at least 1', type: 'error' });
      return;
    }

    const cartItem = {
      ...selectedProduct,
      design,
      quantity,
      totalPrice: selectedProduct.basePrice,
      id: selectedProduct._id,
    };

    addToCart(cartItem);
    setToast({ message: 'Added to cart! 🎉', type: 'success' });
    setTimeout(() => navigate('/cart'), 1000);
  };

  const handleSaveDesign = async () => {
    if (!designName.trim()) {
      setToast({ message: 'Please enter a design name', type: 'error' });
      return;
    }

    setIsSavingDesign(true);
    try {
      await designService.saveDesign({
        name: designName,
        ...design,
        designData: design,
      });
      setToast({ message: 'Design saved successfully!', type: 'success' });
      setDesignName('');
    } catch (error) {
      console.error('Error saving design:', error);
      setToast({ message: 'Error saving design', type: 'error' });
    } finally {
      setIsSavingDesign(false);
    }
  };

  // Color name to hex mapping for the color picker
  const colorMap = {
    black: '#0a0a0a', white: '#ffffff', red: '#ef4444', blue: '#3b82f6',
    green: '#22c55e', yellow: '#eab308', pink: '#ec4899', purple: '#8b5cf6',
    orange: '#f97316', gray: '#6b7280', navy: '#1e3a5f', maroon: '#7f1d1d',
    teal: '#14b8a6', brown: '#92400e',
  };

  const getColorHex = (colorName) => {
    return colorMap[colorName?.toLowerCase()] || colorName || '#0a0a0a';
  };

  // Compute contrasting text color
  const getTextColor = (bgColor) => {
    const hex = getColorHex(bgColor);
    if (!hex || hex === '#ffffff' || hex === '#eab308' || hex === '#22c55e') return '#0a0a0a';
    return '#ffffff';
  };

  if (!selectedProduct) {
    return (
      <div className="flex justify-center items-center h-screen bg-surface">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-primary animate-pulse"></div>
          <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-secondary/30 animate-ping"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Design Your Custom Tee</h1>
          <p className="text-sm text-gray-500 mt-2">Choose your style, customize every detail</p>
        </div>

        {/* Product Selector */}
        <div className="mb-6 flex flex-wrap gap-2 justify-center animate-fade-in">
          {products.map((prod) => (
            <button
              key={prod._id}
              onClick={() => {
                setSelectedProduct(prod);
                setDesign({
                  ...design,
                  fabric: prod.fabrics[0],
                  color: prod.colors[0],
                  size: prod.sizes[0],
                  fit: prod.fits[0],
                });
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedProduct._id === prod._id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {prod.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview Section */}
          <div className="card p-8 animate-fade-in">
            <h2 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary text-sm">👁</span>
              Live Preview
            </h2>
            
            {/* T-Shirt Preview */}
            <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center overflow-hidden mb-6 border border-gray-200">
              <div className="relative w-64">
                <svg viewBox="0 0 300 400" className="w-full" xmlns="http://www.w3.org/2000/svg">
                  {/* T-shirt body */}
                  <path
                    fill={getColorHex(design.color)}
                    d="M 60 80 L 120 50 L 180 50 L 240 80 L 240 180 Q 240 200 220 220 L 220 320 L 80 320 L 80 220 Q 60 200 60 180 Z"
                    className="transition-colors duration-300"
                  />
                  {/* Collar */}
                  <circle cx="150" cy="80" r="25" fill={getColorHex(design.color)} stroke="rgba(0,0,0,0.15)" strokeWidth="2" className="transition-colors duration-300" />
                  {/* Left sleeve */}
                  <path fill={getColorHex(design.color)} d="M 60 120 L 30 150 L 45 170 L 70 140 Z" stroke="rgba(0,0,0,0.1)" strokeWidth="1" className="transition-colors duration-300" />
                  {/* Right sleeve */}
                  <path fill={getColorHex(design.color)} d="M 240 120 L 270 150 L 255 170 L 230 140 Z" stroke="rgba(0,0,0,0.1)" strokeWidth="1" className="transition-colors duration-300" />
                  {/* Custom text */}
                  <text
                    x="150" y={design.customText ? "230" : "250"}
                    textAnchor="middle"
                    fontSize={design.customText ? "16" : "14"}
                    fill={getTextColor(design.color)}
                    fontWeight="bold"
                    opacity="0.9"
                    fontFamily="Inter, sans-serif"
                  >
                    {design.customText || 'YOUR TEXT HERE'}
                  </text>
                  {design.customText && (
                    <text
                      x="150" y="260"
                      textAnchor="middle" fontSize="10"
                      fill={getTextColor(design.color)}
                      opacity="0.5"
                      fontFamily="Inter, sans-serif"
                    >
                      STITCHED ®
                    </text>
                  )}
                </svg>
              </div>
            </div>

            {/* Product Image Thumbnail */}
            {selectedProduct?.image && (
              <div className="flex items-center gap-3 mb-4">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-12 h-12 object-cover rounded-xl border" />
                <div>
                  <p className="text-sm font-semibold text-primary">{selectedProduct.name}</p>
                  <p className="text-xs text-gray-500">{selectedProduct.category}</p>
                </div>
              </div>
            )}

            {/* Specs Summary */}
            <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl">
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Fabric</p>
                <p className="text-sm font-medium text-primary capitalize">{design.fabric}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Color</p>
                <p className="text-sm font-medium text-primary capitalize">{design.color}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Size</p>
                <p className="text-sm font-medium text-primary">{design.size}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Fit</p>
                <p className="text-sm font-medium text-primary capitalize">{design.fit}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Stock</p>
                <p className={`text-sm font-medium ${selectedProduct.stock <= 0 ? 'text-red-500' : selectedProduct.stock < 5 ? 'text-amber-500' : 'text-emerald-600'}`}>
                  {selectedProduct.stock <= 0 ? 'Out of Stock' : selectedProduct.stock < 5 ? `Only ${selectedProduct.stock} left` : 'In Stock'}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Price</p>
                <p className="text-lg font-bold text-primary">₹{selectedProduct.basePrice * quantity}</p>
              </div>
            </div>
          </div>

          {/* Customization Options */}
          <div className="card p-8 animate-fade-in">
            <h2 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary text-sm">✏️</span>
              Customize Your Shirt
            </h2>

            <div className="space-y-6">
              {/* Fabric */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Fabric</label>
                <div className="grid grid-cols-3 gap-2">
                  {selectedProduct.fabrics.map((fabric) => (
                    <button
                      key={fabric}
                      onClick={() => handleDesignChange('fabric', fabric)}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 capitalize ${
                        design.fabric === fabric
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      {fabric}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Color</label>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleDesignChange('color', color)}
                      className={`w-10 h-10 rounded-xl transition-all duration-200 border-2 ${
                        design.color === color ? 'border-primary scale-110 ring-2 ring-primary/20' : 'border-gray-200 hover:scale-105'
                      }`}
                      style={{ backgroundColor: getColorHex(color) }}
                      title={color}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2 capitalize">Selected: {design.color}</p>
              </div>

              {/* Size */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Size</label>
                <div className="flex gap-2">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleDesignChange('size', size)}
                      className={`w-12 h-12 rounded-xl border-2 text-sm font-bold transition-all duration-200 ${
                        design.size === size
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fit */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Fit</label>
                <div className="grid grid-cols-3 gap-2">
                  {selectedProduct.fits.map((fit) => (
                    <button
                      key={fit}
                      onClick={() => handleDesignChange('fit', fit)}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 capitalize ${
                        design.fit === fit
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      {fit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Text Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Custom Print Text</label>
                <input
                  type="text"
                  placeholder="Enter text to print on your tee..."
                  value={design.customText}
                  onChange={(e) => handleDesignChange('customText', e.target.value.slice(0, 30))}
                  className="input-field"
                  maxLength={30}
                />
                <p className="text-xs text-gray-400 mt-1">{design.customText?.length || 0}/30 characters</p>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
                  >
                    −
                  </button>
                  <span className="text-lg font-bold text-primary w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(20, quantity + 1))}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Save Design */}
              <div className="border-t border-gray-100 pt-6">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Save This Design</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Give your design a name"
                    value={designName}
                    onChange={(e) => setDesignName(e.target.value)}
                    className="input-field flex-1"
                  />
                  <button
                    onClick={handleSaveDesign}
                    disabled={isSavingDesign}
                    className="btn-secondary disabled:opacity-50"
                  >
                    {isSavingDesign ? '...' : 'Save'}
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="btn-primary w-full !py-3.5 text-base"
              >
                Add to Cart — ₹{selectedProduct.basePrice * quantity}
              </button>
            </div>
          </div>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Customize;
