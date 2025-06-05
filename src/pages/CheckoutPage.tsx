import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard, Loader } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWeb3 } from '../contexts/Web3Context';

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const CheckoutPage: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { account, isConnected, connect } = useWeb3();
  const navigate = useNavigate();
  
  const [form, setForm] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});
  
  // Redirect if cart is empty
  if (items.length === 0 && !paymentSuccess) {
    navigate('/products');
    return null;
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name as keyof CheckoutForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutForm> = {};
    let isValid = true;
    
    // Validate each field
    if (!form.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }
    
    if (!form.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }
    
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!form.address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }
    
    if (!form.city.trim()) {
      newErrors.city = 'City is required';
      isValid = false;
    }
    
    if (!form.state.trim()) {
      newErrors.state = 'State is required';
      isValid = false;
    }
    
    if (!form.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;
    
    // Check wallet connection
    if (!isConnected) {
      await connect();
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsSubmitting(false);
      setPaymentSuccess(true);
      clearCart();
    }, 2000);
  };
  
  if (paymentSuccess) {
    return (
      <div className="container pt-32 pb-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-green-900/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Order Confirmed!</h2>
          <p className="text-gray-300 mb-6">
            Thank you for your purchase. Your order has been confirmed and will be shipped soon.
          </p>
          <p className="text-green-400 mb-6 font-medium">
            Transaction hash: {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
          </p>
          <button 
            onClick={() => navigate('/products')} 
            className="btn btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Shipping Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-gray-300 mb-1">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleInputChange}
                      className={`input ${errors.firstName ? 'border-red-500' : ''}`}
                    />
                    {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-gray-300 mb-1">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleInputChange}
                      className={`input ${errors.lastName ? 'border-red-500' : ''}`}
                    />
                    {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    className={`input ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-gray-300 mb-1">Street Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleInputChange}
                    className={`input ${errors.address ? 'border-red-500' : ''}`}
                  />
                  {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-gray-300 mb-1">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={form.city}
                      onChange={handleInputChange}
                      className={`input ${errors.city ? 'border-red-500' : ''}`}
                    />
                    {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-gray-300 mb-1">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={form.state}
                      onChange={handleInputChange}
                      className={`input ${errors.state ? 'border-red-500' : ''}`}
                    />
                    {errors.state && <p className="text-red-400 text-sm mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-gray-300 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={form.zipCode}
                      onChange={handleInputChange}
                      className={`input ${errors.zipCode ? 'border-red-500' : ''}`}
                    />
                    {errors.zipCode && <p className="text-red-400 text-sm mt-1">{errors.zipCode}</p>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-gray-300 mb-1">Country</label>
                  <select
                    id="country"
                    name="country"
                    value={form.country}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="JP">Japan</option>
                  </select>
                </div>
                
                <h2 className="text-xl font-semibold text-white mt-8 mb-6">Payment Information</h2>
                
                <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <CreditCard className="text-blue-400 mr-3 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="text-white font-medium">Ethereum Payment</h4>
                      <p className="text-sm text-gray-400">
                        You will be charged {totalPrice.toFixed(4)} ETH from your connected wallet.
                      </p>
                      {isConnected ? (
                        <p className="text-blue-400 text-sm mt-2">
                          Connected: {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
                        </p>
                      ) : (
                        <p className="text-yellow-400 text-sm mt-2">
                          Please connect your wallet to continue.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn w-full ${
                      isSubmitting 
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                        : isConnected 
                          ? 'btn-primary' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                    } flex items-center justify-center`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader size={18} className="animate-spin mr-2" />
                        Processing...
                      </>
                    ) : isConnected ? (
                      'Complete Purchase'
                    ) : (
                      'Connect Wallet to Continue'
                    )}
                  </button>
                  
                  <p className="text-sm text-gray-400 mt-4 text-center">
                    By placing your order, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </form>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-gray-800 rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
              
              <div className="max-h-64 overflow-y-auto mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-center py-3 border-b border-gray-700 last:border-b-0">
                    <div className="w-16 h-16 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 className="text-white font-medium">{item.name}</h3>
                      <div className="flex justify-between items-baseline mt-1">
                        <span className="text-gray-400 text-sm">Qty: {item.quantity}</span>
                        <span className="text-white">{item.ethPrice} ETH</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>{(totalPrice * 0.9).toFixed(4)} ETH</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>{(totalPrice * 0.05).toFixed(4)} ETH</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax</span>
                  <span>{(totalPrice * 0.05).toFixed(4)} ETH</span>
                </div>
                <div className="border-t border-gray-700 pt-3 flex justify-between font-bold text-white">
                  <span>Total</span>
                  <span>{totalPrice.toFixed(4)} ETH</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;