import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../../types/Product';
import { useCart } from '../../contexts/CartContext';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { t } = useTranslation();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Link 
      to={`/product/${product.id}`}
      className="card overflow-hidden group hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-700">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.stock <= 10 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded">
            {t('products.lowStock')}
          </span>
        )}
        {product.featured && (
          <span className="absolute top-2 left-2 bg-accent-500 text-black text-xs font-bold py-1 px-2 rounded">
            {t('products.featured')}
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
        </div>
        <div className="flex items-baseline mt-1 space-x-2">
          <p className="text-xl font-bold text-white">{product.ethPrice} ETH</p>
          <p className="text-sm text-gray-400">(${product.price.toFixed(2)})</p>
        </div>
        <p className="text-sm text-gray-400 mt-2 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-400">
            {t('products.origin')}: {product.origin}
          </span>
          <span className="text-sm text-gray-400">
            {product.weight}
          </span>
        </div>
        
        <button 
          onClick={handleAddToCart}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2 py-2 rounded-lg transition-colors"
        >
          <ShoppingCart size={18} />
          <span>{t('products.addToCart')}</span>
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;