#!/bin/bash

# Startup script for Online Clipboard Application
# Starts both backend and frontend servers

set -e

echo "🚀 Starting Online Clipboard Application..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if PostgreSQL is running
echo "📊 Checking prerequisites..."
if ! pg_isready &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not running!${NC}"
    echo "Please start PostgreSQL first:"
    echo "  sudo systemctl start postgresql  # Linux"
    echo "  brew services start postgresql   # macOS"
    exit 1
fi
echo -e "${GREEN}✓${NC} PostgreSQL is running"

# Check if database exists
if ! psql -U postgres -lqt | cut -d \| -f 1 | grep -qw lux_project 2>/dev/null; then
    echo -e "${YELLOW}⚠ Database 'lux_project' does not exist${NC}"
    echo "Creating database..."
    psql -U postgres -c "CREATE DATABASE lux_project;" 2>/dev/null || {
        echo -e "${RED}❌ Failed to create database${NC}"
        echo "Create it manually: psql -U postgres -c \"CREATE DATABASE lux_project;\""
        exit 1
    }
fi
echo -e "${GREEN}✓${NC} Database 'lux_project' exists"

# Check if ports are available
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠ Port 8000 is already in use${NC}"
    echo "Backend might already be running or another service is using port 8000"
    read -p "Kill the process and continue? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        lsof -ti:8000 | xargs kill -9 2>/dev/null || true
        sleep 2
    else
        exit 1
    fi
fi

if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠ Port 5173 is already in use${NC}"
    echo "Frontend might already be running or another service is using port 5173"
    read -p "Kill the process and continue? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        lsof -ti:5173 | xargs kill -9 2>/dev/null || true
        sleep 2
    else
        exit 1
    fi
fi

# Check backend dependencies
if [ ! -d "server/venv" ]; then
    echo -e "${RED}❌ Virtual environment not found${NC}"
    echo "Creating virtual environment..."
    cd server
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
fi
echo -e "${GREEN}✓${NC} Backend dependencies ready"

# Check frontend dependencies
if [ ! -d "web/node_modules" ]; then
    echo -e "${RED}❌ Frontend dependencies not installed${NC}"
    echo "Installing dependencies..."
    cd web
    npm install
    cd ..
fi
echo -e "${GREEN}✓${NC} Frontend dependencies ready"

echo ""
echo "═══════════════════════════════════════════════"
echo "  Starting Backend & Frontend Servers"
echo "═══════════════════════════════════════════════"
echo ""

# Start backend in background
echo -e "${BLUE}🔧 Starting backend server...${NC}"
cd server
./venv/bin/python main.py > /tmp/clipboard_backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "Waiting for backend to be ready..."
for i in {1..10}; do
    if curl -s http://localhost:8000 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend started successfully!${NC}"
        echo -e "  ${BLUE}→${NC} http://localhost:8000"
        echo -e "  ${BLUE}→${NC} API Docs: http://localhost:8000/docs"
        break
    fi
    sleep 1
    if [ $i -eq 10 ]; then
        echo -e "${RED}❌ Backend failed to start${NC}"
        echo "Check logs: tail -f /tmp/clipboard_backend.log"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
done

echo ""

# Start frontend in background
echo -e "${BLUE}🎨 Starting frontend server...${NC}"
cd web
npm run dev > /tmp/clipboard_frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
echo "Waiting for frontend to be ready..."
for i in {1..15}; do
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Frontend started successfully!${NC}"
        echo -e "  ${BLUE}→${NC} http://localhost:5173"
        break
    fi
    sleep 1
    if [ $i -eq 15 ]; then
        echo -e "${RED}❌ Frontend failed to start${NC}"
        echo "Check logs: tail -f /tmp/clipboard_frontend.log"
        kill $BACKEND_PID 2>/dev/null || true
        kill $FRONTEND_PID 2>/dev/null || true
        exit 1
    fi
done

echo ""
echo "═══════════════════════════════════════════════"
echo -e "${GREEN}✓ Application Started Successfully!${NC}"
echo "═══════════════════════════════════════════════"
echo ""
echo "📱 Application URL:"
echo -e "   ${GREEN}http://localhost:5173${NC}"
echo ""
echo "🔧 Backend API:"
echo -e "   ${BLUE}http://localhost:8000${NC}"
echo -e "   ${BLUE}http://localhost:8000/docs${NC} (API Documentation)"
echo ""
echo "📋 Process IDs:"
echo "   Backend:  $BACKEND_PID"
echo "   Frontend: $FRONTEND_PID"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f /tmp/clipboard_backend.log"
echo "   Frontend: tail -f /tmp/clipboard_frontend.log"
echo ""
echo "🛑 To stop all servers:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop monitoring (servers will keep running)${NC}"
echo ""

# Save PIDs to file for easy stopping
echo "$BACKEND_PID" > /tmp/clipboard_backend.pid
echo "$FRONTEND_PID" > /tmp/clipboard_frontend.pid

# Monitor logs
echo "Monitoring logs (Ctrl+C to stop monitoring)..."
echo "═══════════════════════════════════════════════"
sleep 2
tail -f /tmp/clipboard_backend.log /tmp/clipboard_frontend.log
