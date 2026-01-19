#!/bin/bash

echo "🍖 DJ Cuisine - Setup Script"
echo "=============================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check for .env.local
if [ ! -f .env.local ]; then
    echo "⚠️  No .env.local file found"
    echo "📝 Creating .env.local from example..."
    
    if [ -f .env.example ]; then
        cp .env.example .env.local
        echo "✅ Created .env.local"
        echo ""
        echo "⚠️  IMPORTANT: Edit .env.local and add your Stripe keys!"
        echo "   Get them from: https://dashboard.stripe.com/apikeys"
        echo ""
    else
        echo "❌ .env.example not found"
    fi
else
    echo "✅ .env.local exists"
    echo ""
fi

# Check for logo
if [ ! -f public/logo.png ]; then
    echo "⚠️  No logo found at public/logo.png"
    echo "   A placeholder SVG logo has been created."
    echo "   Replace it with your actual logo for production."
    echo ""
else
    echo "✅ Logo found"
    echo ""
fi

echo "=============================="
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your Stripe keys"
echo "2. (Optional) Replace public/logo.png with your logo"
echo "3. (Optional) Add product images to public/images/"
echo "4. Run: npm run dev"
echo "5. Open: http://localhost:3000"
echo ""
echo "📚 For more info, see:"
echo "   - README.md (overview)"
echo "   - SETUP.md (detailed setup)"
echo "   - DEPLOYMENT.md (production deployment)"
echo ""
echo "🚀 Happy coding!"
