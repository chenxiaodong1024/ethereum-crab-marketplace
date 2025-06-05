import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

interface Web3ContextType {
  account: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  chainId: number | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  contractAddress: string;
  networkName: string;
  switchNetwork: (chainId: string) => Promise<void>;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  isConnected: false,
  isConnecting: false,
  connect: async () => {},
  disconnect: () => {},
  chainId: null,
  provider: null,
  signer: null,
  contractAddress: '0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE',
  networkName: '',
  switchNetwork: async () => {},
});

export const useWeb3 = () => useContext(Web3Context);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [networkName, setNetworkName] = useState('');
  
  const contractAddress = '0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE';

  const connect = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed. Please install MetaMask to use this application.');
      return;
    }

    setIsConnecting(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = provider.getSigner();
      const network = await provider.getNetwork();
      
      setProvider(provider);
      setSigner(signer);
      setAccount(accounts[0]);
      setChainId(network.chainId);
      setIsConnected(true);
      
      // Set network name
      const networkMap: Record<number, string> = {
        1: 'Ethereum Mainnet',
        3: 'Ropsten Testnet',
        4: 'Rinkeby Testnet',
        5: 'Goerli Testnet',
        42: 'Kovan Testnet',
        56: 'Binance Smart Chain',
        137: 'Polygon Mainnet',
      };
      
      setNetworkName(networkMap[network.chainId] || `Chain ID: ${network.chainId}`);
    } catch (error) {
      console.error('Error connecting to MetaMask', error);
      alert('Failed to connect to MetaMask');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setIsConnected(false);
    setChainId(null);
    setProvider(null);
    setSigner(null);
  };
  
  const switchNetwork = async (chainId: string) => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
    } catch (error) {
      console.error('Error switching network', error);
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnect();
        } else if (accounts[0] !== account) {
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = (chainId: string) => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [account]);

  // Check if already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            const signer = provider.getSigner();
            const network = await provider.getNetwork();
            
            setProvider(provider);
            setSigner(signer);
            setAccount(accounts[0]);
            setChainId(network.chainId);
            setIsConnected(true);
            
            // Set network name
            const networkMap: Record<number, string> = {
              1: 'Ethereum Mainnet',
              3: 'Ropsten Testnet',
              4: 'Rinkeby Testnet',
              5: 'Goerli Testnet',
              42: 'Kovan Testnet',
              56: 'Binance Smart Chain',
              137: 'Polygon Mainnet',
            };
            
            setNetworkName(networkMap[network.chainId] || `Chain ID: ${network.chainId}`);
          }
        } catch (error) {
          console.error('Error checking connection', error);
        }
      }
    };
    
    checkConnection();
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        isConnected,
        isConnecting,
        connect,
        disconnect,
        chainId,
        provider,
        signer,
        contractAddress,
        networkName,
        switchNetwork,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};