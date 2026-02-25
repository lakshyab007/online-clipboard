#!/bin/bash

# Setup script for Online Clipboard Application
# This script helps initialize the project

set -e

echo "🚀 Setting up Online Clipboard Application..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if PostgreSQL is installed
echo "📦 Checking prerequisites..."
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed. Please install PostgreSQL first.${NC}"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed. Please install Python 3.8+ first.${NC}"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 16+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites found${NC}"
echo ""

# Database setup
echo "🗄️  Setting up database..."
read -p "Do you want to create the database 'lux_project'? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    psql -U postgres -c "CREATE DATABASE lux_project;" 2>/dev/null || echo -e "${YELLOW}⚠️  Database might already exist${NC}"
    echo -e "${GREEN}✅ Database setup complete${NC}"
fi
echo ""

# Backend setup
echo "🔧 Setting up backend..."
cd server

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
echo "Installing Python dependencies..."
source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1

echo -e "${GREEN}✅ Backend setup complete${NC}"
cd ..
echo ""

# Frontend setup
echo "🎨 Setting up frontend..."
cd web

echo "Installing Node dependencies..."
npm install > /dev/null 2>&1

echo -e "${GREEN}✅ Frontend setup complete${NC}"
cd ..
echo ""

# Final instructions
echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "To start the application:"
echo ""
echo "1. Start the backend (in one terminal):"
echo "   cd server"
echo "   source venv/bin/activate  # On Windows: venv\\Scripts\\activate"
echo "   python main.py"
echo ""
echo "2. Start the frontend (in another terminal):"
echo "   cd web"
echo "   npm run dev"
echo ""
echo "3. Open your browser and navigate to:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API Docs: http://localhost:8000/docs"
echo ""
echo -e "${YELLOW}Note: Make sure PostgreSQL is running before starting the backend!${NC}"
echo ""
