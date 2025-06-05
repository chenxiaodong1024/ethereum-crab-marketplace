import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';
import { filterProducts, categories } from '../data/products';
import { ProductFilter } from '../types/Product';

const ProductsPage: React.FC = () => {
  const [filters, setFilters] = useState<ProductFilter>({
    category: 'all',
    minPrice: 0,
    maxPrice: 100,
    searchTerm: '',
    sortBy: 'price-asc'
  });
  
  const [filteredProducts, setFilteredProducts] = useState(filterProducts(filters));
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    // Apply filters and sorting
    let filtered = filterProducts({
      category: filters.category === 'all' ? undefined : filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      searchTerm: filters.searchTerm
    });
    
    // Apply sorting
    if (filters.sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
    }
    
    setFilteredProducts(filtered);
  }, [filters]);
  
  const clearFilters = () => {
    setFilters({
      category: 'all',
      minPrice: 0,
      maxPrice: 100,
      searchTerm: '',
      sortBy: 'price-asc'
    });
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
  };
  
  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
  };
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = parseFloat(e.target.value);
    setFilters(prev => ({ 
      ...prev, 
      [type === 'min' ? 'minPrice' : 'maxPrice']: value 
    }));
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ 
      ...prev, 
      sortBy: e.target.value as ProductFilter['sortBy']
    }));
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <h1 className="text-3xl font-bold text-white mb-8">Our Premium Crab Collection</h1>
        
        {/* Search and Filter Controls */}
        <div className="mb-8 flex flex-col lg:flex-row gap-4 items-start">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search crabs..."
              value={filters.searchTerm}
              onChange={handleSearchChange}
              className="input pl-10 py-3"
            />
          </div>
          
          <div className="flex gap-4">
            <button 
              className="btn btn-outline flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
            
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>
        
        {/* Expanded Filters */}
        {showFilters && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Filters</h3>
              <button 
                onClick={clearFilters}
                className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <X size={16} />
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Categories */}
              <div>
                <h4 className="font-medium text-gray-300 mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === category.id}
                        onChange={() => handleCategoryChange(category.id)}
                        className="text-blue-500 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="text-gray-300">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div>
                <h4 className="font-medium text-gray-300 mb-3">Price Range (ETH)</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Min Price</label>
                    <input
                      type="range"
                      min="0"
                      max="0.05"
                      step="0.001"
                      value={filters.minPrice}
                      onChange={(e) => handlePriceChange(e, 'min')}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm text-gray-300">{filters.minPrice.toFixed(3)} ETH</span>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Max Price</label>
                    <input
                      type="range"
                      min="0"
                      max="0.05"
                      step="0.001"
                      value={filters.maxPrice}
                      onChange={(e) => handlePriceChange(e, 'max')}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm text-gray-300">{filters.maxPrice.toFixed(3)} ETH</span>
                  </div>
                </div>
              </div>
              
              {/* Active Filters */}
              <div>
                <h4 className="font-medium text-gray-300 mb-3">Active Filters</h4>
                <div className="space-y-2">
                  {filters.category !== 'all' && (
                    <div className="flex items-center bg-blue-900/30 text-blue-300 text-sm rounded-full px-3 py-1 max-w-fit">
                      <span>Category: {categories.find(c => c.id === filters.category)?.name}</span>
                      <button 
                        className="ml-2 text-blue-300 hover:text-blue-100"
                        onClick={() => setFilters(prev => ({ ...prev, category: 'all' }))}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  
                  {filters.searchTerm && (
                    <div className="flex items-center bg-blue-900/30 text-blue-300 text-sm rounded-full px-3 py-1 max-w-fit">
                      <span>Search: {filters.searchTerm}</span>
                      <button 
                        className="ml-2 text-blue-300 hover:text-blue-100"
                        onClick={() => setFilters(prev => ({ ...prev, searchTerm: '' }))}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  
                  <div className="flex items-center bg-blue-900/30 text-blue-300 text-sm rounded-full px-3 py-1 max-w-fit">
                    <span>Price: {filters.minPrice.toFixed(3)} - {filters.maxPrice.toFixed(3)} ETH</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>
        
        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-800 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your filters or search terms</p>
            <button onClick={clearFilters} className="btn btn-outline">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;