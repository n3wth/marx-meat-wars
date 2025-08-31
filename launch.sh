#!/bin/bash

echo "🏭 LAUNCHING MARX MEAT WARS 🥩"
echo "================================"
echo ""
echo "Starting local server on port 8080..."
echo "Game URL: http://localhost:8080"
echo "Tests URL: http://localhost:8080/tests/game-validation.html"
echo ""
echo "🇷🇺 PREPARE FOR INEVITABLE RUSSIAN DEFEAT! 🇪🇸"
echo ""

# Kill any existing server on port 8080
lsof -ti:8080 | xargs kill -9 2>/dev/null

# Start the server
python3 -m http.server 8080
