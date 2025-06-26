import { ethers } from 'ethers';
import CrabUSDCABI from '../contracts/CrabUSDC.json';

// 合约地址 - Sepolia 测试网
export const CRAB_USDC_ADDRESS = '0xA044057E59035d455B2C23B41C6B29BdadEcd967'; // 用户部署的测试 USDC 地址
export const BUSINESS_LOGIC_ADDRESS = '0x6A98050e97CE3224a8E8df91973f6Abf3C977FAb'; // 新的 Sepolia CrabUSDC 合约地址

// CrabUSDC代币合约ABI
const CRAB_USDC_ABI = [
  'function approve(address spender, uint256 amount) public returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function transfer(address to, uint256 amount) public returns (bool)',
  'function mint(address to, uint256 amount) public'
];

// 业务逻辑合约ABI
const BUSINESS_LOGIC_ABI = [
  'function buyGiftBox(uint256 giftBoxId, uint256 quantity, string memory shippingInfo) public',
  'function owner() view returns (address)',
  'function withdraw() public',
  'function fulfillOrder(uint256 orderId, string memory trackingNumber) public',
  'function approveRefund(uint256 orderId, uint256 amount) public',
  'function rejectRefund(uint256 orderId) public',
  'function requestRefund(uint256 orderId) public'
];

export const getCrabContract = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(BUSINESS_LOGIC_ADDRESS, CrabUSDCABI.abi, signer);
};

export const getUSDCContract = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(CRAB_USDC_ADDRESS, CRAB_USDC_ABI, signer);
};

// 检查 USDC 余额
export const checkUSDCBalance = async (address: string): Promise<string> => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const usdcContract = new ethers.Contract(CRAB_USDC_ADDRESS, CRAB_USDC_ABI, provider);
  const balance = await usdcContract.balanceOf(address);
  return ethers.utils.formatUnits(balance, 6); // USDC 有 6 位小数
};

// Mint 测试 USDC (仅用于测试)
export const mintTestUSDC = async (address: string, amount: string): Promise<void> => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const usdcContract = new ethers.Contract(CRAB_USDC_ADDRESS, CRAB_USDC_ABI, signer);
  
  const amountWei = ethers.utils.parseUnits(amount, 6);
  const tx = await usdcContract.mint(address, amountWei);
  await tx.wait();
}; 