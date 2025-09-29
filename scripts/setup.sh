#!/bin/bash

# OmniSignalAI Web Setup Script
echo "🚀 OmniSignalAI Web Setup"
echo "========================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cat > .env << EOF
# OmniSignalAI Web Environment Variables
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Analytics (optional)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GTM_ID=

# AI Services (optional for demos)
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
if [ -f package-lock.json ]; then
    npm install
elif [ -f yarn.lock ]; then
    yarn install
elif [ -f pnpm-lock.yaml ]; then
    pnpm install
else
    npm install
fi

echo "✅ Dependencies installed"

# Build Docker images
echo "🐳 Building Docker images..."
docker-compose build

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the development server:"
echo "  • Using Docker: npm run docker:dev"
echo "  • Without Docker: npm run dev"
echo ""
echo "The website will be available at http://localhost:5000"
echo ""
echo "Other available commands:"
echo "  • npm run docker:build - Build Docker images"
echo "  • npm run docker:prod - Run production build"
echo "  • npm run docker:down - Stop all containers"
echo "  • npm run lint - Run linting"
echo "  • npm run type-check - Check TypeScript types"