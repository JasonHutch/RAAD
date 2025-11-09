'use client';

import { useState } from 'react';

interface DataPoint {
  time: string;
  tokenPrice: number;
  totalTokens: number;
  energyConsumption: number;
}

// Mock data for the last 24 hours
const generateMockData = (): DataPoint[] => {
  const data: DataPoint[] = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      tokenPrice: 0.002 + Math.random() * 0.001, // $0.002-0.003 per token
      totalTokens: 100000 + Math.random() * 50000, // 100k-150k tokens
      energyConsumption: 50 + Math.random() * 30, // 50-80 kWh
    });
  }
  
  return data;
};

type MetricType = 'tokenPrice' | 'totalTokens' | 'energyConsumption';

interface MetricConfig {
  key: MetricType;
  label: string;
  color: string;
  unit: string;
  formatter: (value: number) => string;
}

const metrics: MetricConfig[] = [
  {
    key: 'tokenPrice',
    label: 'Token Price',
    color: '#14b8a6',
    unit: '$',
    formatter: (value) => `$${value.toFixed(4)}`
  },
  {
    key: 'totalTokens',
    label: 'Total Tokens',
    color: '#3b82f6',
    unit: 'tokens',
    formatter: (value) => `${(value / 1000).toFixed(1)}k`
  },
  {
    key: 'energyConsumption',
    label: 'Energy Consumption',
    color: '#f59e0b',
    unit: 'kWh',
    formatter: (value) => `${value.toFixed(1)} kWh`
  }
];

export default function MetricsGraph() {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('tokenPrice');
  const [timeRange, setTimeRange] = useState('24h');
  const data = generateMockData();
  
  const currentMetric = metrics.find(m => m.key === selectedMetric)!;
  const maxValue = Math.max(...data.map(d => d[selectedMetric]));
  const minValue = Math.min(...data.map(d => d[selectedMetric]));
  const range = maxValue - minValue;

  // Generate SVG path for the line chart
  const generatePath = () => {
    const width = 800;
    const height = 200;
    const padding = 40;
    
    const points = data.map((point, index) => {
      const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((point[selectedMetric] - minValue) / range) * (height - 2 * padding);
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  // Generate area path for gradient fill
  const generateAreaPath = () => {
    const width = 800;
    const height = 200;
    const padding = 40;
    
    const points = data.map((point, index) => {
      const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((point[selectedMetric] - minValue) / range) * (height - 2 * padding);
      return `${x},${y}`;
    });
    
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    const [lastX] = lastPoint.split(',');
    const [firstX] = firstPoint.split(',');
    
    return `M ${firstX},${height - padding} L ${points.join(' L ')} L ${lastX},${height - padding} Z`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Metrics Over Time</h3>
          <p className="text-sm text-gray-500">Real-time monitoring of key performance indicators</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Time Range Selector */}
          <div className="flex items-center space-x-2">
            {['1h', '6h', '24h', '7d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-teal-100 text-teal-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          
          {/* Export Button */}
          <button className="flex items-center space-x-1 px-3 py-1 text-xs text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="flex items-center space-x-4 mb-6">
        {metrics.map((metric) => (
          <button
            key={metric.key}
            onClick={() => setSelectedMetric(metric.key)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
              selectedMetric === metric.key
                ? 'border-teal-500 bg-teal-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: metric.color }}
            ></div>
            <span className="text-sm font-medium text-gray-700">{metric.label}</span>
          </button>
        ))}
      </div>

      {/* Graph */}
      <div className="relative">
        <svg width="100%" height="240" viewBox="0 0 800 240" className="overflow-visible">
          <defs>
            <linearGradient id={`gradient-${selectedMetric}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={currentMetric.color} stopOpacity="0.2"/>
              <stop offset="100%" stopColor={currentMetric.color} stopOpacity="0"/>
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="40"
              y1={40 + i * 40}
              x2="760"
              y2={40 + i * 40}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}
          
          {/* Area fill */}
          <path
            d={generateAreaPath()}
            fill={`url(#gradient-${selectedMetric})`}
          />
          
          {/* Line */}
          <path
            d={generatePath()}
            fill="none"
            stroke={currentMetric.color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {data.map((point, index) => {
            const x = 40 + (index / (data.length - 1)) * 720;
            const y = 200 - ((point[selectedMetric] - minValue) / range) * 160;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill={currentMetric.color}
                className="hover:r-4 transition-all cursor-pointer"
              >
                <title>{`${point.time}: ${currentMetric.formatter(point[selectedMetric])}`}</title>
              </circle>
            );
          })}
          
          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4].map((i) => {
            const value = minValue + (range * i / 4);
            return (
              <text
                key={i}
                x="35"
                y={205 - i * 40}
                textAnchor="end"
                className="text-xs fill-gray-500"
              >
                {currentMetric.formatter(value)}
              </text>
            );
          })}
          
          {/* X-axis labels */}
          {data.filter((_, i) => i % 4 === 0).map((point, index) => (
            <text
              key={index}
              x={40 + (index * 4 / (data.length - 1)) * 720}
              y="230"
              textAnchor="middle"
              className="text-xs fill-gray-500"
            >
              {point.time}
            </text>
          ))}
        </svg>
      </div>

      {/* Current Value Display */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Current: <span className="font-semibold text-gray-900">
              {currentMetric.formatter(data[data.length - 1][selectedMetric])}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            24h Change: <span className="font-semibold text-green-600">+12.5%</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-400">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
