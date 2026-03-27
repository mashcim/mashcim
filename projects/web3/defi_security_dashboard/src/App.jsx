import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  TrendingUp,
  Shield,
  AlertTriangle,
  DollarSign,
  Activity,
  Lock,
  Globe,
  Zap,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Upload,
} from 'lucide-react';

const DEFI_SECURITY_DASHBOARD = () => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [selectedProtocol, setSelectedProtocol] = useState('all');
  const [securityScore, setSecurityScore] = useState(85);
  
  const [portfolioData, setPortfolioData] = useState({
    totalValue: 125000,
    dailyChange: 2.5,
    protocols: [
      {
        name: 'Uniswap V3',
        symbol: 'UNI',
        value: 45000,
        apy: 8.5,
        securityScore: 92,
        riskLevel: 'low',
        tvl: '$4.2B',
        alerts: 0
      },
      {
        name: 'Aave V3',
        symbol: 'AAVE',
        value: 35000,
        apy: 6.2,
        securityScore: 88,
        riskLevel: 'low',
        tvl: '$8.1B',
        alerts: 1
      },
      {
        name: 'Compound',
        symbol: 'COMP',
        value: 25000,
        apy: 4.8,
        securityScore: 85,
        riskLevel: 'medium',
        tvl: '$2.8B',
        alerts: 2
      },
      {
        name: 'Curve Finance',
        symbol: 'CRV',
        value: 20000,
        apy: 12.3,
        securityScore: 78,
        riskLevel: 'medium',
        tvl: '$3.5B',
        alerts: 3
      }
    ]
  });

  const [securityAlerts, setSecurityAlerts] = useState([
    {
      id: 1,
      type: 'vulnerability',
      severity: 'high',
      title: 'Smart Contract Vulnerability Detected',
      description: 'Potential reentrancy attack vector in Compound protocol',
      protocol: 'Compound',
      timestamp: new Date(Date.now() - 3600000),
      status: 'active'
    },
    {
      id: 2,
      type: 'price',
      severity: 'medium',
      title: 'Unusual Price Movement',
      description: 'CRV token price dropped 15% in the last hour',
      protocol: 'Curve Finance',
      timestamp: new Date(Date.now() - 7200000),
      status: 'active'
    },
    {
      id: 3,
      type: 'liquidity',
      severity: 'low',
      title: 'Low Liquidity Warning',
      description: 'Liquidity pool for UNI/ETH pair is running low',
      protocol: 'Uniswap V3',
      timestamp: new Date(Date.now() - 10800000),
      status: 'resolved'
    }
  ]);

  const [defiMetrics, setDefiMetrics] = useState({
    totalTVL: '$45.2B',
    dailyVolume: '$2.8B',
    activeUsers: 125000,
    protocolsCount: 234,
    securityIncidents: 3,
    avgSecurityScore: 85.5
  });

  useEffect(() => {
    connectWallet();
    const interval = setInterval(updateData, 30000);
    return () => clearInterval(interval);
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        
        setProvider(provider);
        setAccount(address);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  };

  const updateData = () => {
    // Simulate real-time data updates
    setPortfolioData(prev => ({
      ...prev,
      totalValue: prev.totalValue * (1 + (Math.random() - 0.5) * 0.01),
      dailyChange: prev.dailyChange + (Math.random() - 0.5) * 0.5
    }));
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#991b1b';
      case 'high': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const SecurityScoreCard = ({ title, score, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon size={24} color={color} />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-gray-200">
            <div 
              className="w-full h-full rounded-full border-4 border-transparent"
              style={{
                borderRightColor: color,
                borderTopColor: color,
                transform: `rotate(${(score / 100) * 360}deg)`
              }}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold" style={{ color }}>{score}</span>
          </div>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="h-2 rounded-full transition-all duration-300"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );

  const ProtocolCard = ({ protocol }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{protocol.name}</h3>
          <p className="text-sm text-gray-500">{protocol.symbol}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: getRiskColor(protocol.riskLevel) }}
          />
          <span className="text-sm font-medium capitalize" style={{ color: getRiskColor(protocol.riskLevel) }}>
            {protocol.riskLevel}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Value</p>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(protocol.value)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">APY</p>
          <p className="text-lg font-bold text-green-600">{protocol.apy}%</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Shield size={16} color="#667eea" />
          <span className="text-sm text-gray-600">Score: {protocol.securityScore}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Globe size={16} color="#6b7280" />
          <span className="text-sm text-gray-600">{protocol.tvl}</span>
        </div>
      </div>
      
      {protocol.alerts > 0 && (
        <div className="mt-4 p-2 bg-red-50 rounded-lg flex items-center space-x-2">
          <AlertTriangle size={16} color="#ef4444" />
          <span className="text-sm text-red-700">{protocol.alerts} active alert(s)</span>
        </div>
      )}
    </div>
  );

  const AlertCard = ({ alert }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-4 border-l-4" style={{ borderLeftColor: getSeverityColor(alert.severity) }}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-3">
          <AlertTriangle size={20} color={getSeverityColor(alert.severity)} />
          <h4 className="font-semibold text-gray-900">{alert.title}</h4>
        </div>
        <span className="text-xs text-gray-500">
          {alert.timestamp.toLocaleTimeString()}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">Protocol: {alert.protocol}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${
          alert.status === 'active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {alert.status}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">DeFi Security Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {account ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-gray-600">{formatAddress(account)}</span>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Connect Wallet
                </button>
              )}
              <button className="p-2 rounded hover:bg-gray-100">
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Total Portfolio Value</h3>
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {showBalance ? formatCurrency(portfolioData.totalValue) : '••••••'}
            </p>
            <p className={`text-sm mt-2 ${portfolioData.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {portfolioData.dailyChange >= 0 ? '↑' : '↓'} {Math.abs(portfolioData.dailyChange)}% today
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Security Score</h3>
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">{securityScore}/100</p>
            <p className="text-sm text-gray-600 mt-2">Overall portfolio security</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-600">
              {securityAlerts.filter(a => a.status === 'active').length}
            </p>
            <p className="text-sm text-gray-600 mt-2">Requires attention</p>
          </div>
        </div>

        {/* Security Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SecurityScoreCard title="Smart Contract" score={92} icon={Lock} color="#10b981" />
          <SecurityScoreCard title="Liquidity" score={78} icon={DollarSign} color="#f59e0b" />
          <SecurityScoreCard title="Oracle" score={88} icon={Globe} color="#3b82f6" />
          <SecurityScoreCard title="Governance" score={85} icon={Shield} color="#8b5cf6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Protocols */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Protocol Positions</h2>
              <select
                value={selectedProtocol}
                onChange={(e) => setSelectedProtocol(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Protocols</option>
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolioData.protocols
                .filter(p => selectedProtocol === 'all' || p.riskLevel === selectedProtocol)
                .map((protocol, index) => (
                  <ProtocolCard key={index} protocol={protocol} />
                ))}
            </div>
          </div>

          {/* Security Alerts */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Security Alerts</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {securityAlerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
        </div>

        {/* DeFi Metrics */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">DeFi Ecosystem Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{defiMetrics.totalTVL}</p>
              <p className="text-sm text-gray-600">Total TVL</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{defiMetrics.dailyVolume}</p>
              <p className="text-sm text-gray-600">Daily Volume</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{defiMetrics.activeUsers.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{defiMetrics.protocolsCount}</p>
              <p className="text-sm text-gray-600">Protocols</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{defiMetrics.securityIncidents}</p>
              <p className="text-sm text-gray-600">Incidents</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{defiMetrics.avgSecurityScore}</p>
              <p className="text-sm text-gray-600">Avg Score</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DEFI_SECURITY_DASHBOARD;
