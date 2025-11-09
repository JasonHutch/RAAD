"""
Simple REST API wrapper for the Red Team Agent
This provides a simple POST endpoint that the frontend can call to trigger the red team analysis
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import uvicorn
from typing import Optional

app = FastAPI(title="RAAD Red Team API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    message: Optional[str] = "run test"

class AnalysisResponse(BaseModel):
    status: str
    task_id: Optional[str] = None
    results: Optional[dict] = None
    error: Optional[str] = None

@app.post("/analyze", response_model=AnalysisResponse)
async def trigger_analysis(request: AnalysisRequest):
    """
    Trigger the red team agent to analyze the test agent
    This sends a request via A2A protocol to the red team agent on port 9999
    """
    try:
        # Send request to the Red Team Agent via A2A
        async with httpx.AsyncClient(timeout=300.0) as client:  # 5 min timeout for analysis
            # First, get the agent card to verify connection
            try:
                card_response = await client.get("http://localhost:9999/")
                print(f"Red Team Agent available: {card_response.json()['name']}")
            except Exception as e:
                raise HTTPException(
                    status_code=503,
                    detail=f"Red Team Agent not available on port 9999. Please start it first. Error: {str(e)}"
                )

            # Send the analysis request
            a2a_request = {
                "message": request.message,
                "metadata": {}
            }

            response = await client.post(
                "http://localhost:9999/request",
                json=a2a_request,
                headers={"Content-Type": "application/json"}
            )

            if response.status_code == 200:
                result = response.json()
                return AnalysisResponse(
                    status="success",
                    task_id=result.get("taskId"),
                    results=result
                )
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Red Team Agent returned error: {response.text}"
                )

    except HTTPException:
        raise
    except Exception as e:
        return AnalysisResponse(
            status="error",
            error=str(e)
        )

@app.get("/status")
async def check_status():
    """Check if both agents are running"""
    status = {
        "api": "running",
        "red_team_agent": "unknown",
        "test_agent": "unknown"
    }

    async with httpx.AsyncClient(timeout=5.0) as client:
        # Check Red Team Agent (port 9999)
        try:
            response = await client.get("http://localhost:9999/")
            if response.status_code == 200:
                status["red_team_agent"] = "running"
                status["red_team_agent_info"] = response.json()
        except:
            status["red_team_agent"] = "not running"

        # Check Test Agent (port 8888)
        try:
            response = await client.get("http://localhost:8888/")
            if response.status_code == 200:
                status["test_agent"] = "running"
                status["test_agent_info"] = response.json()
        except:
            status["test_agent"] = "not running"

    return status

@app.get("/")
async def root():
    """API information"""
    return {
        "name": "RAAD Red Team API",
        "description": "REST API wrapper for triggering red team analysis",
        "endpoints": {
            "/analyze": "POST - Trigger red team analysis",
            "/status": "GET - Check agent status",
            "/": "GET - This information"
        },
        "demo_stack": {
            "frontend": "Next.js UI",
            "agents": "A2A Protocol",
            "llm": "Nemotron-mini via Ollama",
            "tools": "MCP Sentiment Analysis"
        }
    }

if __name__ == "__main__":
    print("Starting RAAD API Wrapper on http://localhost:3001")
    print("Make sure the following are running:")
    print("  - Test Agent on port 8888")
    print("  - Red Team Agent on port 9999")
    uvicorn.run(app, host="0.0.0.0", port=3001)
