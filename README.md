# 🦀 Ethereum Crab Marketplace

> **Hongze Lake Crabs on the Ethereum Blockchain**

A decentralized marketplace for authentic Hongze Lake crabs, powered by Ethereum smart contracts and USDC payments.

---

# 🦀 以太坊螃蟹市场

> **区块链上的洪泽湖大闸蟹**

基于以太坊智能合约和 USDC 支付的洪泽湖大闸蟹去中心化交易平台。

---

## ✨ Features | 功能特色

- 🦀 **Authentic Hongze Lake Crabs** - Direct from source, blockchain-verified
- 💰 **USDC Payments** - Secure, transparent transactions on Ethereum
- 🔗 **Smart Contract Integration** - Automated order processing and inventory management
- 🌐 **Multi-language Support** - Chinese and English interfaces
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🔒 **Wallet Integration** - MetaMask and other Web3 wallet support

- 🦀 **正宗洪泽湖大闸蟹** - 源头直供，区块链验证
- 💰 **USDC 支付** - 以太坊上安全透明的交易
- 🔗 **智能合约集成** - 自动化订单处理和库存管理
- 🌐 **多语言支持** - 中英文界面
- 📱 **响应式设计** - 支持桌面和移动设备
- 🔒 **钱包集成** - 支持 MetaMask 等 Web3 钱包

## 🛠️ Tech Stack | 技术栈

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Blockchain**: Ethereum + Ethers.js
- **Payments**: USDC (ERC-20)
- **Smart Contracts**: Solidity
- **Internationalization**: i18next

- **前端**: React 18 + TypeScript + Vite
- **样式**: Tailwind CSS
- **区块链**: 以太坊 + Ethers.js
- **支付**: USDC (ERC-20)
- **智能合约**: Solidity
- **国际化**: i18next

## 🚀 Quick Start | 快速开始

### Prerequisites | 前置要求

- Node.js 16+ 
- MetaMask or other Web3 wallet
- USDC tokens on Ethereum network

- Node.js 16+
- MetaMask 或其他 Web3 钱包
- 以太坊网络上的 USDC 代币

### Installation | 安装

```bash
# Clone the repository
git clone https://github.com/chenxiaodong1024/ethereum-crab-marketplace.git

# Navigate to project directory
cd ethereum-crab-marketplace

# Install dependencies
npm install

# Start development server
npm run dev
```

```bash
# 克隆仓库
git clone https://github.com/chenxiaodong1024/ethereum-crab-marketplace.git

# 进入项目目录
cd ethereum-crab-marketplace

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### Smart Contract Deployment | 智能合约部署

1. Deploy the `CrabUSDC.sol` contract to Ethereum network
2. Update the contract address in `src/utils/contract.ts`
3. Configure USDC token address

1. 将 `CrabUSDC.sol` 合约部署到以太坊网络
2. 在 `src/utils/contract.ts` 中更新合约地址
3. 配置 USDC 代币地址

## 📋 Project Structure | 项目结构

```
src/
├── components/          # React components
├── contexts/           # React contexts (Web3)
├── contracts/          # Smart contract ABIs
├── data/              # Product data and API functions
├── i18n/              # Internationalization
├── pages/             # Page components
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

```
src/
├── components/          # React 组件
├── contexts/           # React 上下文 (Web3)
├── contracts/          # 智能合约 ABI
├── data/              # 产品数据和 API 函数
├── i18n/              # 国际化
├── pages/             # 页面组件
├── types/             # TypeScript 类型定义
└── utils/             # 工具函数
```

## 🔗 Smart Contract | 智能合约

The marketplace uses a custom smart contract (`CrabUSDC.sol`) that handles:

- Product inventory management
- Order processing
- USDC payment processing
- Refund management
- Order fulfillment tracking

该市场使用自定义智能合约 (`CrabUSDC.sol`)，处理以下功能：

- 产品库存管理
- 订单处理
- USDC 支付处理
- 退款管理
- 订单履行跟踪

## 🌍 Supported Networks | 支持的网络

- **Ethereum Mainnet** (Production)
- **Sepolia Testnet** (Testing)
- **Local Development** (Hardhat/Ganache)

- **以太坊主网** (生产环境)
- **Sepolia 测试网** (测试环境)
- **本地开发** (Hardhat/Ganache)

## �� Screenshots | 截图

### 🏠 Homepage | 首页
![Homepage](docs/images/首页.png)

### 🦀 Products Page | 商品列表
![Products Page](docs/images/商品列表.png)

### 🛒 Checkout Process | 下单流程
![Checkout Address](docs/images/下单地址.png)
![Order Result](docs/images/下单结果.png)

### 👤 User Account | 用户中心
![Buyer Orders](docs/images/买家订单记录.png)

### 🏪 Seller Center | 卖家中心
![Seller Center](docs/images/卖家中心.png)

## 🤝 Contributing | 贡献

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

1. Fork 该仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 License | 许可证

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。

## 🦀 About Hongze Lake Crabs | 关于洪泽湖大闸蟹

Hongze Lake crabs are renowned for their superior quality and taste. Our marketplace ensures:

- **Direct from Source**: No middlemen, fresh from Hongze Lake
- **Quality Guarantee**: Blockchain-verified authenticity
- **Transparent Supply Chain**: Every crab is traceable
- **Fair Pricing**: Competitive prices with transparent costs

洪泽湖大闸蟹以其卓越的品质和口感而闻名。我们的市场确保：

- **源头直供**: 无中间商，直接从洪泽湖新鲜供应
- **品质保证**: 区块链验证的真实性
- **透明供应链**: 每只螃蟹都可追溯
- **公平定价**: 具有透明成本的竞争性价格

## 📞 Contact | 联系方式

- **Website**: [www.sihongpangxie.site](https://www.sihongpangxie.site)
- **Email**: chenxiaodong1024@gmail.com
- **Phone**: +86 17766094698
- **Address**: Hongze Lake Crab Base, Sihong County, Suqian City, Jiangsu Province

- **网站**: [www.sihongpangxie.site](https://www.sihongpangxie.site)
- **邮箱**: chenxiaodong1024@gmail.com
- **电话**: +86 17766094698
- **地址**: 江苏省宿迁市泗洪县洪泽湖大闸蟹基地

---

**Built with ❤️ for the Ethereum ecosystem and crab lovers worldwide!**

**为以太坊生态系统和全球螃蟹爱好者而建！❤️** 
