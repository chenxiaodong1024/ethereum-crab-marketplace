import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, User, Wallet, ShoppingBag, LogOut, ExternalLink } from 'lucide-react';
import { useWeb3 } from '../contexts/Web3Context';
import { useTranslation } from 'react-i18next';
import { getCrabContract } from '../utils/contract';
import blockies from 'ethereum-blockies-base64';
import { ethers } from 'ethers';

const statusMap = {
  0: '待发货',
  1: '已发货',
  2: '退款申请中',
  3: '已退款',
  4: '退款被拒绝'
};

const AccountPage: React.FC = () => {
  const { account, isConnected, connect, disconnect, networkName } = useWeb3();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const { t } = useTranslation();
  
  // Format account address
  const formatAccount = (account: string) => {
    return `${account.substring(0, 8)}...${account.substring(account.length - 6)}`;
  };
  
  // If not connected, show connect screen
  if (!isConnected) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <div className="max-w-md w-full text-center">
          <Wallet size={64} className="mx-auto text-gray-600 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">{t('account.wallet.connect')}</h2>
          <p className="text-gray-400 mb-6">
            {t('account.wallet.connectDesc')}
          </p>
          <button 
            onClick={connect}
            className="btn btn-primary w-full max-w-xs mx-auto"
          >
            {t('header.connect')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <h1 className="text-3xl font-bold text-white mb-8">{t('account.title')}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="text-center mb-6">
                {account && (
                  <img
                    src={blockies(account)}
                    alt="avatar"
                    className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-blue-900/30 bg-white"
                  />
                )}
                <h3 className="text-lg font-semibold text-white">{formatAccount(account || '')}</h3>
                <p className="text-gray-400 text-sm">{t('account.wallet.connected')}</p>
              </div>
              
              <div className="bg-blue-900/20 rounded-lg p-4 mb-6 border border-blue-800/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{t('account.wallet.connected')}</p>
                    <p className="text-blue-400 font-medium">{formatAccount(account || '')}</p>
                  </div>
                  <a 
                    href={`https://etherscan.io/address/${account}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
                <p className="text-xs text-gray-400 mt-2">{t('account.wallet.network')}: {networkName}</p>
              </div>
              
              <nav className="space-y-1">
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'orders' 
                      ? 'bg-blue-900/30 text-blue-400' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Package size={18} />
                  <span>{t('account.orders.title')}</span>
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'profile' 
                      ? 'bg-blue-900/30 text-blue-400' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <User size={18} />
                  <span>{t('account.profile.title')}</span>
                </button>
                <button 
                  onClick={() => setActiveTab('purchases')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'purchases' 
                      ? 'bg-blue-900/30 text-blue-400' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <ShoppingBag size={18} />
                  <span>{t('account.purchases.title')}</span>
                </button>
                <button 
                  onClick={disconnect}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-700 transition-colors"
                >
                  <LogOut size={18} />
                  <span>{t('account.wallet.disconnect')}</span>
                </button>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-xl p-6">
              {/* Order History Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-6">{t('account.orders.title')}</h2>
                  <MyOrdersOnChain account={account} isConnected={isConnected} />
                </div>
              )}
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-6">{t('account.profile.title')}</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">{t('account.profile.walletAddress')}</span>
                      <span className="text-white">{formatAccount(account || '')}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Purchases Tab */}
              {activeTab === 'purchases' && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-6">{t('account.purchases.title')}</h2>
                  <MyOrdersOnChain account={account} isConnected={isConnected} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function MyOrdersOnChain({ account, isConnected }: { account: string | null, isConnected: boolean }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(0);
  useEffect(() => {
    if (!isConnected) return;
    async function fetchOrders() {
      setLoading(true);
      try {
        const contract = getCrabContract();
        const result = await contract.getMyOrders();
        setOrders(result);
      } catch (e) {
        setOrders([]);
      }
      setLoading(false);
    }
    fetchOrders();
  }, [account, isConnected, refreshFlag]);

  // 申请退款
  const handleRequestRefund = async (orderId: any) => {
    try {
      const contract = getCrabContract();
      const tx = await contract.requestRefund(orderId);
      await tx.wait();
      setRefreshFlag(f => f + 1);
    } catch (e) {
      alert('申请退款失败: ' + (e && e.message ? e.message : e));
    }
  };

  if (!isConnected) return <div>请先连接钱包</div>;
  if (loading) return <div>加载中...</div>;
  if (!orders || orders.length === 0) return <div>暂无链上订单</div>;
  return (
    <div className="space-y-4">
      {orders.map(order => (
        <div key={order.orderId.toString()} className="bg-gray-700 rounded-lg p-4">
          <div className="flex flex-wrap justify-between items-start mb-4">
            <div>
              <h3 className="text-white font-medium">订单ID: {order.orderId.toString()}</h3>
              <p className="text-sm text-gray-400">商品ID: {order.giftBoxId.toString()}</p>
              <p className="text-sm text-gray-400">数量: {order.quantity.toString()}</p>
              <p className="text-sm text-gray-400">金额: {Number(order.totalAmount) / 1e18} ETH</p>
              <p className="text-sm text-gray-400">收货信息: {order.shippingInfo}</p>
              <p className="text-sm text-gray-400">下单时间: {new Date(Number(order.timestamp) * 1000).toLocaleString()}</p>
              {order.fulfilled && order.trackingNumber && (
                <p className="text-sm text-blue-400 mt-1">快递单号: {order.trackingNumber}</p>
              )}
              <p className="text-sm text-gray-400">状态: {statusMap[order.status]}</p>
              {/* 仅待发货可申请退款 */}
              {order.status === 0 && (
                <button
                  className="ml-2 px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleRequestRefund(order.orderId)}
                >
                  申请退款
                </button>
              )}
              {order.status === 3 && order.refundAmount && (
                <p className="text-sm text-yellow-400 mt-1">退款金额: {ethers.utils.formatEther(order.refundAmount)} ETH</p>
              )}
            </div>
            <div className="text-right">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${order.fulfilled ? 'bg-green-900/30 text-green-400' : 'bg-blue-900/30 text-blue-400'}`}>
                {order.fulfilled ? '已发货' : '未发货'}
              </span>
              <p className="text-xs text-gray-400 mt-2">{order.fulfilled ? '订单已发货，等待收货' : '订单待发货'}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AccountPage;