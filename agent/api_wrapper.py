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
from a2a.client import ClientFactory, ClientConfig
from a2a.types import Message, TextPart, Part
import asyncio
import uuid

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
        # First, verify the Red Team Agent is available
        async with httpx.AsyncClient(timeout=5.0) as client:
            try:
                card_response = await client.get("http://localhost:9999/.well-known/agent.json")
                print(f"Red Team Agent available: {card_response.json()['name']}")
            except Exception as e:
                raise HTTPException(
                    status_code=503,
                    detail=f"Red Team Agent not available on port 9999. Please start it first. Error: {str(e)}"
                )

        # Send the analysis request via A2A client using the new ClientFactory API
        async with httpx.AsyncClient(timeout=300.0) as http_client:
            config = ClientConfig(
                streaming=False,
                httpx_client=http_client
            )
            a2a_client = await ClientFactory.connect(
                agent="http://localhost:9999",
                client_config=config
            )

            # Send the message to trigger the red team analysis
            # Create a proper A2A Message object
            text_part = TextPart(text=request.message or "run test")
            part = Part(root=text_part)
            message = Message(
                messageId=str(uuid.uuid4()),
                role="user",
                parts=[part]
            )

            # send_message returns an async generator, so we need to collect the results
            messages = []
            async for response_message in a2a_client.send_message(message):
                messages.append(response_message)

        # The A2A client returns the response from the agent
        return AnalysisResponse(
            status="success",
            results={"messages": messages, "message_count": len(messages)}
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error triggering analysis: {str(e)}")
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
            response = await client.get("http://localhost:9999/.well-known/agent.json")
            if response.status_code == 200:
                status["red_team_agent"] = "running"
                status["red_team_agent_info"] = response.json()
        except:
            status["red_team_agent"] = "not running"

        # Check Test Agent (port 8888)
        try:
            response = await client.get("http://localhost:8888/.well-known/agent.json")
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
