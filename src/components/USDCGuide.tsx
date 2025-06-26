import React, { useState } from 'react';
import { Info, Loader } from 'lucide-react';
import { useWeb3 } from '../contexts/Web3Context';
import { mintTestUSDC } from '../utils/contract';

const USDCGuide: React.FC = () => {
  const { account, isConnected } = useWeb3();
  const [isMinting, setIsMinting] = useState(false);

  const handleMintTestUSDC = async () => {
    if (!account || !isConnected) {
      alert('请先连接钱包');
      return;
    }

    setIsMinting(true);
    try {
      await mintTestUSDC(account, '1000'); // Mint 1000 USDC
      alert('成功获取 1000 测试 USDC！');
    } catch (error) {
      console.error('Mint USDC error:', error);
      alert('获取测试 USDC 失败，请检查网络连接');
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <Info className="text-blue-400 mr-3 mt-1 flex-shrink-0" size={20} />
        <div className="flex-1">
          <h4 className="text-white font-medium mb-2">获取测试 USDC</h4>
          <p className="text-sm text-gray-400 mb-4">
            点击下方按钮获取 1000 测试 USDC 进行购买。
          </p>
          
          {isConnected ? (
            <div className="mb-4">
              <button
                onClick={handleMintTestUSDC}
                disabled={isMinting}
                className="btn btn-primary"
              >
                {isMinting ? (
                  <>
                    <Loader size={16} className="animate-spin mr-2" />
                    获取中...
                  </>
                ) : (
                  '获取 1000 测试 USDC'
                )}
              </button>
            </div>
          ) : (
            <p className="text-yellow-400 text-sm mb-4">请先连接钱包</p>
          )}
          
          <div className="text-xs text-gray-400">
            如有问题，请联系: chenxiaodong1024@gmail.com
          </div>
        </div>
      </div>
    </div>
  );
};

export default USDCGuide; 