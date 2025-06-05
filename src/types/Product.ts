export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  weight: string;
  origin: string;
  stock: number;
  featured: boolean;
  ethPrice?: number;
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
}