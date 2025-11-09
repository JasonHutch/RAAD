'use client';

interface Agent {
  id: string;
  name: string;
  type: string;
  port?: number;
  description: string;
  icon: string;
  color: string;
}

const agents: Agent[] = [
  {
    id: 'frontend',
    name: 'Frontend UI',
    type: 'Client',
    description: 'Next.js React Application',
    icon: '⚛️',
    color: 'bg-blue-500',
  },
  {
    id: 'api-wrapper',
    name: 'API Wrapper',
    type: 'Gateway',
    port: 3001,
    description: 'FastAPI REST Gateway',
    icon: '🌐',
    color: 'bg-purple-500',
  },
  {
    id: 'red-team',
    name: 'Red Team Agent',
    type: 'A2A Agent',
    port: 9999,
    description: 'Adversarial Testing Agent',
    icon: '🔴',
    color: 'bg-red-500',
  },
  {
    id: 'test-agent',
    name: 'Test Agent',
    type: 'A2A Agent',
    port: 8888,
    description: 'Target Agent for Testing',
    icon: '🎯',
    color: 'bg-green-500',
  },
  {
    id: 'mcp-server',
    name: 'MCP Server',
    type: 'Tool Server',
    description: 'Sentiment Analysis Tools',
    icon: '🔧',
    color: 'bg-yellow-500',
  },
];

export default function AgentFlowSidebar() {
  return (
    <div className="w-80 bg-zinc-900 text-white p-6 min-h-screen flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">RAAD Architecture</h2>
        <p className="text-sm text-zinc-400">Agent Communication Flow</p>
      </div>

      <div className="flex-1 space-y-4">
        {agents.map((agent, index) => (
          <div key={agent.id}>
            <div className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-750 transition-colors border border-zinc-700">
              <div className="flex items-start gap-3">
                <div className={`${agent.color} w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0`}>
                  {agent.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{agent.name}</h3>
                    {agent.port && (
                      <span className="text-xs px-2 py-0.5 bg-zinc-700 rounded">
                        :{agent.port}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mb-1">{agent.type}</p>
                  <p className="text-xs text-zinc-500">{agent.description}</p>
                </div>
              </div>
            </div>

            {/* Connection arrow */}
            {index < agents.length - 1 && (
              <div className="flex justify-center py-2">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-3 bg-zinc-700"></div>
                  <svg
                    className="w-4 h-4 text-zinc-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v10.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-zinc-800">
        <div className="text-xs text-zinc-500 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Connection Flow</span>
          </div>
          <p className="text-zinc-600">
            Arrows indicate request/response direction
          </p>
        </div>
      </div>
    </div>
  );
}
