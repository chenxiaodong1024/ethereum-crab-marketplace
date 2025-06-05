import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWeb3 } from '../contexts/Web3Context';

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { isConnected, connect } = useWeb3();
  
  if (items.length === 0) {
    return (
      <div className="container pt-32 pb-16 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag size={64} className="mx-auto text-gray-600 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Your Cart is Empty</h2>
          <p className="text-gray-400 mb-6">
            Looks like you haven't added any crabs to your cart yet.
          </p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <h1 className="text-3xl font-bold text-white mb-8">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">
                  Cart Items ({items.reduce((total, item) => total + item.quantity, 0)})
                </h2>
                <button 
                  onClick={clearCart}
                  className="text-red-400 hover:text-red-300 text-sm flex items-center"
                >
                  <Trash2 size={16} className="mr-1" />
                  Clear Cart
                </button>
              </div>
              
              <div className="divide-y divide-gray-700">
                {items.map(item => (
                  <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0 mb-4 sm:mb-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-grow sm:ml-4">
                      <h3 className="text-white font-medium">{item.name}</h3>
                      <p className="text-gray-400 text-sm mb-2">{item.weight}</p>
                      <div className="flex items-baseline">
                        <span className="text-white font-bold">{item.ethPrice} ETH</span>
                        <span className="text-gray-400 text-sm ml-2">(${item.price.toFixed(2)})</span>
                      </div>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center mt-4 sm:mt-0">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded-l-md"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="bg-gray-700 text-white px-3 py-1 border-x border-gray-600">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded-r-md"
                      >
                        <Plus size={16} />
                      </button>
                      
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="ml-4 text-red-400 hover:text-red-300"
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-gray-800 rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>{(totalPrice * 0.9).toFixed(2)} ETH</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>{(totalPrice * 0.05).toFixed(2)} ETH</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax</span>
                  <span>{(totalPrice * 0.05).toFixed(2)} ETH</span>
                </div>
                <div className="border-t border-gray-700 pt-3 flex justify-between font-bold text-white">
                  <span>Total</span>
                  <span>{totalPrice.toFixed(4)} ETH</span>
                </div>
              </div>
              
              {isConnected ? (
                <Link 
                  to="/checkout" 
                  className="btn btn-primary w-full flex items-center justify-center"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              ) : (
                <button 
                  onClick={connect}
                  className="btn btn-primary w-full flex items-center justify-center"
                >
                  Connect Wallet to Checkout
                </button>
              )}
              
              <Link 
                to="/products" 
                className="mt-4 block text-center text-blue-400 hover:text-blue-300"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;