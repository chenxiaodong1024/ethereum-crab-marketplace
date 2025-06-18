import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Anchor, Award, ShoppingBag, Truck, Shell, Fish, Waves, Grab as Crab } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';
import { getFeaturedProducts } from '../data/products';
import { useWeb3 } from '../contexts/Web3Context';
import { useTranslation } from 'react-i18next';
import { Product } from '../types/Product';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { connect, isConnected } = useWeb3();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const products = await getFeaturedProducts();
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/8751796/pexels-photo-8751796.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-blue-950/90"></div>
        </div>
        
        {/* Animated Bubbles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`
              }}
            >
              <div className="w-8 h-8 rounded-full bg-blue-400/20 backdrop-blur-sm"></div>
            </div>
          ))}
        </div>

        <div className="container relative z-10 text-center px-4 sm:px-6 mt-32">
          <div className="flex items-center justify-center mb-6">
            <Crab size={64} className="text-accent-500 animate-bounce" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-wave font-display">
            {t('home.hero.title')}
            <span className="text-accent-500 block mt-2">{t('home.hero.subtitle')}</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-3xl mx-auto">
            {t('home.hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/products" className="btn bg-accent-500 hover:bg-accent-600 text-gray-900 font-bold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-accent-500/50">
              <ShoppingBag className="mr-2" size={20} />
              {t('home.hero.shopNow')}
            </Link>
            {!isConnected && (
              <button onClick={connect} className="btn bg-blue-600/80 hover:bg-blue-700 text-white backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                <Shell className="mr-2" size={20} />
                {t('header.connect')}
              </button>
            )}
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="glass-card p-6 rounded-xl transform hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <Shell className="text-accent-500" size={40} />
              </div>
              <h3 className="font-bold text-white text-lg">{t('home.features.quality.title')}</h3>
              <p className="text-blue-200 text-sm mt-2">{t('home.features.quality.desc')}</p>
            </div>
            <div className="glass-card p-6 rounded-xl transform hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <Fish className="text-accent-500" size={40} />
              </div>
              <h3 className="font-bold text-white text-lg">{t('home.features.fresh.title')}</h3>
              <p className="text-blue-200 text-sm mt-2">{t('home.features.fresh.desc')}</p>
            </div>
            <div className="glass-card p-6 rounded-xl transform hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <Truck className="text-accent-500" size={40} />
              </div>
              <h3 className="font-bold text-white text-lg">{t('home.features.delivery.title')}</h3>
              <p className="text-blue-200 text-sm mt-2">{t('home.features.delivery.desc')}</p>
            </div>
            <div className="glass-card p-6 rounded-xl transform hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <Award className="text-accent-500" size={40} />
              </div>
              <h3 className="font-bold text-white text-lg">{t('home.features.certification.title')}</h3>
              <p className="text-blue-200 text-sm mt-2">{t('home.features.certification.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section bg-gradient-to-b from-blue-950 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Waves className="w-full h-full text-accent-500" />
        </div>
        <div className="container relative">
          <div className="text-center mb-12">
            <Crab size={48} className="mx-auto text-accent-500 mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4 font-display">{t('home.featured.title')}</h2>
            <p className="text-blue-200 max-w-2xl mx-auto">
              {t('home.featured.description')}
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Link 
                  to="/products" 
                  className="btn bg-accent-500 hover:bg-accent-600 text-gray-900 font-bold transform hover:scale-105 transition-all duration-300"
                >
                  {t('home.featured.viewAll')}
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section bg-gradient-to-b from-blue-900 to-blue-950 relative overflow-hidden">
        <div className="container relative">
          <div className="text-center mb-16">
            <Shell size={48} className="mx-auto text-accent-500 mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4 font-display">{t('home.benefits.title')}</h2>
            <p className="text-blue-200 max-w-2xl mx-auto">
              {t('home.benefits.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-blue-900/50 backdrop-blur-sm p-8 rounded-2xl transform hover:scale-105 transition-all duration-300">
              <div className="rounded-full bg-accent-500/20 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Shell size={32} className="text-accent-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 text-center">{t('home.benefits.traceability.title')}</h3>
              <p className="text-blue-200 text-center">
                {t('home.benefits.traceability.description')}
              </p>
            </div>
            
            <div className="card bg-blue-900/50 backdrop-blur-sm p-8 rounded-2xl transform hover:scale-105 transition-all duration-300">
              <div className="rounded-full bg-accent-500/20 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Award size={32} className="text-accent-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 text-center">{t('home.benefits.security.title')}</h3>
              <p className="text-blue-200 text-center">
                {t('home.benefits.security.description')}
              </p>
            </div>
            
            <div className="card bg-blue-900/50 backdrop-blur-sm p-8 rounded-2xl transform hover:scale-105 transition-all duration-300">
              <div className="rounded-full bg-accent-500/20 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Truck size={32} className="text-accent-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 text-center">{t('home.benefits.delivery.title')}</h3>
              <p className="text-blue-200 text-center">
                {t('home.benefits.delivery.description')}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="section bg-accent-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-6 gap-8 rotate-12 scale-150">
            {[...Array(24)].map((_, i) => (
              <Crab key={i} size={64} className="text-black" />
            ))}
          </div>
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-display">
              {t('home.cta.title')}
            </h2>
            <p className="text-xl text-gray-800 mb-8">
              {t('home.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/products" 
                className="btn bg-gray-900 hover:bg-gray-800 text-white transform hover:scale-105 transition-all duration-300"
              >
                <ShoppingBag size={20} className="mr-2" />
                {t('home.cta.shopNow')}
              </Link>
              {!isConnected && (
                <button 
                  onClick={connect} 
                  className="btn bg-gray-900 hover:bg-gray-800 text-white transform hover:scale-105 transition-all duration-300"
                >
                  <Shell size={20} className="mr-2" />
                  {t('header.connect')}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;