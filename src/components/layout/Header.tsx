import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '../../contexts/Web3Context';
import { useCart } from '../../contexts/CartContext';
import { ShoppingCart, Wallet, Menu, X, ChevronDown } from 'lucide-react';
import LanguageSwitch from '../LanguageSwitch';

const Header: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { connect, disconnect, isConnected, account, isConnecting, networkName } = useWeb3();
  const { totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

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
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-700">
                    <div className="px-4 py-3">
                      <p className="text-sm text-gray-400">Connected to</p>
                      <p className="text-sm font-medium text-blue-400">{networkName}</p>
                    </div>
                    <div className="py-1">
                      <Link 
                        to="/account" 
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        {t('header.account')}
                      </Link>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
                        onClick={() => {
                          disconnect();
                          setAccountMenuOpen(false);
                        }}
                      >
                        Disconnect Wallet
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button 
                className={`flex items-center space-x-2 ${
                  isConnecting 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } px-4 py-2 rounded-lg transition-all`}
                onClick={connect}
                disabled={isConnecting}
              >
                <Wallet size={18} />
                <span>{isConnecting ? t('header.connecting') : t('header.connect')}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <Link to="/cart" className="relative p-2 text-gray-300 hover:text-white transition-colors">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="text-gray-300 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
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
            
            {/* Mobile Wallet Connection */}
            {isConnected ? (
              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center space-x-2 text-blue-400 mb-2">
                  <Wallet size={18} />
                  <span className="font-medium">{formatAccount(account || '')}</span>
                </div>
                <p className="text-sm text-gray-400 mb-3">Connected to {networkName}</p>
                <button
                  className="w-full bg-red-900/30 text-red-400 border border-red-800 px-4 py-2 rounded"
                  onClick={() => {
                    disconnect();
                    setMobileMenuOpen(false);
                  }}
                >
                  Disconnect Wallet
                </button>
              </div>
            ) : (
              <button 
                className={`w-full flex items-center justify-center space-x-2 ${
                  isConnecting 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } px-4 py-3 rounded-lg transition-all mt-4`}
                onClick={connect}
                disabled={isConnecting}
              >
                <Wallet size={18} />
                <span>{isConnecting ? t('header.connecting') : t('header.connect')}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;