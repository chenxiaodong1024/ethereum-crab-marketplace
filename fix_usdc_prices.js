// 用于将商品价格全部转为USDC整数（6位小数），并输出新数组

const rawProducts = [
  { name: "全母套餐 2.0两 8只装", price: "0.011", description: "精选洪泽湖大闸蟹，全母蟹套餐，每只2.0两，8只装。蟹黄饱满，口感细腻。", stock: 999, active: true },
  { name: "全母套餐 2.5两 8只装", price: "0.016", description: "精选洪泽湖大闸蟹，全母蟹套餐，每只2.5两，8只装。蟹黄丰腴，品质上乘。", stock: 200, active: true },
  { name: "全公套餐 3.0两 8只装", price: "0.011", description: "精选洪泽湖大闸蟹，全公蟹套餐，每只3.0两，8只装。肉质饱满，蟹膏丰富。", stock: 199, active: true },
  { name: "全公套餐 3.5两 8只装", price: "0.016", description: "精选洪泽湖大闸蟹，全公蟹套餐，每只3.5两，8只装。个大肉肥，蟹膏浓郁。", stock: 197, active: true },
  { name: "全母套餐 3.0两 8只装", price: "0.021", description: "精选洪泽湖大闸蟹，全母蟹套餐，每只3.0两，8只装。蟹黄浓郁，肉质鲜美。", stock: 197, active: true },
  { name: "公母对半套餐 3公+2母 8只装", price: "0.011", description: "精选洪泽湖大闸蟹，公母对半套餐，3两公蟹+2两母蟹，共8只装。", stock: 997, active: true },
  { name: "公母对半套餐 3.5公+2.5母 8只装", price: "0.016", description: "精选洪泽湖大闸蟹，公母对半套餐，3.5两公蟹+2.5两母蟹，共8只装。", stock: 199, active: true },
  { name: "公母对半套餐 4公+3母 8只装", price: "0.021", description: "精选洪泽湖大闸蟹，公母对半套餐，4两公蟹+3两母蟹，共8只装。", stock: 196, active: true },
  { name: "全公套餐 4.0两 8只装", price: "0.021", description: "精选洪泽湖大闸蟹，全公蟹套餐，每只4.0两，8只装。个大肉肥，蟹膏丰富。", stock: 1998, active: true },
  { name: "2.8-3.2两 残公蟹3斤", price: "0.011", description: "精选洪泽湖大闸蟹，残公蟹，每只2.8-3.2两，3斤装。价格实惠，品质保证。", stock: 798, active: true },
  { name: "1.8-2.2两 残母蟹3斤", price: "0.011", description: "精选洪泽湖大闸蟹，残母蟹，每只1.8-2.2两，3斤装。价格实惠，品质保证。", stock: 799, active: true },
  { name: "2母3公 残蟹对半3斤", price: "0.011", description: "精选洪泽湖大闸蟹，残蟹对半，2只母蟹+3只公蟹，3斤装。价格实惠，品质保证。", stock: 798, active: true },
  { name: "老头蟹3斤", price: "0.011", description: "精选洪泽湖大闸蟹，老头蟹，3斤装。价格实惠，品质保证。", stock: 1, active: true },
];

function toUSDCInt(priceStr) {
  // 转为USDC整数（6位小数）
  return Math.round(parseFloat(priceStr) * 1e6);
}

const products = rawProducts.map(p => ({
  ...p,
  price: toUSDCInt(p.price)
}));

console.log(JSON.stringify(products, null, 2)); 