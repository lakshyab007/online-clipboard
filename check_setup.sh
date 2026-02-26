#!/bin/bash

# Setup Verification Script
# This script checks if everything is properly configured

echo "🔍 Checking Online Clipboard Application Setup..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
        ((ERRORS++))
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check PostgreSQL
echo "=== Database Checks ==="
if command -v psql &> /dev/null; then
    print_status 0 "PostgreSQL is installed"

    # Check if PostgreSQL is running
    if pg_isready &> /dev/null; then
        print_status 0 "PostgreSQL is running"
    else
        print_status 1 "PostgreSQL is NOT running - start it first!"
    fi

    # Check if database exists
    if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw online_clipboard 2>/dev/null; then
        print_status 0 "Database 'online_clipboard' exists"
    else
        print_status 1 "Database 'online_clipboard' does NOT exist"
        print_info "Create it with: psql -U postgres -c \"CREATE DATABASE online_clipboard;\""
    fi
else
    print_status 1 "PostgreSQL is NOT installed"
fi
echo ""

# Check Python
echo "=== Backend (Python) Checks ==="
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | cut -d ' ' -f 2)
    print_status 0 "Python 3 is installed (version $PYTHON_VERSION)"

    # Check if version is 3.8+
    PYTHON_MAJOR=$(echo $PYTHON_VERSION | cut -d. -f1)
    PYTHON_MINOR=$(echo $PYTHON_VERSION | cut -d. -f2)
    if [ "$PYTHON_MAJOR" -ge 3 ] && [ "$PYTHON_MINOR" -ge 8 ]; then
        print_status 0 "Python version is 3.8+ (required)"
    else
        print_status 1 "Python version is too old (need 3.8+, have $PYTHON_VERSION)"
    fi
else
    print_status 1 "Python 3 is NOT installed"
fi

# Check virtual environment
if [ -d "server/venv" ]; then
    print_status 0 "Virtual environment exists"

    # Check if packages are installed
    if [ -f "server/venv/bin/pip" ]; then
        PACKAGE_COUNT=$(server/venv/bin/pip list 2>/dev/null | wc -l)
        if [ "$PACKAGE_COUNT" -gt 10 ]; then
            print_status 0 "Dependencies are installed ($PACKAGE_COUNT packages)"
        else
            print_status 1 "Dependencies might not be installed"
            print_info "Install with: cd server && source venv/bin/activate && pip install -r requirements.txt"
        fi
    fi
else
    print_status 1 "Virtual environment does NOT exist"
    print_info "Create it with: cd server && python3 -m venv venv"
fi

# Check if requirements.txt exists
if [ -f "server/requirements.txt" ]; then
    print_status 0 "requirements.txt exists"
else
    print_status 1 "requirements.txt is missing"
fi
echo ""

# Check Node.js
echo "=== Frontend (Node.js) Checks ==="
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status 0 "Node.js is installed ($NODE_VERSION)"

    # Extract major version number
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_MAJOR" -ge 16 ]; then
        print_status 0 "Node.js version is 16+ (required)"
    else
        print_warning "Node.js version is older than 16 (have v$NODE_MAJOR)"
    fi
else
    print_status 1 "Node.js is NOT installed"
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_status 0 "npm is installed (version $NPM_VERSION)"
else
    print_status 1 "npm is NOT installed"
fi

# Check if node_modules exists
if [ -d "web/node_modules" ]; then
    print_status 0 "Frontend dependencies are installed"
else
    print_status 1 "Frontend dependencies are NOT installed"
    print_info "Install with: cd web && npm install"
fi

# Check if package.json exists
if [ -f "web/package.json" ]; then
    print_status 0 "package.json exists"
else
    print_status 1 "package.json is missing"
fi
echo ""

# Check project structure
echo "=== Project Structure Checks ==="
[ -f "server/main.py" ] && print_status 0 "server/main.py exists" || print_status 1 "server/main.py is missing"
[ -f "server/database.py" ] && print_status 0 "server/database.py exists" || print_status 1 "server/database.py is missing"
[ -f "server/auth.py" ] && print_status 0 "server/auth.py exists" || print_status 1 "server/auth.py is missing"
[ -f "server/schemas.py" ] && print_status 0 "server/schemas.py exists" || print_status 1 "server/schemas.py is missing"
[ -f "web/src/App.jsx" ] && print_status 0 "web/src/App.jsx exists" || print_status 1 "web/src/App.jsx is missing"
[ -d "web/src/pages" ] && print_status 0 "web/src/pages directory exists" || print_status 1 "web/src/pages directory is missing"
[ -d "web/src/components" ] && print_status 0 "web/src/components directory exists" || print_status 1 "web/src/components directory is missing"
echo ""

# Check ports
echo "=== Port Availability Checks ==="
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    print_warning "Port 8000 is already in use (backend will fail to start)"
    print_info "Kill process with: lsof -ti:8000 | xargs kill -9"
else
    print_status 0 "Port 8000 is available (backend)"
fi

if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    print_warning "Port 5173 is already in use (frontend will fail to start)"
    print_info "Kill process with: lsof -ti:5173 | xargs kill -9"
else
    print_status 0 "Port 5173 is available (frontend)"
fi
echo ""

# Summary
echo "=== Summary ==="
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! You're ready to go! 🎉${NC}"
    echo ""
    echo "To start the application:"
    echo "  1. Backend:  cd server && ./run.sh"
    echo "  2. Frontend: cd web && ./run.sh"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS warning(s) found, but setup looks okay${NC}"
    echo ""
    echo "You can try starting the application, but fix warnings if issues occur."
else
    echo -e "${RED}✗ Found $ERRORS error(s) and $WARNINGS warning(s)${NC}"
    echo ""
    echo "Please fix the errors above before running the application."
    echo "Check the documentation:"
    echo "  - START_HERE.md for quick setup"
    echo "  - TROUBLESHOOTING.md for common issues"
fi
echo ""
