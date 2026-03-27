import React, { useState, useEffect } from 'react';
import { Shield, Activity, AlertTriangle, TrendingUp, Users, Lock } from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function App() {
  const [stats, setStats] = useState({
    totalScans: 1247,
    activeThreats: 23,
    blockedAttacks: 892,
    securityScore: 94
  });

  const [scanData, setScanData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Security Scans',
        data: [65, 78, 90, 81, 95, 88, 102],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Threats Detected',
        data: [12, 19, 15, 25, 22, 30, 18],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      }
    ]
  });

  const [threatData, setThreatData] = useState({
    labels: ['Malware', 'Phishing', 'SQL Injection', 'XSS', 'DDoS'],
    datasets: [
      {
        label: 'Threat Types',
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderWidth: 0,
      }
    ]
  });

  const StatCard = ({ icon: Icon, title, value, color, trend }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Security Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Activity}
            title="Total Scans"
            value={stats.totalScans.toLocaleString()}
            color="bg-blue-500"
            trend={12}
          />
          <StatCard
            icon={AlertTriangle}
            title="Active Threats"
            value={stats.activeThreats}
            color="bg-red-500"
            trend={-8}
          />
          <StatCard
            icon={Lock}
            title="Blocked Attacks"
            value={stats.blockedAttacks.toLocaleString()}
            color="bg-green-500"
            trend={24}
          />
          <StatCard
            icon={TrendingUp}
            title="Security Score"
            value={`${stats.securityScore}%`}
            color="bg-purple-500"
            trend={5}
          />
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
            <Line data={scanData} options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }} />
          </div>

          {}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Threat Distribution</h3>
            <Doughnut data={threatData} options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'right',
                },
              },
            }} />
          </div>
        </div>

        {}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Security Events</h3>
          <div className="space-y-4">
            {[
              { type: 'warning', message: 'Suspicious login attempt detected from 192.168.1.100', time: '2 min ago' },
              { type: 'success', message: 'Firewall rules updated successfully', time: '15 min ago' },
              { type: 'error', message: 'Malware detected and quarantined: trojan.exe', time: '1 hour ago' },
              { type: 'info', message: 'System scan completed - no threats found', time: '2 hours ago' },
            ].map((event, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  event.type === 'error' ? 'bg-red-500' :
                  event.type === 'warning' ? 'bg-yellow-500' :
                  event.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{event.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
