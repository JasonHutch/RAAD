'use client';

import { useState } from 'react';
import TopNavigation from "./components/TopNavigation";
import Dashboard from "./components/Dashboard";
import AgentSelector from "./components/AgentSelector";
import MetricsGraph from "./components/MetricsGraph";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'overview' | 'redteam'>('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      <div className="flex">
        <AgentSelector />
        <div className="flex-1">
          <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === 'overview' && (
            <div className="px-6 pb-6">
              {/* Metrics Graph */}
              <div className="h-96">
                <MetricsGraph />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
