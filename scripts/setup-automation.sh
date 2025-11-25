#!/bin/bash

# Setup script for automated build and distribution
# This script helps set up the environment for local testing

echo "🚀 Setting up automated build and distribution..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
yarn install

# Install Fastlane
echo "🔧 Installing Fastlane..."
gem install fastlane

# Install Fastlane plugins
echo "🔌 Installing Fastlane plugins..."
cd fastlane
bundle install
cd ..

# Make gradlew executable
echo "🔨 Making gradlew executable..."
chmod +x android/gradlew

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "⚠️  Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Check if required files exist
echo "🔍 Checking required files..."

required_files=(
    "fastlane/Fastfile"
    "fastlane/Appfile"
    "fastlane/Pluginfile"
    ".github/workflows/build-and-distribute.yml"
    ".github/workflows/fastlane-build.yml"
    "android/app/google-services.json"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up Firebase App Distribution (see AUTOMATION_SETUP.md)"
echo "2. Configure GitHub secrets (see AUTOMATION_SETUP.md)"
echo "3. Test locally: fastlane android build_debug"
echo "4. Push to GitHub to trigger automated builds"
echo ""
echo "For detailed instructions, see AUTOMATION_SETUP.md"
