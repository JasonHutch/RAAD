'use client';

import RedTeamAnalysis from './RedTeamAnalysis';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  comparison: string;
  icon: React.ReactNode;
  chart?: React.ReactNode;
}

function MetricCard({ title, value, change, changeType, comparison, icon, chart }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="text-teal-600">
            {icon}
          </div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
        {chart && (
          <div className="w-16 h-8">
            {chart}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-semibold text-gray-900">{value}</span>
          <span className={`text-sm font-medium ${
            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}>
            {changeType === 'positive' ? '↗' : '↘'} {change}
          </span>
        </div>
        <p className="text-xs text-gray-500">{comparison}</p>
      </div>
    </div>
  );
}

function MiniChart({ color = 'teal' }: { color?: string }) {
  return (
    <svg className="w-full h-full" viewBox="0 0 64 32" fill="none">
      <path
        d="M2 20 L12 16 L22 18 L32 12 L42 14 L52 8 L62 10"
        stroke={color === 'teal' ? '#14b8a6' : color === 'blue' ? '#3b82f6' : color === 'purple' ? '#8b5cf6' : '#10b981'}
        strokeWidth="2"
        fill="none"
      />
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color === 'teal' ? '#14b8a6' : color === 'blue' ? '#3b82f6' : color === 'purple' ? '#8b5cf6' : '#10b981'} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={color === 'teal' ? '#14b8a6' : color === 'blue' ? '#3b82f6' : color === 'purple' ? '#8b5cf6' : '#10b981'} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path
        d="M2 20 L12 16 L22 18 L32 12 L42 14 L52 8 L62 10 L62 32 L2 32 Z"
        fill={`url(#gradient-${color})`}
      />
    </svg>
  );
}

interface DashboardProps {
  activeTab: 'overview' | 'redteam';
  setActiveTab: (tab: 'overview' | 'redteam') => void;
}

export default function Dashboard({ activeTab, setActiveTab }: DashboardProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="p-6 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">{currentDate}</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Aug 18, 2024 - Sep 16, 2024</span>
          </div>

          <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            <span>Filter</span>
          </button>

          <button className="flex items-center space-x-2 px-4 py-2 text-sm text-white bg-teal-600 rounded-lg hover:bg-teal-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'overview'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('redteam')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'redteam'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Red Team Analysis
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Total Tokens"
            value="2,847,392"
            change="43%"
            changeType="positive"
            comparison="Compared to last month"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            chart={<MiniChart color="teal" />}
          />

          <MetricCard
            title="Predicted Price"
            value="$4,382"
            change="15%"
            changeType="positive"
            comparison="Compared to last month"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            }
            chart={<MiniChart color="green" />}
          />

          <MetricCard
            title="Energy Consumption"
            value="1,247 kWh"
            change="8%"
            changeType="negative"
            comparison="Compared to last month"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            chart={<MiniChart color="orange" />}
          />
        </div>
      )}

      {activeTab === 'redteam' && (
        <div className="h-[600px]">
          <RedTeamAnalysis />
        </div>
      )}
    </div>
  );
}
