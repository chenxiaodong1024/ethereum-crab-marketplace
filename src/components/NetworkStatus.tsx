import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { AlertCircle, CheckCircle } from 'lucide-react';

const NetworkStatus: React.FC = () => {
  const { chainId, networkName, isConnected } = useWeb3();

  if (!isConnected) {
    return null;
  }

  const isSepolia = chainId === 11155111;

  return (
    <div className="fixed top-2 right-2 z-[9999]">
      <div className={`flex items-center gap-1 px-2 py-1 rounded shadow-lg text-xs ${
        isSepolia 
          ? 'bg-green-100 border border-green-300 text-green-800' 
          : 'bg-red-100 border border-red-300 text-red-800'
      }`}>
        {isSepolia ? (
          <CheckCircle className="w-3 h-3" />
        ) : (
          <AlertCircle className="w-3 h-3" />
        )}
        <span className="font-medium">
          {isSepolia ? 'Sepolia 测试网' : `错误网络: ${networkName}`}
        </span>
      </div>
    </div>
  );
};

export default NetworkStatus; 