import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Plus, Minus, Truck, Shield, Package } from 'lucide-react';
import { getProductById } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useWeb3 } from '../contexts/Web3Context';
import { useTranslation } from 'react-i18next';
import { getCrabContract, getUSDCContract } from '../utils/contract';
import { ethers } from 'ethers';
import { Product } from '../types/Product';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const { isConnected, connect } = useWeb3();
  const [quantity, setQuantity] = useState(1);
  const { t } = useTranslation();
  
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const fetchedProduct = await getProductById(id ? parseInt(id) : 0);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center pt-32 pb-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container pt-32 pb-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">{t('productDetail.notFound.title')}</h2>
        <p className="text-gray-400 mb-6">{t('productDetail.notFound.description')}</p>
        <Link to="/products" className="btn btn-primary">
          {t('productDetail.notFound.backButton')}
        </Link>
      </div>
    );
  }
  
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <Link to="/products" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8">
          <ArrowLeft size={16} className="mr-2" />
          {t('productDetail.backButton')}
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative bg-gray-800 rounded-xl overflow-hidden aspect-square">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.featured && (
              <span className="absolute top-4 left-4 bg-accent-500 text-black text-sm font-bold py-1 px-3 rounded">
                {t('productDetail.featured')}
              </span>
            )}
            {product.stock <= 10 && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold py-1 px-3 rounded">
                {t('productDetail.lowStock')}
              </span>
            )}
          </div>
          
          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
            
            <div className="flex items-baseline space-x-3 mb-4">
              <span className="text-3xl font-bold text-white">{product.price.toFixed(2)} USDC</span>
              <span className="text-gray-400">(${product.price.toFixed(2)} USD)</span>
            </div>
            
            <div className="border-t border-b border-gray-700 py-4 my-6">
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">{t('productDetail.origin')}</p>
                <p className="font-medium text-white">{product.origin}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">{t('productDetail.weight')}</p>
                <p className="font-medium text-white">{product.weight}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">{t('productDetail.category')}</p>
                <p className="font-medium text-white">{product.category}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">{t('productDetail.stock')}</p>
                <p className="font-medium text-white">{product.stock} {t('productDetail.available')}</p>
              </div>
            </div>
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">{t('productDetail.quantity')}</label>
              <div className="flex items-center">
                <button 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-l-lg disabled:opacity-50"
                >
                  <Minus size={18} />
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), product.stock))}
                  className="bg-gray-700 text-white text-center w-16 py-2 border-x border-gray-600 focus:outline-none"
                />
                <button 
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-r-lg disabled:opacity-50"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleAddToCart}
                className="btn btn-primary flex-grow flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                {t('products.addToCart')}
              </button>
              {!isConnected && (
                <button 
                  onClick={connect}
                  className="btn btn-outline flex-grow"
                >
                  {t('productDetail.connectWallet')}
                </button>
              )}
            </div>

            {/* Shipping & Guarantee Info */}
            <div className="mt-8 space-y-4">
              <div className="flex items-start space-x-3">
                <Truck className="text-blue-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="font-medium text-white">{t('productDetail.fastShipping.title')}</p>
                  <p className="text-blue-200 text-sm">{t('productDetail.fastShipping.desc')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="text-blue-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="font-medium text-white">{t('productDetail.securePayment.title')}</p>
                  <p className="text-blue-200 text-sm">{t('productDetail.securePayment.description')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Package className="text-blue-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="font-medium text-white">{t('productDetail.qualityGuarantee.title')}</p>
                  <p className="text-blue-200 text-sm">{t('productDetail.qualityGuarantee.description')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;