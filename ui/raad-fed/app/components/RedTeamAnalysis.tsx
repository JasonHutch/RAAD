'use client';

import { useState } from 'react';

interface AnalysisResult {
  status: string;
  task_id?: string;
  results?: any;
  error?: string;
}

export default function RedTeamAnalysis() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [agentStatus, setAgentStatus] = useState<any>(null);

  const checkStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/status');
      const data = await response.json();
      setAgentStatus(data);
    } catch (error) {
      console.error('Error checking status:', error);
      setAgentStatus({ error: 'Failed to connect to API' });
    }
  };

  const runAnalysis = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:3001/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'run test',
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">
          RAAD - Red Team Agent Analysis
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          Hackathon Demo: Nemotron + A2A + MCP
        </p>

        <div className="flex gap-4 mb-8">
          <button
            onClick={checkStatus}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Check Agent Status
          </button>

          <button
            onClick={runAnalysis}
            disabled={loading}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Running Analysis...' : 'Run Red Team Analysis'}
          </button>
        </div>

        {agentStatus && (
          <div className="mb-6 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            <h2 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
              Agent Status
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">API:</span>
                <StatusBadge status={agentStatus.api} />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Red Team Agent:</span>
                <StatusBadge status={agentStatus.red_team_agent} />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Test Agent:</span>
                <StatusBadge status={agentStatus.test_agent} />
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-200">
              Running adversarial test suite... This may take a few minutes.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-yellow-600 border-t-transparent rounded-full"></div>
              <span className="text-sm text-yellow-700 dark:text-yellow-300">
                Testing multiple prompts against the target agent
              </span>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-lg ${
                result.status === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}
            >
              <h2 className="text-lg font-semibold mb-2">
                {result.status === 'success'
                  ? '✓ Analysis Complete'
                  : '✗ Analysis Failed'}
              </h2>
              {result.error && (
                <p className="text-red-700 dark:text-red-300">{result.error}</p>
              )}
            </div>

            {result.results && (
              <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
                  Analysis Results
                </h3>
                <pre className="bg-zinc-900 dark:bg-black text-zinc-100 p-4 rounded overflow-auto text-sm max-h-96">
                  {JSON.stringify(result.results, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-200">
            Tech Stack Demo
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>🤖 <strong>Nemotron-mini</strong> - NVIDIA's LLM via Ollama</li>
            <li>🔗 <strong>A2A Protocol</strong> - Agent-to-Agent communication</li>
            <li>🔧 <strong>MCP</strong> - Model Context Protocol for sentiment analysis</li>
            <li>⚛️ <strong>Next.js</strong> - React frontend</li>
            <li>🐍 <strong>FastAPI</strong> - Python backend services</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    running: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    'not running': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    unknown: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status as keyof typeof colors] || colors.unknown}`}>
      {status}
    </span>
  );
}
