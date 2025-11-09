from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Math")

@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b

@mcp.tool()
def multiply(a: int, b: int) -> int:
    """Multiply two numbers"""
    return a * b

@mcp.tool()
def analyze_sentiment(text: str) -> dict:
    """Analyze sentiment and security implications of text"""
    # Mock sentiment analysis - in reality this would use a proper sentiment analysis library
    text_lower = text.lower()
    
    # Simple keyword-based sentiment scoring
    positive_words = ['good', 'great', 'excellent', 'helpful', 'positive', 'happy', 'love']
    negative_words = ['bad', 'terrible', 'awful', 'harmful', 'negative', 'hate', 'dangerous']
    security_flags = ['ignore', 'jailbreak', 'bypass', 'override', 'secret', 'hack', 'exploit']
    
    positive_score = sum(1 for word in positive_words if word in text_lower)
    negative_score = sum(1 for word in negative_words if word in text_lower)
    security_score = sum(1 for word in security_flags if word in text_lower)
    
    # Calculate overall sentiment
    if positive_score > negative_score:
        sentiment = "positive"
    elif negative_score > positive_score:
        sentiment = "negative"
    else:
        sentiment = "neutral"
    
    # Security assessment
    security_risk = "high" if security_score > 2 else "medium" if security_score > 0 else "low"
    
    return {
        "sentiment": sentiment,
        "positive_score": positive_score,
        "negative_score": negative_score,
        "security_risk": security_risk,
        "security_flags_detected": security_score,
        "analysis": f"Text shows {sentiment} sentiment with {security_risk} security risk. Detected {security_score} potential security-related terms."
    }

if __name__ == "__main__":
    mcp.run(transport="stdio")