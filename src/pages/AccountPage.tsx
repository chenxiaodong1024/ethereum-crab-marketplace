import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, User, Wallet, ShoppingBag, LogOut, ExternalLink } from 'lucide-react';
import { useWeb3 } from '../contexts/Web3Context';

// Mock order history data
const mockOrders = [
  {
    id: 'ORD-2023-0001',
    date: '2023-04-15',
    total: '0.082 ETH',
    status: 'Delivered',
    items: [
      { name: 'Alaskan King Crab', quantity: 1 },
      { name: 'Dungeness Crab', quantity: 2 }
    ]
  },
  {
    id: 'ORD-2023-0002',
    date: '2023-05-22',
    total: '0.064 ETH',
    status: 'Shipped',
    items: [
      { name: 'Snow Crab Clusters', quantity: 1 },
      { name: 'Blue Crab', quantity: 1 }
    ]
  }
];

const AccountPage: React.FC = () => {
  const { account, isConnected, connect, disconnect, networkName } = useWeb3();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  
  // Mock user data
  const userData = {
    name: 'Crypto Crab Lover',
    email: 'crab@example.com',
    joined: 'March 2023',
    address: {
      street: '123 Ocean Drive',
      city: 'Seaside',
      state: 'CA',
      zip: '90210',
      country: 'USA'
    }
  };

  // Format account address
  const formatAccount = (account: string) => {
    return `${account.substring(0, 8)}...${account.substring(account.length - 6)}`;
  };
  
  // If not connected, show connect screen
  if (!isConnected) {
    return (
      <div className="container pt-32 pb-16 text-center">
        <div className="max-w-md mx-auto">
          <Wallet size={64} className="mx-auto text-gray-600 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">
            Please connect your wallet to view your account details and order history.
          </p>
          <button 
            onClick={connect}
            className="btn btn-primary"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <h1 className="text-3xl font-bold text-white mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="text-center mb-6">
                <div className="bg-blue-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={40} className="text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">{userData.name}</h3>
                <p className="text-gray-400 text-sm">{userData.email}</p>
              </div>
              
              <div className="bg-blue-900/20 rounded-lg p-4 mb-6 border border-blue-800/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Connected Wallet</p>
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
                <p className="text-xs text-gray-400 mt-2">Network: {networkName}</p>
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
                  <span>Order History</span>
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
                  <span>Profile</span>
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
                  <span>My Purchases</span>
                </button>
                <button 
                  onClick={disconnect}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-700 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Disconnect</span>
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
                  <h2 className="text-xl font-semibold text-white mb-6">Order History</h2>
                  
                  {mockOrders.length > 0 ? (
                    <div className="space-y-4">
                      {mockOrders.map(order => (
                        <div key={order.id} className="bg-gray-700 rounded-lg p-4">
                          <div className="flex flex-wrap justify-between items-start mb-4">
                            <div>
                              <h3 className="text-white font-medium">{order.id}</h3>
                              <p className="text-sm text-gray-400">Placed on {order.date}</p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === 'Delivered' ? 'bg-green-900/30 text-green-400' : 'bg-blue-900/30 text-blue-400'
                              }`}>
                                {order.status}
                              </span>
                              <p className="text-white font-medium mt-1">{order.total}</p>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-600 pt-3">
                            <h4 className="text-sm font-medium text-gray-300 mb-2">Items</h4>
                            <ul className="space-y-1">
                              {order.items.map((item, index) => (
                                <li key={index} className="text-sm text-gray-400">
                                  {item.quantity}x {item.name}
                                </li>
                              ))}
                            </ul>
                            <button className="mt-3 text-sm text-blue-400 hover:text-blue-300">
                              View Order Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package size={48} className="mx-auto text-gray-600 mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">No Orders Yet</h3>
                      <p className="text-gray-400 mb-6">
                        You haven't placed any orders yet.
                      </p>
                      <button 
                        onClick={() => navigate('/products')} 
                        className="btn btn-primary"
                      >
                        Browse Products
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <p className="text-sm text-gray-400">Full Name</p>
                          <p className="text-white">{userData.name}</p>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <p className="text-sm text-gray-400">Email Address</p>
                          <p className="text-white">{userData.email}</p>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <p className="text-sm text-gray-400">Member Since</p>
                          <p className="text-white">{userData.joined}</p>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <p className="text-sm text-gray-400">Wallet Address</p>
                          <p className="text-white">{formatAccount(account || '')}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Shipping Address</h3>
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <p className="text-white">
                          {userData.address.street}<br />
                          {userData.address.city}, {userData.address.state} {userData.address.zip}<br />
                          {userData.address.country}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button className="btn btn-primary">Edit Profile</button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Purchases Tab */}
              {activeTab === 'purchases' && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-6">My Purchases</h2>
                  
                  <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 mb-6">
                    <p className="text-white">
                      View all your blockchain-verified purchases. Each transaction is securely recorded on the Ethereum blockchain.
                    </p>
                  </div>
                  
                  {mockOrders.length > 0 ? (
                    <div className="space-y-4">
                      {mockOrders.map(order => (
                        <div key={order.id} className="bg-gray-700 rounded-lg p-4">
                          <div className="flex flex-wrap justify-between items-start mb-4">
                            <div>
                              <h3 className="text-white font-medium">Transaction #{order.id.split('-')[2]}</h3>
                              <p className="text-sm text-gray-400">Completed on {order.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-medium">{order.total}</p>
                              <a 
                                href="#" 
                                className="text-xs text-blue-400 hover:text-blue-300 flex items-center justify-end mt-1"
                              >
                                View on Etherscan
                                <ExternalLink size={12} className="ml-1" />
                              </a>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-600 pt-3">
                            <h4 className="text-sm font-medium text-gray-300 mb-2">Purchased Items</h4>
                            <ul className="space-y-1">
                              {order.items.map((item, index) => (
                                <li key={index} className="text-sm text-gray-400">
                                  {item.quantity}x {item.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ShoppingBag size={48} className="mx-auto text-gray-600 mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">No Purchases Yet</h3>
                      <p className="text-gray-400 mb-6">
                        You haven't made any purchases yet.
                      </p>
                      <button 
                        onClick={() => navigate('/products')} 
                        className="btn btn-primary"
                      >
                        Shop Now
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;