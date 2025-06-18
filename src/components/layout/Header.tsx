import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '../../contexts/Web3Context';
import { useCart } from '../../contexts/CartContext';
import { ShoppingCart, Wallet, Menu, X, ChevronDown } from 'lucide-react';
import LanguageSwitch from '../LanguageSwitch';
import { getCrabContract } from '../../utils/contract';
import { ethers } from 'ethers';

const Header: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { connect, disconnect, isConnected, account, isConnecting, networkName } = useWeb3();
  const { totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // 检查是否是合约所有者
  useEffect(() => {
    const checkOwner = async () => {
      if (isConnected && account) {
        try {
          const contract = getCrabContract();
          const owner = await contract.owner();
          setIsOwner(account.toLowerCase() === owner.toLowerCase());
        } catch (error) {
          console.error('Error checking owner:', error);
          setIsOwner(false);
        }
      } else {
        setIsOwner(false);
      }
    };
    checkOwner();
  }, [isConnected, account]);

  // Format account address
  const formatAccount = (account: string) => {
    return `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
  };

  // Handle scroll for header transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen 
          ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-accent-500">
              <ShoppingCart size={28} className="inline-block mr-2" />
            </span>
            <span className="text-xl font-bold text-white">{t('header.brand')}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <LanguageSwitch />
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'nav-link-active' : ''}`}>
              {t('header.home')}
            </Link>
            <Link to="/products" className={`nav-link ${location.pathname === '/products' ? 'nav-link-active' : ''}`}>
              {t('header.products')}
            </Link>
            <Link to="/account" className={`nav-link ${location.pathname === '/account' ? 'nav-link-active' : ''}`}>
              {t('header.account')}
            </Link>
            {isOwner && (
              <Link to="/seller" className={`nav-link ${location.pathname === '/seller' ? 'nav-link-active' : ''}`}>
                {t('header.seller')}
              </Link>
            )}
          </nav>

          {/* User Actions (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Button */}
            <Link to="/cart" className="relative p-2 text-gray-300 hover:text-white transition-colors">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Wallet Connection */}
            {isConnected ? (
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 px-4 py-2 rounded-lg transition-colors border border-blue-500/50"
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                >
                  <Wallet size={18} />
                  <span>{formatAccount(account || '')}</span>
                  <ChevronDown size={16} />
                </button>

                {accountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 text-sm text-gray-400">
                      {networkName}
                    </div>
                    <Link 
                      to="/account" 
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      {t('header.account')}
                    </Link>
                    {isOwner && (
                      <Link 
                        to="/seller" 
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        {t('header.seller')}
                      </Link>
                    )}
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
                      onClick={() => {
                        disconnect();
                        setAccountMenuOpen(false);
                      }}
                    >
                      {t('header.disconnect')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="btn bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 px-4 py-2 rounded-lg transition-colors border border-blue-500/50"
              >
                {isConnecting ? t('header.connecting') : t('header.connect')}
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <LanguageSwitch />
            <Link 
              to="/" 
              className={`block py-2 ${location.pathname === '/' ? 'text-blue-400' : 'text-gray-300'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('header.home')}
            </Link>
            <Link 
              to="/products" 
              className={`block py-2 ${location.pathname === '/products' ? 'text-blue-400' : 'text-gray-300'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('header.products')}
            </Link>
            <Link 
              to="/account" 
              className={`block py-2 ${location.pathname === '/account' ? 'text-blue-400' : 'text-gray-300'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('header.account')}
            </Link>
            {isOwner && (
              <Link 
                to="/seller" 
                className={`block py-2 ${location.pathname === '/seller' ? 'text-blue-400' : 'text-gray-300'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('header.seller')}
              </Link>
            )}
            
            {/* Mobile Wallet Connection */}
            {isConnected ? (
              <button
                onClick={disconnect}
                className="block w-full text-left py-2 text-red-400"
              >
                {t('header.disconnect')}
              </button>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="block w-full text-left py-2 text-gray-300"
              >
                {isConnecting ? t('header.connecting') : t('header.connect')}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;