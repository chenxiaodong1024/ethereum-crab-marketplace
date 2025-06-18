import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard, Loader } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWeb3 } from '../contexts/Web3Context';
import { useTranslation } from 'react-i18next';
import { getCrabContract, getUSDCContract } from '../utils/contract';
import { ethers } from 'ethers';

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
  const { t } = useTranslation();
  
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
    
    // 只支持单商品结算
    if (items.length !== 1) {
      alert(t('checkout.onlyOneItem'));
      return;
    }
    
    // Check wallet connection
    if (!isConnected) {
      await connect();
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 合并收货信息
      const shippingInfo = `${form.firstName} ${form.lastName}, ${form.email}, ${form.address}, ${form.city}, ${form.state}, ${form.zipCode}, ${form.country}`;
      const contract = getCrabContract();
      const usdcContract = getUSDCContract();
      console.log('Contract Instance:', contract);
      console.log('Contract buyGiftBox Method:', contract.buyGiftBox);
      const item = items[0];
      const usdcTotal = items.reduce((sum, item) => sum + (item?.price ?? 0) * item.quantity, 0);
      const totalPrice = ethers.utils.parseUnits(usdcTotal.toString(), 6); // 将USDC金额转换为最小单位 (6位小数)
      
      // 先授权USDC
      console.log('Approving USDC...');
      const approveTx = await usdcContract.approve(contract.address, totalPrice);
      await approveTx.wait();
      
      // 调用buyGiftBox方法
      console.log('Buying gift box...');
      const tx = await contract.buyGiftBox(
        item.id, // 礼盒ID
        item.quantity, // 数量
        shippingInfo
      );
      await tx.wait();
      setIsSubmitting(false);
      setPaymentSuccess(true);
      clearCart();
      alert(t('checkout.success'));
    } catch (err) {
      const e = err as any;
      console.error('Contract Call Error:', e);
      setIsSubmitting(false);
      alert(t('checkout.failed') + (e && e.message ? e.message : e));
    }
  };
  
  if (paymentSuccess) {
    return (
      <div className="container pt-32 pb-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-green-900/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">{t('checkout.confirmedTitle')}</h2>
          <p className="text-gray-300 mb-6">
            {t('checkout.confirmedDesc')}
          </p>
          <p className="text-green-400 mb-6 font-medium">
            {t('checkout.transactionHash', {hash: account ? account.substring(0, 6) + '...' + account.substring(account.length - 4) : ''})}
          </p>
          <button 
            onClick={() => navigate('/products')} 
            className="btn btn-primary mx-auto block"
          >
            {t('checkout.continue')}
          </button>
        </div>
      </div>
    );
  }

  // 将商品单价显示从ETH改为USDC
  const subtotalUSDC = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingUSDC = 0;
  const taxUSDC = 0;
  const totalUSDC = subtotalUSDC;

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <h1 className="text-3xl font-bold text-white mb-8">{t('checkout.title')}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">{t('checkout.shippingInfo')}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-gray-300 mb-1">{t('checkout.firstName')}</label>
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
                    <label htmlFor="lastName" className="block text-gray-300 mb-1">{t('checkout.lastName')}</label>
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
                  <label htmlFor="email" className="block text-gray-300 mb-1">{t('checkout.email')}</label>
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
                  <label htmlFor="address" className="block text-gray-300 mb-1">{t('checkout.street')}</label>
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
                    <label htmlFor="city" className="block text-gray-300 mb-1">{t('checkout.city')}</label>
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
                    <label htmlFor="state" className="block text-gray-300 mb-1">{t('checkout.state')}</label>
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
                    <label htmlFor="zipCode" className="block text-gray-300 mb-1">{t('checkout.zip')}</label>
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
                  <label htmlFor="country" className="block text-gray-300 mb-1">{t('checkout.country')}</label>
                  <select
                    id="country"
                    name="country"
                    value={form.country}
                    onChange={handleInputChange}
                    className={`input ${errors.country ? 'border-red-500' : ''}`}
                  >
                    <option value="US">{t('checkout.countryUS')}</option>
                    <option value="CA">{t('checkout.countryCA')}</option>
                    <option value="MX">{t('checkout.countryMX')}</option>
                    <option value="CN">{t('checkout.countryCN')}</option>
                    <option value="HK">{t('checkout.countryHK')}</option>
                    <option value="TW">{t('checkout.countryTW')}</option>
                  </select>
                  {errors.country && <p className="text-red-400 text-sm mt-1">{errors.country}</p>}
                </div>
                
                <h2 className="text-xl font-semibold text-white mt-8 mb-6">{t('checkout.paymentInfo')}</h2>
                
                <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <CreditCard className="text-blue-400 mr-3 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="text-white font-medium">{t('checkout.paymentInfoTitle')}</h4>
                      <p className="text-sm text-gray-400">
                        {t('checkout.charged', { amount: totalUSDC.toFixed(2) })}
                      </p>
                      {isConnected ? (
                        <p className="text-blue-400 text-sm mt-2">
                          {t('checkout.connected')}: {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
                        </p>
                      ) : (
                        <p className="text-yellow-400 text-sm mt-2">
                          {t('checkout.connectToContinue')}
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
                        {t('checkout.processing')}
                      </>
                    ) : isConnected ? (
                      t('checkout.completePurchase')
                    ) : (
                      t('checkout.connectToContinue')
                    )}
                  </button>
                  
                  <p className="text-sm text-gray-400 mt-4 text-center">
                    {t('checkout.agree')}
                  </p>
                </div>
              </form>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-gray-800 rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-white mb-6">{t('checkout.orderSummary')}</h2>
              
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
                        <span className="text-white">{item.price} USDC</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>{t('cart.subtotal')}</span>
                  <span>{subtotalUSDC.toFixed(2)} USDC</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>{t('cart.shippingFee')}</span>
                  <span>{shippingUSDC.toFixed(2)} USDC</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>{t('cart.taxFee')}</span>
                  <span>{taxUSDC.toFixed(2)} USDC</span>
                </div>
                <div className="border-t border-gray-700 pt-3 flex justify-between font-bold text-white">
                  <span>{t('cart.totalAmount')}</span>
                  <span>{totalUSDC.toFixed(2)} USDC</span>
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