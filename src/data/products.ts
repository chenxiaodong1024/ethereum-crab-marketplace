import { Product } from '../types/Product';
import { ethers } from 'ethers';
import CrabUSDCABI from '../contracts/CrabUSDC.json';
import { BUSINESS_LOGIC_ADDRESS } from '../utils/contract';

// 本地商品基础数据
const localProducts = [
  {
    id: 1,
    name: '全母套餐 2.0两 8只装',
    description: '精选洪泽湖大闸蟹，全母蟹套餐，每只2.0两，8只装。蟹黄饱满，口感细腻。',
    image: 'https://sihongpangxie.site:17778//crmebimage/public/product/2024/11/11/0664015afec04a4b9a623a6aade1a2b2gypru1201b.jpg',
    category: '洪泽湖大闸蟹',
    weight: '2.0两/只',
    origin: '江苏洪泽湖',
    featured: true
  },
  {
    id: 2,
    name: '全母套餐 2.5两 8只装',
    description: '精选洪泽湖大闸蟹，全母蟹套餐，每只2.5两，8只装。蟹黄丰腴，品质上乘。',
    image: 'https://sihongpangxie.site:17778//crmebimage/public/product/2024/11/11/0664015afec04a4b9a623a6aade1a2b2gypru1201b.jpg',
    category: '洪泽湖大闸蟹',
    weight: '2.5两/只',
    origin: '江苏洪泽湖',
    featured: true
  },
  {
    id: 3,
    name: '全公套餐 3.0公 8只装',
    description: '精选洪泽湖大闸蟹，全公蟹套餐，每只3.0两，8只装。肉质饱满，蟹膏丰富。',
    image: 'https://sihongpangxie.site:17778//crmebimage/public/product/2024/11/11/0664015afec04a4b9a623a6aade1a2b2gypru1201b.jpg',
    category: '洪泽湖大闸蟹',
    weight: '3.0两/只',
    origin: '江苏洪泽湖',
    featured: true
  },
  {
    id: 4,
    name: '全公套餐 3.5公 8只装',
    description: '精选洪泽湖大闸蟹，全公蟹套餐，每只3.5两，8只装。个大肉肥，蟹膏浓郁。',
    image: 'https://sihongpangxie.site:17778//crmebimage/public/product/2024/11/11/0664015afec04a4b9a623a6aade1a2b2gypru1201b.jpg',
    category: '洪泽湖大闸蟹',
    weight: '3.5两/只',
    origin: '江苏洪泽湖',
    featured: true
  },
  {
    id: 5,
    name: '全母套餐 3.0两 8只装',
    description: '精选洪泽湖大闸蟹，全母蟹套餐，每只3.0两，8只装。蟹黄浓郁，肉质鲜美。',
    image: 'https://sihongpangxie.site:17778//crmebimage/public/product/2024/11/11/0664015afec04a4b9a623a6aade1a2b2gypru1201b.jpg',
    category: '洪泽湖大闸蟹',
    weight: '3.0两/只',
    origin: '江苏洪泽湖',
    featured: false
  },
  {
    id: 6,
    name: '公母对半套餐 3公+2母 8只装',
    description: '精选洪泽湖大闸蟹，公母对半套餐，3两公蟹+2两母蟹，共8只装。',
    image: 'https://sihongpangxie.site:17778//crmebimage/public/product/2024/11/11/0664015afec04a4b9a623a6aade1a2b2gypru1201b.jpg',
    category: '洪泽湖大闸蟹',
    weight: '3两公+2两母',
    origin: '江苏洪泽湖',
    featured: false
  },
  {
    id: 7,
    name: '公母对半 3.5公+2.5母 8只装',
    description: '精选洪泽湖大闸蟹，公母对半套餐，3.5两公蟹+2.5两母蟹，共8只装。',
    image: 'https://sihongpangxie.site:17778//crmebimage/public/product/2024/11/11/0664015afec04a4b9a623a6aade1a2b2gypru1201b.jpg',
    category: '洪泽湖大闸蟹',
    weight: '3.5两公+2.5两母',
    origin: '江苏洪泽湖',
    featured: false
  },
  {
    id: 8,
    name: '公母对半套餐 4公+3母 8只装',
    description: '精选洪泽湖大闸蟹，公母对半套餐，4两公蟹+3两母蟹，共8只装。',
    image: 'https://sihongpangxie.site:17778//crmebimage/public/product/2024/11/11/0664015afec04a4b9a623a6aade1a2b2gypru1201b.jpg',
    category: '洪泽湖大闸蟹',
    weight: '4两公+3两母',
    origin: '江苏洪泽湖',
    featured: false
  },
  {
    id: 9,
    name: '全公套餐 4.0公 8只装',
    description: '精选洪泽湖大闸蟹，全公蟹套餐，每只4.0两，8只装。个大肉肥，蟹膏丰富。',
    image: 'https://sihongpangxie.site:17778//crmebimage/public/product/2024/11/11/0664015afec04a4b9a623a6aade1a2b2gypru1201b.jpg',
    category: '洪泽湖大闸蟹',
    weight: '4.0两/只',
    origin: '江苏洪泽湖',
    featured: false
  },
  {
    id: 10,
    name: '2.8-3.2两 残公蟹3斤',
    description: '精选洪泽湖大闸蟹，残公蟹，每只2.8-3.2两，3斤装。价格实惠，品质保证。',
    image: 'https://sihongpangxie.site:17778//crmebimage/public/product/2024/11/11/0664015afec04a4b9a623a6aade1a2b2gypru1201b.jpg',
    category: '洪泽湖大闸蟹',
    weight: '2.8-3.2两/只',
    origin: '江苏洪泽湖',
    featured: false
  },
  {
    id: 11,
    name: '1.8-2.2两残母蟹3斤',
    description: '精选洪泽湖大闸蟹，残母蟹，每只1.8-2.2两，3斤装。价格实惠，品质保证。',
    image: 'https://sihongpangxie.site:17778//crmebimage/public/product/2024/11/11/0664015afec04a4b9a623a6aade1a2b2gypru1201b.jpg',
    category: '洪泽湖大闸蟹',
    weight: '1.8-2.2两/只',
    origin: '江苏洪泽湖',
    featured: false
  },
  {
    id: 12,
    name: '2母3公残蟹对半3斤',
    description: '精选洪泽湖大闸蟹，残蟹对半，2只母蟹+3只公蟹，3斤装。价格实惠，品质保证。',
    image: 'https://sihongpangxie.site:17778//crmebimage/public/product/2024/11/11/0664015afec04a4b9a623a6aade1a2b2gypru1201b.jpg',
    category: '洪泽湖大闸蟹',
    weight: '2母3公',
    origin: '江苏洪泽湖',
    featured: false
  },
  {
    id: 13,
    name: '老头蟹3斤',
    description: '精选洪泽湖大闸蟹，老头蟹，3斤装。价格实惠，品质保证。',
    image: 'https://sihongpangxie.site:17778//crmebimage/public/content/2024/11/12/13e44bad186a4c9eacf54f7e2e4bbc70su1is0iq80.png',
    category: '洪泽湖大闸蟹',
    weight: '3斤装',
    origin: '江苏洪泽湖',
    featured: false
  }
];

// 从链上获取价格和库存
export async function fetchChainData() {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(BUSINESS_LOGIC_ADDRESS, CrabUSDCABI.abi, provider);
    
    const nextGiftBoxId = await contract.nextGiftBoxId();
    const chainData = new Map();
    
    for (let i = 1; i < nextGiftBoxId; i++) {
      const giftBox = await contract.giftBoxes(i);
      if (giftBox.active) {
        chainData.set(i, {
          price: Number(ethers.utils.formatUnits(giftBox.price, 6)),
          stock: Number(giftBox.stock)
        });
      }
    }
    
    return chainData;
  } catch (error) {
    console.error('Error fetching chain data:', error);
    return new Map();
  }
}

// 合并本地数据和链上数据
export async function getProducts(): Promise<Product[]> {
  const chainData = await fetchChainData();
  
  return localProducts.map(product => {
    const chainInfo = chainData.get(product.id);
    return {
      ...product,
      price: chainInfo?.price ?? 0,
      stock: chainInfo?.stock ?? 0
    };
  });
}

// 修改其他函数以使用异步获取的数据
export const getProductById = async (id: number): Promise<Product | undefined> => {
  const products = await getProducts();
  return products.find(product => product.id === id);
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const products = await getProducts();
  return products.filter(product => product.featured);
};

export const filterProducts = async (filters: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
}): Promise<Product[]> => {
  const products = await getProducts();
  return products.filter(product => {
    if (filters.category && filters.category !== 'all' && product.category !== filters.category) {
      return false;
    }
    
    if (filters.minPrice && product.price < filters.minPrice) {
      return false;
    }
    
    if (filters.maxPrice && product.price > filters.maxPrice) {
      return false;
    }
    
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return product.name.toLowerCase().includes(searchLower) ||
             product.description.toLowerCase().includes(searchLower);
    }
    
    return true;
  });
};

// 保持分类数据不变
export const categories = [
  { id: 'all', name: '全部大闸蟹' },
  { id: 'king', name: '公蟹' },
  { id: 'snow', name: '母蟹' },
  { id: 'dungeness', name: '公母对半' }
];