import { Product } from '../types/Product';

export const products: Product[] = [
  {
    id: 1,
    name: '洪泽湖公蟹',
    description: '精选洪泽湖大闸蟹，肉质鲜美，蟹黄饱满。公蟹个大体肥，是秋季美味的不二之选。',
    price: 79.99,
    ethPrice: 0.032,
    image: 'https://images.pexels.com/photos/10875319/pexels-photo-10875319.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    category: 'king',
    weight: '200-250g',
    origin: '江苏洪泽湖',
    stock: 25,
    featured: true
  },
  {
    id: 2,
    name: '洪泽湖母蟹',
    description: '精选洪泽湖大闸蟹，蟹膏丰腴，蟹黄金黄。母蟹蟹膏丰富，是秋季送礼的绝佳选择。',
    price: 49.99,
    ethPrice: 0.02,
    image: 'https://images.pexels.com/photos/13409375/pexels-photo-13409375.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    category: 'dungeness',
    weight: '150-200g',
    origin: '江苏洪泽湖',
    stock: 40,
    featured: true
  },
  {
    id: 3,
    name: '阳澄湖大闸蟹',
    description: '正宗阳澄湖大闸蟹，肉质细腻，蟹膏浓郁。严选品质，保证每一只都是上等佳品。',
    price: 39.99,
    ethPrice: 0.016,
    image: 'https://images.pexels.com/photos/2254030/pexels-photo-2254030.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    category: 'blue',
    weight: '150-200g',
    origin: '江苏阳澄湖',
    stock: 60,
    featured: false
  },
  {
    id: 4,
    name: '太湖母蟹',
    description: '精选太湖大闸蟹，蟹黄饱满，口感细腻。每只蟹都经过严格挑选，确保品质。',
    price: 54.99,
    ethPrice: 0.022,
    image: 'https://images.pexels.com/photos/566344/pexels-photo-566344.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    category: 'snow',
    weight: '150-200g',
    origin: '江苏太湖',
    stock: 35,
    featured: true
  },
  {
    id: 5,
    name: '固城湖公蟹',
    description: '优质固城湖大闸蟹，个大体肥，蟹黄丰富。秋季品蟹的绝佳选择。',
    price: 64.99,
    ethPrice: 0.026,
    image: 'https://images.pexels.com/photos/11030358/pexels-photo-11030358.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    category: 'stone',
    weight: '200-250g',
    origin: '江苏固城湖',
    stock: 20,
    featured: false
  },
  {
    id: 6,
    name: '高淳湖大闸蟹',
    description: '精选高淳湖大闸蟹，肉质鲜美，营养丰富。严格把控品质，保证新鲜送达。',
    price: 59.99,
    ethPrice: 0.024,
    image: 'https://images.pexels.com/photos/566345/pexels-photo-566345.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    category: 'soft-shell',
    weight: '150-200g',
    origin: '江苏高淳',
    stock: 15,
    featured: false
  },
  {
    id: 7,
    name: '长荡湖大闸蟹',
    description: '优质长荡湖大闸蟹，蟹膏丰美，口感一流。每只蟹都是精挑细选的佳品。',
    price: 44.99,
    ethPrice: 0.018,
    image: 'https://images.pexels.com/photos/8969237/pexels-photo-8969237.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    category: 'jonah',
    weight: '150-200g',
    origin: '江苏长荡湖',
    stock: 30,
    featured: false
  },
  {
    id: 8,
    name: '金坛大闸蟹',
    description: '精选金坛大闸蟹，蟹黄饱满，肉质鲜美。严格遵循传统养殖方式，保证品质。',
    price: 89.99,
    ethPrice: 0.036,
    image: 'https://images.pexels.com/photos/15169021/pexels-photo-15169021/free-photo-of-crab-claws-on-a-plate.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    category: 'king',
    weight: '200-250g',
    origin: '江苏金坛',
    stock: 10,
    featured: true
  }
];

export const categories = [
  { id: 'all', name: '全部大闸蟹' },
  { id: 'king', name: '公蟹' },
  { id: 'snow', name: '母蟹' },
  { id: 'dungeness', name: '礼盒套装' },
  { id: 'blue', name: '阳澄湖蟹' },
  { id: 'stone', name: '固城湖蟹' },
  { id: 'soft-shell', name: '高淳蟹' },
  { id: 'jonah', name: '其他产地' }
];

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const filterProducts = (filters: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
}): Product[] => {
  return products.filter(product => {
    // Filter by category
    if (filters.category && filters.category !== 'all' && product.category !== filters.category) {
      return false;
    }
    
    // Filter by price range
    if (filters.minPrice && product.price < filters.minPrice) {
      return false;
    }
    
    if (filters.maxPrice && product.price > filters.maxPrice) {
      return false;
    }
    
    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
};