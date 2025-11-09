'use client';

import { useState } from 'react';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'connecting';
  port?: number;
  description: string;
  icon: string;
  color: string;
}

const agents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Agent 1',
    type: 'Test Target',
    status: 'online',
    port: 8001,
    description: 'Primary test agent for evaluation',
    icon: '1️⃣',
    color: 'bg-blue-500',
  },
  {
    id: 'agent-2',
    name: 'Agent 2',
    type: 'Test Target',
    status: 'online',
    port: 8002,
    description: 'Secondary test agent for evaluation',
    icon: '2️⃣',
    color: 'bg-green-500',
  },
  {
    id: 'agent-3',
    name: 'Agent 3',
    type: 'Test Target',
    status: 'connecting',
    port: 8003,
    description: 'Tertiary test agent for evaluation',
    icon: '3️⃣',
    color: 'bg-purple-500',
  },
];

interface AgentSelectorProps {
  selectedAgentId?: string;
  onAgentSelect?: (agentId: string) => void;
}

export default function AgentSelector({ selectedAgentId = 'agent-1', onAgentSelect }: AgentSelectorProps) {
  const [selectedAgent, setSelectedAgent] = useState(selectedAgentId);

  const handleAgentSelect = (agentId: string) => {
    setSelectedAgent(agentId);
    onAgentSelect?.(agentId);
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-gray-400';
      case 'connecting':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: Agent['status']) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      case 'connecting':
        return 'Connecting';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Test Agents</h2>
        <p className="text-sm text-gray-500">Select an agent to evaluate</p>
      </div>

      {/* Agent List */}
      <div className="flex-1 p-4 space-y-3">
        {agents.map((agent) => (
          <div
            key={agent.id}
            onClick={() => handleAgentSelect(agent.id)}
            className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
              selectedAgent === agent.id
                ? 'border-teal-500 bg-teal-50 shadow-sm'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Agent Icon */}
              <div className={`${agent.color} w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0`}>
                {agent.icon}
              </div>

              {/* Agent Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-sm text-gray-900 truncate">{agent.name}</h3>
                  {agent.port && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                      :{agent.port}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-500">{agent.type}</span>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)} ${
                      agent.status === 'connecting' ? 'animate-pulse' : ''
                    }`}></div>
                    <span className="text-xs text-gray-500">{getStatusText(agent.status)}</span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-400 line-clamp-2">{agent.description}</p>
              </div>

              {/* Selection Indicator */}
              {selectedAgent === agent.id && (
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{agents.filter(a => a.status === 'online').length} of {agents.length} online</span>
          <button className="text-teal-600 hover:text-teal-700 font-medium">
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
