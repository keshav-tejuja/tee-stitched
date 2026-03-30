import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { productService, designService } from '../services/api';

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
  });
  const [designName, setDesignName] = useState('');
  const [isSavingDesign, setIsSavingDesign] = useState(false);
  const [quantity, setQuantity] = useState(1);

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
      alert('Cannot add out-of-stock product');
      return;
    }

    if (quantity < 1) {
      alert('Quantity must be at least 1');
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
    alert('Added to cart! Proceed to checkout.');
    navigate('/cart');
  };

  const handleSaveDesign = async () => {
    if (!designName.trim()) {
      alert('Please enter a design name');
      return;
    }

    setIsSavingDesign(true);
    try {
      await designService.saveDesign({
        name: designName,
        ...design,
        designData: design,
      });
      alert('Design saved successfully!');
      setDesignName('');
    } catch (error) {
      console.error('Error saving design:', error);
      alert('Error saving design');
    } finally {
      setIsSavingDesign(false);
    }
  };

  if (!selectedProduct) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Design Your Custom T-Shirt</h1>

        <div className="mb-6 flex flex-wrap gap-3">
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
              className={`${selectedProduct._id === prod._id ? 'bg-secondary text-white' : 'bg-white text-gray-700'} border px-3 py-2 rounded`}
            >
              {prod.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview Section */}
          <div className="card p-8">
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-6">Live Preview</h2>
              
              {/* Product Image */}
              {selectedProduct && selectedProduct.image && (
                <div className="mb-6 w-full flex justify-center">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-32 h-40 object-contain"
                  />
                </div>
              )}

              {/* T-Shirt Preview with Dynamic Color */}
              <div className="relative w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mb-6 border-2 border-gray-200">
                <div className="relative w-64">
                  {/* SVG T-shirt with actual color */}
                  <svg
                    viewBox="0 0 300 400"
                    className="w-full h-96"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* T-shirt body */}
                    <path
                      fill={design.color}
                      d="M 60 80 L 120 50 L 180 50 L 240 80 L 240 180 Q 240 200 220 220 L 220 320 L 80 320 L 80 220 Q 60 200 60 180 Z"
                    />
                    {/* Collar */}
                    <circle cx="150" cy="80" r="25" fill={design.color} stroke="#333" strokeWidth="2" />
                    {/* Left sleeve */}
                    <path
                      fill={design.color}
                      d="M 60 120 L 40 140 L 50 160 L 70 140 Z"
                      stroke="#333"
                      strokeWidth="1"
                    />
                    {/* Right sleeve */}
                    <path
                      fill={design.color}
                      d="M 240 120 L 260 140 L 250 160 L 230 140 Z"
                      stroke="#333"
                      strokeWidth="1"
                    />
                    {/* Label text */}
                    <text
                      x="150"
                      y="250"
                      textAnchor="middle"
                      fontSize="14"
                      fill="#ffffff"
                      fontWeight="bold"
                      opacity="0.8"
                    >
                      CUSTOM
                    </text>
                  </svg>
                </div>
              </div>

              <div className="w-full space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
                <p><strong>Fabric:</strong> {design.fabric.toUpperCase()}</p>
                <p><strong>Color:</strong> {design.color.toUpperCase()}</p>
                <p><strong>Size:</strong> {design.size}</p>
                <p><strong>Fit:</strong> {design.fit.toUpperCase()}</p>
                <p><strong>Stock:</strong> {selectedProduct.stock <= 0 ? 'Out of Stock' : selectedProduct.stock < 5 ? `Only ${selectedProduct.stock} left` : 'In Stock'}</p>
                <p className="pt-4 text-xl font-bold text-secondary">Price: ₹{selectedProduct.basePrice * quantity}</p>
              </div>
            </div>
          </div>

          {/* Customization Options */}
          <div className="card p-8">
            <h2 className="text-2xl font-bold mb-6">Customize Your Shirt</h2>

            <div className="space-y-6">
              {/* Fabric Selection */}
              <div>
                <label className="block text-sm font-semibold mb-3">Fabric</label>
                <div className="grid grid-cols-3 gap-2">
                  {selectedProduct.fabrics.map((fabric) => (
                    <button
                      key={fabric}
                      onClick={() => handleDesignChange('fabric', fabric)}
                      className={`p-3 rounded-lg border-2 transition ${
                        design.fabric === fabric
                          ? 'border-secondary bg-secondary text-white'
                          : 'border-gray-300 hover:border-secondary'
                      }`}
                    >
                      {fabric}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-semibold mb-3">Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleDesignChange('color', color)}
                      className={`p-3 rounded-lg border-2 transition capitalize ${
                        design.color === color
                          ? 'border-secondary scale-105'
                          : 'border-gray-300 hover:border-secondary'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <label className="block text-sm font-semibold mb-3">Size</label>
                <div className="grid grid-cols-3 gap-2">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleDesignChange('size', size)}
                      className={`p-3 rounded-lg border-2 transition font-semibold ${
                        design.size === size
                          ? 'border-secondary bg-secondary text-white'
                          : 'border-gray-300 hover:border-secondary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fit Selection */}
              <div>
                <label className="block text-sm font-semibold mb-3">Fit</label>
                <div className="grid grid-cols-3 gap-2">
                  {selectedProduct.fits.map((fit) => (
                    <button
                      key={fit}
                      onClick={() => handleDesignChange('fit', fit)}
                      className={`p-3 rounded-lg border-2 transition capitalize ${
                        design.fit === fit
                          ? 'border-secondary bg-secondary text-white'
                          : 'border-gray-300 hover:border-secondary'
                      }`}
                    >
                      {fit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold mb-3">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="input-field"
                />
              </div>

              {/* Save Design Options */}
              <div className="border-t pt-6">
                <label className="block text-sm font-semibold mb-3">Save This Design</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Design name"
                    value={designName}
                    onChange={(e) => setDesignName(e.target.value)}
                    className="input-field flex-1"
                  />
                  <button
                    onClick={handleSaveDesign}
                    disabled={isSavingDesign}
                    className="btn-secondary disabled:opacity-50"
                  >
                    {isSavingDesign ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleAddToCart}
                className="btn-primary w-full text-lg py-3"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customize;
