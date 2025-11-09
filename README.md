# RAAD (Realtime Agent Analysis Dashboard)

Adversarial testing of AI agents using A2A protocol, MCP tools, and Next.js UI.

## Prerequisites
- Ollama with `nemotron-mini` model
- Python 3.10+ and Node.js 18+

## Quick Start
```bash
# Setup (one time)
./setup.sh

# Start all services
raad start
```

Visit http://localhost:3000 and click "Run Red Team Analysis".

## Architecture
- **Test Agent** (8888): Target for adversarial prompts
- **Red Team Agent** (9999): Sends prompts, analyzes responses
- **API Wrapper** (3001): FastAPI bridge for UI
- **Frontend** (3000): Next.js dashboard

## Manual Start (if CLI unavailable)
```bash
python agent/test_agent_server.py &
python agent/server.py &
python agent/api_wrapper.py &
cd ui/raad-fed && npm run dev
```

## Troubleshooting
- **Timeouts**: Ensure Ollama is running and `nemotron-mini` is pulled
- **Status check**: `curl http://localhost:3001/status`
- **Logs**: Check `logs/` directory when using `raad start`