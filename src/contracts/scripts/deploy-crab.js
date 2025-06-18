const { ethers } = require("hardhat");

async function main() {
  // 1. 环境变量或写死：你在 Remix 上部署的 MockUSDC 地址
  const USDC_ADDRESS = process.env.USDC_ADDRESS || "0xe6e340d132b5f46d1e472debcd681b2abc16e57e";

  // 2. 获取默认 signer（部署者）
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("Using USDC at:", USDC_ADDRESS);

  // 3. 部署 CrabUSDC
  const Crab = await ethers.getContractFactory("CrabUSDC");
  const crab = await Crab.deploy(USDC_ADDRESS);
  await crab.waitForDeployment();
  const crabAddress = await crab.getAddress();

  // ← 关键修正：直接用 crab.address
  console.log("CrabUSDC deployed to:", crabAddress);

  // 4. 准备要上链的商品列表（USDC 6 decimals）
  const products = [
    {
      name: "全母套餐 2.0两 8只装",
      description: "精选洪泽湖大闸蟹，全母蟹套餐，每只2.0两，8只装。蟹黄饱满，口感细腻。",
      price: ethers.parseUnits("50.00", 6), // Adjusted to $50
      stock: 999,
      active: true,
    },
    {
      name: "全母套餐 2.5两 8只装",
      description: "精选洪泽湖大闸蟹，全母蟹套餐，每只2.5两，8只装。蟹黄丰腴，品质上乘。",
      price: ethers.parseUnits("60.00", 6), // Adjusted to $60
      stock: 200,
      active: true,
    },
    {
      name: "全公套餐 3.0两 8只装",
      description: "精选洪泽湖大闸蟹，全公蟹套餐，每只3.0两，8只装。肉质饱满，蟹膏丰富。",
      price: ethers.parseUnits("70.00", 6), // Adjusted to $70
      stock: 199,
      active: true,
    },
    {
      name: "全公套餐 3.5两 8只装",
      description: "精选洪泽湖大闸蟹，全公蟹套餐，每只3.5两，8只装。个大肉肥，蟹膏浓郁。",
      price: ethers.parseUnits("80.00", 6), // Adjusted to $80
      stock: 197,
      active: true,
    },
    {
      name: "全母套餐 3.0两 8只装",
      description: "精选洪泽湖大闸蟹，全母蟹套餐，每只3.0两，8只装。蟹黄浓郁，肉质鲜美。",
      price: ethers.parseUnits("75.00", 6), // Adjusted to $75
      stock: 197,
      active: true,
    },
    {
      name: "公母对半套餐 3公+2母 8只装",
      description: "精选洪泽湖大闸蟹，公母对半套餐，3两公蟹+2两母蟹，共8只装。",
      price: ethers.parseUnits("65.00", 6), // Adjusted to $65
      stock: 997,
      active: true,
    },
    {
      name: "公母对半套餐 3.5公+2.5母 8只装",
      description: "精选洪泽湖大闸蟹，公母对半套餐，3.5两公蟹+2.5两母蟹，共8只装。",
      price: ethers.parseUnits("70.00", 6), // Adjusted to $70
      stock: 199,
      active: true,
    },
    {
      name: "公母对半套餐 4公+3母 8只装",
      description: "精选洪泽湖大闸蟹，公母对半套餐，4两公蟹+3两母蟹，共8只装。",
      price: ethers.parseUnits("85.00", 6), // Adjusted to $85
      stock: 196,
      active: true,
    },
    {
      name: "全公套餐 4.0两 8只装",
      description: "精选洪泽湖大闸蟹，全公蟹套餐，每只4.0两，8只装。个大肉肥，蟹膏丰富。",
      price: ethers.parseUnits("90.00", 6), // Adjusted to $90
      stock: 1998,
      active: true,
    },
    {
      name: "2.8-3.2两 残公蟹3斤",
      description: "精选洪泽湖大闸蟹，残公蟹，每只2.8-3.2两，3斤装。价格实惠，品质保证。",
      price: ethers.parseUnits("40.00", 6), // Adjusted to $40
      stock: 798,
      active: true,
    },
    {
      name: "1.8-2.2两 残母蟹3斤",
      description: "精选洪泽湖大闸蟹，残母蟹，每只1.8-2.2两，3斤装。价格实惠，品质保证。",
      price: ethers.parseUnits("35.00", 6), // Adjusted to $35
      stock: 799,
      active: true,
    },
    {
      name: "2母3公 残蟹对半3斤",
      description: "精选洪泽湖大闸蟹，残蟹对半，2只母蟹+3只公蟹，3斤装。价格实惠，品质保证。",
      price: ethers.parseUnits("38.00", 6), // Adjusted to $38
      stock: 798,
      active: true,
    },
    {
      name: "老头蟹3斤",
      description: "精选洪泽湖大闸蟹，老头蟹，3斤装。价格实惠，品质保证。",
      price: ethers.parseUnits("30.00", 6), // Adjusted to $30
      stock: 100,
      active: true,
    }
  ];

  // 5. 循环上链
  for (const p of products) {
    const tx = await crab.addOrUpdateGiftBox(
      p.name,
      p.description,
      p.price,
      p.stock,
      p.active
    );
    await tx.wait();
    console.log(`✅ 已上链: ${p.name}`);
  }

  console.log("🎉 所有商品已成功上链！");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});