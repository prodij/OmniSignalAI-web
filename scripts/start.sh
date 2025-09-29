#!/bin/bash

# OmniSignalAI Web Quick Start Script
echo "🚀 Starting OmniSignalAI Web on port 5000..."
echo "=========================================="

# Check if we should use Docker
if [ "$1" == "--docker" ] || [ "$1" == "-d" ]; then
    echo "🐳 Starting with Docker..."
    docker-compose up web
elif [ "$1" == "--production" ] || [ "$1" == "-p" ]; then
    echo "🚀 Starting production build with Docker..."
    docker-compose --profile production up web-prod
else
    echo "💻 Starting development server locally..."

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing dependencies first..."
        npm install
    fi

    # Start the dev server
    npm run dev
fi