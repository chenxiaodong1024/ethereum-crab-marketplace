import { ethers } from 'ethers';
import CrabUSDCABI from '../contracts/CrabUSDC.json';

// 合约地址 - 在Hardhat测试环境中的正确地址
export const CRAB_USDC_ADDRESS = '0xe6e340d132b5f46d1e472debcd681b2abc16e57e'; // CrabUSDC代币合约地址
export const BUSINESS_LOGIC_ADDRESS = '0xc3e53F4d16Ae77Db1c982e75a937B9f60FE63690'; // 业务逻辑合约地址（最新）

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