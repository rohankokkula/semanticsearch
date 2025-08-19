#!/bin/bash

echo "🚀 Deploying Contentstack Semantic Search App to GitHub"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: Contentstack semantic search app"
    
    echo "🔗 Please add your GitHub remote origin:"
    echo "git remote add origin <your-github-repo-url>"
    echo "git branch -M main"
    echo "git push -u origin main"
else
    echo "📤 Pushing to GitHub..."
    git add .
    git commit -m "Update: Contentstack semantic search app"
    git push origin main
fi

echo ""
echo "✅ Code pushed to GitHub successfully!"
echo ""
echo "🔧 Next steps for Contentstack Launch:"
echo "1. Go to Contentstack Launch dashboard"
echo "2. Create a new project"
echo "3. Connect your GitHub repository"
echo "4. Configure build settings:"
echo "   - Build Command: npm run build"
echo "   - Output Directory: .next"
echo "   - Install Command: npm install"
echo "5. Add environment variables:"
echo "   - CONTENTSTACK_API_KEY"
echo "   - CONTENTSTACK_DELIVERY_TOKEN"
echo "   - CONTENTSTACK_ENVIRONMENT"
echo "   - CONTENTSTACK_MANAGEMENT_TOKEN"
echo "   - OPENAI_API_KEY"
echo "6. Deploy your project"
echo "7. Update webhook URL in Contentstack to point to your deployed domain"
echo ""
echo "🎉 Your semantic search app will be live at your Contentstack Launch domain!"
