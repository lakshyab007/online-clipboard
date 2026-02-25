#!/bin/bash

# Stop script for Online Clipboard Application
# Stops both backend and frontend servers

echo "🛑 Stopping Online Clipboard Application..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

STOPPED=0

# Stop backend
if [ -f /tmp/clipboard_backend.pid ]; then
    BACKEND_PID=$(cat /tmp/clipboard_backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "Stopping backend (PID: $BACKEND_PID)..."
        kill $BACKEND_PID 2>/dev/null || kill -9 $BACKEND_PID 2>/dev/null
        sleep 1
        if ps -p $BACKEND_PID > /dev/null 2>&1; then
            echo -e "${RED}✗ Failed to stop backend${NC}"
        else
            echo -e "${GREEN}✓ Backend stopped${NC}"
            ((STOPPED++))
        fi
    else
        echo -e "${YELLOW}⚠ Backend is not running${NC}"
    fi
    rm -f /tmp/clipboard_backend.pid
else
    # Try to find and kill by port
    BACKEND_PID=$(lsof -ti:8000 2>/dev/null)
    if [ ! -z "$BACKEND_PID" ]; then
        echo "Found backend on port 8000 (PID: $BACKEND_PID)..."
        kill $BACKEND_PID 2>/dev/null || kill -9 $BACKEND_PID 2>/dev/null
        sleep 1
        echo -e "${GREEN}✓ Backend stopped${NC}"
        ((STOPPED++))
    else
        echo -e "${YELLOW}⚠ Backend is not running${NC}"
    fi
fi

# Stop frontend
if [ -f /tmp/clipboard_frontend.pid ]; then
    FRONTEND_PID=$(cat /tmp/clipboard_frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo "Stopping frontend (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID 2>/dev/null || kill -9 $FRONTEND_PID 2>/dev/null
        sleep 1
        if ps -p $FRONTEND_PID > /dev/null 2>&1; then
            echo -e "${RED}✗ Failed to stop frontend${NC}"
        else
            echo -e "${GREEN}✓ Frontend stopped${NC}"
            ((STOPPED++))
        fi
    else
        echo -e "${YELLOW}⚠ Frontend is not running${NC}"
    fi
    rm -f /tmp/clipboard_frontend.pid
else
    # Try to find and kill by port
    FRONTEND_PID=$(lsof -ti:5173 2>/dev/null)
    if [ ! -z "$FRONTEND_PID" ]; then
        echo "Found frontend on port 5173 (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID 2>/dev/null || kill -9 $FRONTEND_PID 2>/dev/null
        sleep 1
        echo -e "${GREEN}✓ Frontend stopped${NC}"
        ((STOPPED++))
    else
        echo -e "${YELLOW}⚠ Frontend is not running${NC}"
    fi
fi

# Clean up log files
if [ -f /tmp/clipboard_backend.log ]; then
    rm -f /tmp/clipboard_backend.log
fi

if [ -f /tmp/clipboard_frontend.log ]; then
    rm -f /tmp/clipboard_frontend.log
fi

echo ""
if [ $STOPPED -gt 0 ]; then
    echo -e "${GREEN}✓ Stopped $STOPPED server(s)${NC}"
else
    echo -e "${YELLOW}No servers were running${NC}"
fi
echo ""
