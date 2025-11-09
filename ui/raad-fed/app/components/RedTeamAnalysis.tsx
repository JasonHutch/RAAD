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

  // Extract readable text from A2A response messages (robust to shape differences)
  const extractA2AText = (response: any): string => {
    try {
      if (!response) return '';

      // If it's already a string, return it
      if (typeof response === 'string') return response;

      // If the response is an array of messages
      if (Array.isArray(response)) {
        const texts: string[] = [];
        for (const msg of response) {
          // Common shapes: msg.parts[0].text OR msg.parts[0].root.text
          const parts = msg?.parts;
          if (Array.isArray(parts)) {
            for (const p of parts) {
              const t = p?.text ?? p?.root?.text ?? p?.root?.content ?? '';
              if (t) texts.push(t);
            }
          }
          // Fallbacks
          const maybeText =
            msg?.text ?? msg?.content ?? msg?.message ?? '';
          if (maybeText) texts.push(maybeText);
        }
        return texts.filter(Boolean).join('\n');
      }

      // If it's a single message object
      const parts = response?.parts;
      if (Array.isArray(parts)) {
        const texts = parts
          .map((p: any) => p?.text ?? p?.root?.text ?? p?.root?.content ?? '')
          .filter(Boolean);
        if (texts.length) return texts.join('\n');
      }

      // Other object shapes
      return response?.text ?? response?.content ?? '';
    } catch {
      return '';
    }
  };

  const attackTypes = [
    { name: 'Jailbreak Attempts', description: 'Attempts to bypass AI safety constraints' },
    { name: 'Prompt Injection', description: 'Malicious instructions embedded in user input' },
    { name: 'Harmful Content', description: 'Requests for illegal or dangerous information' },
    { name: 'Bias Testing', description: 'Probing for discriminatory or biased responses' },
    { name: 'Privacy Violation', description: 'Attempts to generate sensitive personal data' }
  ];

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
        signal: AbortSignal.timeout(300000), // 5 minute timeout to match backend
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
          errorMessage = 'Analysis timed out after 5 minutes. This may indicate the agents are overloaded or there are network issues.';
        } else {
          errorMessage = error.message;
        }
      }
      setResult({
        status: 'error',
        error: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex gap-6">
      {/* Left Side - Attack Types and Run Button */}
      <div className="w-96">
        <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
          <h2 className="text-lg font-semibold mb-2 text-gray-900">
            Red Team Analysis
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Adversarial testing using A2A protocol and MCP sentiment analysis
          </p>

          <div className="flex-1 overflow-auto mb-6">
            <h3 className="text-sm font-semibold mb-3 text-gray-900">
              Attack Types Being Tested
            </h3>
            <div className="space-y-3">
              {attackTypes.map((attackType, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    {attackType.name}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {attackType.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={runAnalysis}
            disabled={loading}
            className="w-full px-4 py-3 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Running Analysis...</span>
              </div>
            ) : (
              'Run Red Team Analysis'
            )}
          </button>
        </div>
      </div>

      {/* Right Side - A2A Results */}
      <div className="flex-1">
        <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">
            A2A Analysis Results
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Agent-to-Agent communication results and sentiment analysis
          </p>

          <div className="flex-1 overflow-auto">
            {!result && !loading && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">No results yet</p>
                  <p className="text-xs mt-1">Click "Run Red Team Analysis" to start</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin h-12 w-12 border-4 border-red-200 border-t-red-600 rounded-full mx-auto mb-4"></div>
                  <p className="text-sm text-gray-600">Running analysis...</p>
                  <p className="text-xs text-gray-500 mt-1">This may take a few moments</p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {/* Status Badge */}
                <div
                  className={`p-4 rounded-lg ${
                    result.status === 'success'
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {result.status === 'success' ? (
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <span className={`font-semibold ${
                      result.status === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {result.status === 'success'
                        ? 'Analysis Complete'
                        : 'Analysis Failed'}
                    </span>
                  </div>
                  {result.error && (
                    <p className="text-sm text-red-700 ml-7">{result.error}</p>
                  )}
                  {result.task_id && (
                    <p className="text-xs text-gray-600 ml-7">Task ID: {result.task_id}</p>
                  )}
                </div>

                {/* Parse and render structured results */}
                {result.results && (() => {
                  try {
                    // Extract the text content from the A2A message structure
                    const messageText = result.results.messages?.[0]?.parts?.[0]?.text;
                    if (!messageText) return null;

                    const parsedData = JSON.parse(messageText);
                    const summary = parsedData.summary;
                    const testResults = parsedData.test_results || [];

                    return (
                      <div className="space-y-6">
                        {/* Overview Stats - Clean minimal design */}
                        {summary?.overview && (
                          <div className="grid grid-cols-4 gap-3">
                            <div className="border border-gray-300 rounded-lg p-3">
                              <div className="text-xs text-gray-600 font-medium mb-1">Total Tests</div>
                              <div className="text-2xl font-semibold text-gray-900">{summary.overview.total_prompts}</div>
                            </div>
                            <div className="border border-gray-300 rounded-lg p-3">
                              <div className="text-xs text-gray-600 font-medium mb-1">Successful</div>
                              <div className="text-2xl font-semibold text-gray-900">{summary.overview.successful_responses}</div>
                            </div>
                            <div className="border border-gray-300 rounded-lg p-3">
                              <div className="text-xs text-gray-600 font-medium mb-1">Failed</div>
                              <div className="text-2xl font-semibold text-gray-900">{summary.overview.failed_responses}</div>
                            </div>
                            <div className="border border-gray-300 rounded-lg p-3">
                              <div className="text-xs text-gray-600 font-medium mb-1">Success Rate</div>
                              <div className="text-2xl font-semibold text-gray-900">{summary.overview.success_rate}%</div>
                            </div>
                          </div>
                        )}

                        {/* Test Results - Show each prompt and response */}
                        {testResults.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-900">Test Results</h4>
                            {testResults.map((test: any, idx: number) => (
                              <div key={idx} className="border border-gray-300 rounded-lg overflow-hidden">
                                {/* Prompt */}
                                <div className="bg-gray-50 p-3 border-b border-gray-300">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                      <div className="text-xs font-medium text-gray-600 mb-1">
                                        Prompt #{idx + 1}
                                      </div>
                                      <div className="text-sm text-gray-900">
                                        {test.prompt}
                                      </div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded ${
                                      test.status === 'success'
                                        ? 'bg-gray-200 text-gray-700'
                                        : 'bg-gray-200 text-gray-700'
                                    }`}>
                                      {test.status}
                                    </span>
                                  </div>
                                </div>

                                {/* Response */}
                                <div className="p-3 bg-white">
                                  <div className="text-xs font-medium text-gray-600 mb-2">
                                    Response
                                  </div>
                                  {test.status === 'error' ? (
                                    <div className="text-sm text-gray-600 italic">
                                      Error: {test.error}
                                    </div>
                                  ) : test.response ? (
                                    (() => {
                                      const text = extractA2AText(test.response);
                                      return (
                                        <div className="text-sm text-gray-900 whitespace-pre-wrap">
                                          {text && text.trim().length > 0
                                            ? text
                                            : JSON.stringify(test.response, null, 2)}
                                        </div>
                                      );
                                    })()
                                  ) : (
                                    <div className="text-sm text-gray-400 italic">
                                      No response
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Recommendations - Clean minimal design */}
                        {summary?.recommendations && summary.recommendations.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-900">Recommendations</h4>
                            {summary.recommendations.map((rec: any, idx: number) => (
                              <div
                                key={idx}
                                className="border border-gray-300 rounded-lg p-3"
                              >
                                <div className="text-sm font-medium text-gray-900 mb-1">
                                  {rec.title}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {rec.description}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  } catch (e) {
                    // If parsing fails, show raw JSON
                    return (
                      <div className="border border-gray-300 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-3 text-gray-900">
                          Detailed Results
                        </h4>
                        <div className="bg-gray-100 rounded-lg p-4 overflow-auto max-h-96">
                          <pre className="text-xs text-gray-800 font-mono">
                            {JSON.stringify(result.results, null, 2)}
                          </pre>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
