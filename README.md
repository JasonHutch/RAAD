# RAAD (Red Team Adversarial Analysis Demo)

A demo stack for adversarial testing of AI agents using the A2A protocol, MCP tools, and a Next.js UI.

## Stack
- UI: Next.js (raad-fed)
- API Wrapper: FastAPI on port 3001
- Agents (A2A):
  - Test Agent on port 8888
  - Red Team Agent on port 9999
- LLM: Ollama (nemotron-mini)
- Tools: MCP Sentiment Analysis (Python script)

## Prerequisites
- Python 3.10+
- Node.js 18+
- Ollama installed and running
- Model: `nemotron-mini` pulled in Ollama
- Python deps: `pip install -r requirements.txt` (if present)

## Quick Start
1. Start Ollama and ensure `nemotron-mini` is available:
   - `ollama pull nemotron-mini`
2. Start the Test Agent (8888):
   - `python agent/test_agent_server.py`
3. Start the Red Team Agent (9999):
   - `python agent/server.py`
4. Start the API wrapper (3001):
   - `python agent/api_wrapper.py`
5. Start the UI:
   - `cd ui/raad-fed && npm install && npm run dev`
6. Visit the UI at http://localhost:3000 and run "Red Team Analysis".

## Status Check
- API wrapper: `curl -s http://localhost:3001/status`
- Agent cards:
  - Red Team: `curl -s http://localhost:9999/.well-known/agent.json`
  - Test Agent: `curl -s http://localhost:8888/.well-known/agent.json`

## Configuration Notes
- A2A timeouts are configured to handle slow LLM responses (300s).
- Red Team agent uses bounded concurrency for prompts (default: 2).
- UI fetch uses a 5m timeout to match backend.

## Troubleshooting
- Timeout during analysis:
  - Ensure both agents are running and `nemotron-mini` is loaded (first call can be slow).
  - Check API status: `curl -s http://localhost:3001/status`.
  - Verify A2A library is installed/available in the Python env.
- Red Team `/invoke` returns Not Found:
  - Expected. Use A2A endpoints via the API wrapper or `.well-known/agent.json`.
- Slow responses:
  - Keep nemotron (hackathon constraint). Concurrency is enabled; consider reducing prompt count.

## Project Layout
- `agent/`
  - `server.py` Red Team Agent (A2A server on 9999)
  - `test_agent_server.py` Test Agent (A2A server on 8888)
  - `api_wrapper.py` FastAPI wrapper for UI (3001)
  - `lib/analysis.py` Result analysis and summary
- `ui/raad-fed/` Next.js frontend

## Common Commands
- Red Team Agent: `python agent/server.py`
- Test Agent: `python agent/test_agent_server.py`
- API Wrapper: `python agent/api_wrapper.py`
- UI: `cd ui/raad-fed && npm run dev`