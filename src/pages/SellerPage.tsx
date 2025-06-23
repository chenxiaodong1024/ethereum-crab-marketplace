import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '../contexts/Web3Context';
import { getCrabContract, getUSDCContract } from '../utils/contract';
import { ethers } from 'ethers';

// 定义Order类型，避免any类型导致崩溃
interface Order {
  orderId: string;
  buyer: string;
  giftBoxId: number;
  quantity: number;
  totalAmount: string;
  shippingInfo: string;
  timestamp: number;
  fulfilled: boolean;
  trackingNumber: string;
  giftBoxName?: string;
  amountEth?: string;
  status: number;
  refundAmount?: string;
}

const SellerPage: React.FC = () => {
  const { t } = useTranslation();
  const { account, isConnected } = useWeb3();
  const [contractBalance, setContractBalance] = useState<string>('0');
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [refundModal, setRefundModal] = useState<{ show: boolean, orderId: string | null, amount: string }>({ show: false, orderId: null, amount: '' });

  const statusMap = {
    0: t('seller.pending'),
    1: t('seller.fulfilled'),
    2: t('seller.refundPending'),
    3: t('seller.refunded'),
    4: t('seller.refundRejected')
  };

  useEffect(() => {
    if (isConnected && account) {
      fetchData();
    }
  }, [isConnected, account]);

  useEffect(() => {
    async function checkOwner() {
      const contract = getCrabContract();
      const signer = contract.signer;
      const owner = await contract.owner();
      const signerAddr = signer && signer.getAddress ? await signer.getAddress() : '';
      setIsOwner(signerAddr.toLowerCase() === owner.toLowerCase());
    }
    if (isConnected && account) checkOwner();
  }, [isConnected, account]);

  const fetchData = async () => {
    try {
      const contract = getCrabContract();
      const usdcContract = getUSDCContract();
      // 获取合约余额
      const balance = await usdcContract.balanceOf(contract.address);
      setContractBalance(ethers.utils.formatUnits(balance, 6)); // USDC 6位小数
      // 获取所有订单（遍历orders）
      const nextOrderId = await contract.nextOrderId();
      const orderPromises = [];
      for (let i = 1; i < nextOrderId; i++) {
        orderPromises.push(contract.orders(i));
      }
      const allOrders = await Promise.all(orderPromises);

      // Debugging: Log raw order data
      console.log("Raw orders from contract:", allOrders);

      // 收集所有giftBoxId
      const giftBoxIds = Array.from(new Set(allOrders.map((order: any) => order.giftBoxId.toString())));
      // 批量查giftBoxes
      const giftBoxMap: Record<string, string> = {};
      await Promise.all(giftBoxIds.map(async (id) => {
        try {
          const box = await contract.giftBoxes(id);
          giftBoxMap[id] = box.name;
        } catch {
          giftBoxMap[id] = 'N/A';
        }
      }));
      // 格式化订单数据
      const ordersWithSpec = allOrders.map((order: any) => ({
        ...order,
        orderId: order.orderId?.toString(),
        buyer: order.buyer,
        giftBoxId: order.giftBoxId?.toString(),
        quantity: order.quantity?.toString(),
        totalAmount: order.totalAmount ? ethers.utils.formatUnits(order.totalAmount, 6) : 'N/A', // 重新格式化为USDC金额
        timestamp: order.timestamp.toNumber() * 1000, // 将秒级时间戳转换为毫秒
        giftBoxName: giftBoxMap[order.giftBoxId?.toString()] || 'N/A',
        status: order.status ?? 0,
        refundAmount: order.refundAmount ? ethers.utils.formatUnits(order.refundAmount, 6) : null // USDC 6位小数
      }));

      // Debugging: Log formatted orders
      console.log("Formatted orders for display:", ordersWithSpec);
      console.log("Raw order timestamp and converted timestamp for debugging:", allOrders.map((order: any) => ({ raw: order.timestamp.toString(), converted: order.timestamp.toNumber() * 1000 })));
      console.log("Raw giftBoxId and quantity for debugging:", allOrders.map((order: any) => ({ giftBoxId: order.giftBoxId.toString(), quantity: order.quantity.toString() })));

      setOrders(ordersWithSpec);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (parseFloat(contractBalance) <= 0) {
      alert(t('seller.noBalance'));
      return;
    }
    try {
      const contract = getCrabContract();
      const tx = await contract.withdraw();
      await tx.wait();
      await fetchData(); // 刷新数据
    } catch (e: unknown) {
      console.error('Error withdrawing:', e);
      alert('提现失败: ' + (e instanceof Error ? e.message : String(e)));
    }
  };

  // 新增：发货弹窗逻辑
  const openFulfillModal = (orderId: string) => {
    setCurrentOrderId(orderId);
    setTrackingNumber('');
    setShowModal(true);
  };
  const closeFulfillModal = () => {
    setShowModal(false);
    setCurrentOrderId(null);
    setTrackingNumber('');
  };
  const handleFulfillOrder = async () => {
    if (!currentOrderId || !trackingNumber) return;
    try {
      const contract = getCrabContract();
      const tx = await contract.fulfillOrder(parseInt(currentOrderId), trackingNumber);
      await tx.wait();
      closeFulfillModal();
      await fetchData(); // 刷新数据
    } catch (e: unknown) {
      console.error('Error fulfilling order:', e);
      alert('发货失败: ' + (e instanceof Error ? e.message : String(e)));
    }
  };

  const handleApproveRefund = async () => {
    if (!refundModal.orderId || !refundModal.amount) return;
    try {
      const contract = getCrabContract();
      const tx = await contract.approveRefund(parseInt(refundModal.orderId), ethers.utils.parseUnits(refundModal.amount, 6));
      await tx.wait();
      setRefundModal({ show: false, orderId: null, amount: '' });
      fetchData();
    } catch (e: unknown) {
      alert('同意退款失败: ' + (e instanceof Error ? e.message : String(e)));
    }
  };

  const handleRejectRefund = async (orderId: string) => {
    try {
      const contract = getCrabContract();
      const tx = await contract.rejectRefund(parseInt(orderId));
      await tx.wait();
      fetchData();
    } catch (e: unknown) {
      alert('拒绝退款失败: ' + (e instanceof Error ? e.message : String(e)));
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{t('seller.connectWallet')}</h2>
          <p className="text-gray-400">{t('seller.connectWalletDesc')}</p>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">{t('seller.notOwner')}</strong>
          <span className="block sm:inline"> {t('seller.notOwnerDesc')}</span>
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p className="font-mono text-sm">当前账户: {account}</p>
            <p className="font-mono text-sm">合约所有者: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">{t('seller.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* 页面标题与品牌logo分开 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">{t('seller.title')}</h1>
      </div>
      
      {/* 卖家信息 */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">{t('seller.info')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">{t('seller.wallet')}</p>
            <p className="text-white font-mono">{account}</p>
          </div>
          <div>
            <p className="text-gray-400">{t('seller.balance')}</p>
            <p className="text-white font-mono">{contractBalance} USDC</p>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleWithdraw}
            disabled={parseFloat(contractBalance) <= 0}
            className="mt-4 bg-accent-500 hover:bg-accent-600 text-gray-900 font-bold py-2 px-4 rounded disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {t('seller.withdraw')}
          </button>
        </div>
      </div>

      {/* 订单列表 */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">{t('seller.orders')}</h2>
        {orders.length === 0 ? (
          <p className="text-gray-400">{t('seller.noOrders')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-gray-400">
                  <th className="p-4">{t('seller.orderId')}</th>
                  <th className="p-4">{t('seller.buyer')}</th>
                  <th className="p-4">{t('seller.giftBoxId')}</th>
                  <th className="p-4">{t('seller.giftBoxName')}</th>
                  <th className="p-4">{t('seller.quantity')}</th>
                  <th className="p-4">{t('seller.amount')}</th>
                  <th className="p-4">{t('seller.shippingInfo')}</th>
                  <th className="p-4">{t('seller.status')}</th>
                  <th className="p-4">{t('seller.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.orderId} className="border-b border-gray-700 last:border-b-0">
                    <td className="p-4">{order.orderId}</td>
                    <td className="p-4 font-mono text-sm">{order.buyer}</td>
                    <td className="p-4">{order.giftBoxId}</td>
                    <td className="p-4">{order.giftBoxName}</td>
                    <td className="p-4">{order.quantity}</td>
                    <td className="p-4">{order.totalAmount} USDC</td>
                    <td className="p-4 break-all text-xs">
                      {order.shippingInfo}
                      <p className="text-gray-500 text-xs mt-1">
                        {order.timestamp > 0 ? new Date(order.timestamp).toLocaleString() : t('common.notApplicable')}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        order.status === 0 ? 'bg-yellow-800 text-yellow-200' :
                        order.status === 1 ? 'bg-green-800 text-green-200' :
                        order.status === 2 ? 'bg-blue-800 text-blue-200' :
                        order.status === 3 ? 'bg-purple-800 text-purple-200' :
                        'bg-red-800 text-red-200'
                      }`}>
                        {statusMap[order.status as keyof typeof statusMap] || t('common.notApplicable')}
                      </span>
                      {order.trackingNumber && <p className="text-xs text-gray-500 mt-1">Tracking: {order.trackingNumber}</p>}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {order.status === 0 && (
                        <button
                          onClick={() => openFulfillModal(order.orderId)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                        >
                          {t('seller.fulfill')}
                        </button>
                      )}
                      {order.status === 2 && (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => setRefundModal({ show: true, orderId: order.orderId, amount: order.refundAmount || '' })}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
                          >
                            {t('seller.approveRefund')}
                          </button>
                          <button
                            onClick={() => handleRejectRefund(order.orderId)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
                          >
                            {t('seller.rejectRefund')}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 发货弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">{t('seller.fulfillOrder')}</h3>
            <p className="text-gray-400 mb-4">Order ID: {currentOrderId}</p>
            <label className="block text-gray-300 mb-2">{t('seller.trackingNumber')}</label>
            <input
              type="text"
              className="input w-full p-3 mb-4"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder={t('seller.enterTrackingNumber')}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeFulfillModal}
                className="btn btn-outline"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleFulfillOrder}
                className="btn btn-primary"
              >
                {t('seller.confirmFulfill')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 退款弹窗 */}
      {refundModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">{t('seller.approveRefund')}</h3>
            <p className="text-gray-400 mb-4">Order ID: {refundModal.orderId}</p>
            <label className="block text-gray-300 mb-2">{t('seller.refundAmount')}</label>
            <input
              type="number"
              className="input w-full p-3 mb-4"
              value={refundModal.amount}
              onChange={(e) => setRefundModal(prev => ({ ...prev, amount: e.target.value }))}
              placeholder={t('seller.enterRefundAmount')}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setRefundModal({ show: false, orderId: null, amount: '' })}
                className="btn btn-outline"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleApproveRefund}
                className="btn btn-primary"
              >
                {t('seller.confirmApprove')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerPage; 