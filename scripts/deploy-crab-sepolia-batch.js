const { ethers } = require("hardhat");

async function main() {
  // sepolia
  const USDC_ADDRESS = process.env.USDC_ADDRESS || "0xA044057E59035d455B2C23B41C6B29BdadEcd967";

  // 2. 获取默认 signer（部署者）
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("Using USDC at:", USDC_ADDRESS);

  // 3. 部署 CrabUSDC
  const Crab = await ethers.getContractFactory("CrabUSDC");
  const crab = await Crab.deploy(USDC_ADDRESS);
  await crab.waitForDeployment();
  const crabAddress = await crab.getAddress();

  console.log("CrabUSDC deployed to:", crabAddress);

  // 4. 优化后的商品数据 - 最小化数据结构
  const products = [
    { name: "全母套餐 2.0两 8只装", price: ethers.parseUnits("50.00", 6), stock: 999 },
    { name: "全母套餐 2.5两 8只装", price: ethers.parseUnits("60.00", 6), stock: 200 },
    { name: "全公套餐 3.0两 8只装", price: ethers.parseUnits("70.00", 6), stock: 199 },
    { name: "全公套餐 3.5两 8只装", price: ethers.parseUnits("80.00", 6), stock: 197 },
    { name: "全母套餐 3.0两 8只装", price: ethers.parseUnits("75.00", 6), stock: 197 },
    { name: "公母对半套餐 3公+2母 8只装", price: ethers.parseUnits("65.00", 6), stock: 997 },
    { name: "公母对半套餐 3.5公+2.5母 8只装", price: ethers.parseUnits("70.00", 6), stock: 199 },
    { name: "公母对半套餐 4公+3母 8只装", price: ethers.parseUnits("85.00", 6), stock: 196 },
    { name: "全公套餐 4.0两 8只装", price: ethers.parseUnits("90.00", 6), stock: 1998 },
    { name: "2.8-3.2两 残公蟹3斤", price: ethers.parseUnits("40.00", 6), stock: 798 },
    { name: "1.8-2.2两 残母蟹3斤", price: ethers.parseUnits("35.00", 6), stock: 799 },
    { name: "2母3公 残蟹对半3斤", price: ethers.parseUnits("38.00", 6), stock: 798 },
    { name: "老头蟹3斤", price: ethers.parseUnits("30.00", 6), stock: 100 }
  ];

  // 5. 批量上链 - 分批处理以减少单次交易大小
  console.log("开始批量上链商品...");
  
  const batchSize = 3; // 每批处理3个商品
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    console.log(`处理批次 ${Math.floor(i / batchSize) + 1}/${Math.ceil(products.length / batchSize)}`);
    
    for (const p of batch) {
      const tx = await crab.addOrUpdateGiftBox(
        p.name,
        "", // 空描述，节省 gas
        p.price,
        p.stock,
        true // 默认激活
      );
      await tx.wait();
      console.log(`✅ 已上链: ${p.name}`);
    }
  }

  console.log("🎉 所有商品已成功上链！");
  console.log("📊 Gas 优化说明:");
  console.log("- 移除了商品描述信息，节省大量 gas");
  console.log("- 使用空字符串替代长描述");
  console.log("- 分批处理避免单次交易过大");
  console.log("- 描述信息建议存储在 IPFS 或前端代码中");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 