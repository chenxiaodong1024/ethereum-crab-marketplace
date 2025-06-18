const { ethers } = require("hardhat");

async function main() {
  // 1. 环境变量或写死：你在 Remix 上部署的 CrabUSDC 地址
  const CRAB_ADDRESS = process.env.CRAB_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // 替换为你的部署地址

  // 2. 获取默认 signer（部署者）
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("Using CrabUSDC contract at:", CRAB_ADDRESS);

  // 3. 获取 CrabUSDC 合约实例
  const CrabUSDC = await ethers.getContractFactory("CrabUSDC");
  const crab = await CrabUSDC.attach(CRAB_ADDRESS);

  // 4. 查询合约中的所有商品信息
  const totalGiftBoxes = await crab.nextGiftBoxId();  // 获取总商品数量
  console.log("Total gift boxes:", totalGiftBoxes.toString());

  for (let i = 1; i < totalGiftBoxes; i++) {
    try {
      const giftBox = await crab.giftBoxes(i);  // 获取每个商品的信息
      console.log(`商品ID: ${giftBox[0]}`);  // 商品ID
      console.log(`名称: ${giftBox[1]}`);  // 商品名称
      console.log(`描述: ${giftBox[2]}`);  // 商品描述

      // 打印 giftBox 的价格字段，不做任何转换
      console.log(`价格: ${giftBox[3]}`);  // 直接打印价格字段

      console.log(`库存: ${giftBox[4]}`);  // 库存
      console.log(`是否上架: ${giftBox[5] ? "是" : "否"}`);  // 上架状态
      console.log("-----------------------------------------------------");
    } catch (error) {
      console.error(`查询商品ID: ${i} 时出错:`, error);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
