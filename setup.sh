#!/bin/bash

echo "🚀 Setting up RAAD project dependencies..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

if ! command_exists python; then
    echo -e "${RED}❌ Python not found. Please install Python first.${NC}"
    exit 1
fi

if ! command_exists node; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js first.${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm not found. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Get project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo -e "${BLUE}📁 Project root: ${PROJECT_ROOT}${NC}"

# Install Python dependencies
echo -e "${BLUE}🐍 Installing Python dependencies...${NC}"
cd "${PROJECT_ROOT}/agent"
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Python dependencies installed successfully${NC}"
    else
        echo -e "${RED}❌ Failed to install Python dependencies${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ requirements.txt not found in agent directory${NC}"
    exit 1
fi

# Install Node.js dependencies for UI
echo -e "${BLUE}📦 Installing Node.js dependencies for UI...${NC}"
cd "${PROJECT_ROOT}/ui/raad-fed"
if [ -f "package.json" ]; then
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ UI dependencies installed successfully${NC}"
    else
        echo -e "${RED}❌ Failed to install UI dependencies${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ package.json not found in ui/raad-fed directory${NC}"
    exit 1
fi

# Install CLI globally
echo -e "${BLUE}⚡ Installing RAAD CLI globally...${NC}"
cd "${PROJECT_ROOT}/ui/raad-fed/raad-cli"
if [ -f "package.json" ]; then
    npm install
    npm install -g .
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ RAAD CLI installed globally${NC}"
    else
        echo -e "${RED}❌ Failed to install RAAD CLI globally (try with sudo)${NC}"
        echo -e "${BLUE}💡 Run: sudo npm install -g .${NC}"
    fi
else
    echo -e "${RED}❌ package.json not found in raad-cli directory${NC}"
    exit 1
fi

# Final success message
echo ""
echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo -e "   1. Make sure you have Ollama installed and running"
echo -e "   2. Run: ${GREEN}raad start${NC} to launch all services"
echo -e "   3. Test with: ${GREEN}curl -X POST http://localhost:9999/chat -H 'Content-Type: application/json' -d '{\"message\": \"test\"}'${NC}"
echo ""
echo -e "${BLUE}🌐 Service URLs:${NC}"
echo -e "   • Red Team Agent: http://localhost:9999"
echo -e "   • Test Agent: http://localhost:8888" 
echo -e "   • UI: http://localhost:3000"
