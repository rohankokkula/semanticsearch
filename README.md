# Contentstack Semantic Search App

A smart, embeddings-based search application for Contentstack that understands the meaning behind user queries and returns the most relevant content using semantic similarity.

## Features

- **Semantic Search**: Natural language search that understands intent, not just keywords
- **Real-time Updates**: Webhook integration for instant content indexing
- **Content Filtering**: Filter by content type and locale
- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS
- **Scalable Architecture**: Ready for vector database integration (FAISS, Pinecone, Weaviate)

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **CMS Integration**: Contentstack SDK
- **Search**: Vector similarity search (ready for embeddings)
- **Deployment**: Contentstack Launch (GitHub integration)

## Prerequisites

- Node.js 18+ 
- Contentstack account with API credentials
- OpenAI API key (for future embeddings implementation)

## Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Contentstack Configuration
CONTENTSTACK_API_KEY=your_api_key
CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token
CONTENTSTACK_ENVIRONMENT=your_environment
CONTENTSTACK_MANAGEMENT_TOKEN=your_management_token

# OpenAI Configuration (for future use)
OPENAI_API_KEY=your_openai_api_key
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd contentstack-semantic-search
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual credentials
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Contentstack Setup

### 1. Create a Stack
- Log into your Contentstack account
- Create a new stack or use an existing one

### 2. Configure Webhooks
- Go to Settings → Webhooks
- Create a new webhook with the following configuration:
  - **URL**: `https://your-domain.com/api/webhook`
  - **Events**: Select all entry events (publish, unpublish, delete, update)
  - **Content Types**: Select the content types you want to index

### 3. Get API Credentials
- Go to Settings → API Keys
- Note down your API Key, Delivery Token, and Management Token
- Set the environment to match your webhook configuration

## Usage

### Initial Setup
1. Deploy your app to Contentstack Launch
2. Configure webhooks in Contentstack
3. Initialize the search index by calling `/api/init-index`

### Search Interface
- Enter natural language queries in the search bar
- Use filters to narrow results by content type or locale
- View similarity scores and content previews
- Click on results to view full entries

### Example Queries
- "red high top sneakers with stripes"
- "articles about healthy eating"
- "products under $50"
- "content for beginners"

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Contentstack  │    │   Next.js App    │    │   Search Index  │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │   Content   │ │    │ │  Search UI   │ │    │ │  In-Memory  │ │
│ │   Entries   │ │    │ │              │ │    │ │   Index     │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ └─────────────┘ │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │  Webhooks   │ │───▶│ │   Webhook    │ │───▶│ │  Real-time  │ │
│ │             │ │    │ │   Handler    │ │    │ │   Updates   │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## API Endpoints

### Webhook Handler
- **POST** `/api/webhook` - Receives Contentstack webhook updates
- **GET** `/api/webhook` - Health check for webhook endpoint

### Search Index
- **POST** `/api/init-index` - Initialize search index with existing content
- **GET** `/api/init-index` - Get current index statistics

## Deployment to Contentstack Launch

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial commit: Contentstack semantic search app"
git push origin main
```

### 2. Connect to Contentstack Launch
- Go to Contentstack Launch
- Create a new project
- Connect your GitHub repository
- Configure build settings:
  - **Build Command**: `npm run build`
  - **Output Directory**: `.next`
  - **Install Command**: `npm install`

### 3. Environment Variables
Add your environment variables in the Launch dashboard:
- `CONTENTSTACK_API_KEY`
- `CONTENTSTACK_DELIVERY_TOKEN`
- `CONTENTSTACK_ENVIRONMENT`
- `CONTENTSTACK_MANAGEMENT_TOKEN`
- `OPENAI_API_KEY`

### 4. Deploy
- Trigger your first deployment
- Update your webhook URL to point to the deployed domain

## Future Enhancements

### Vector Database Integration
- Replace in-memory storage with FAISS, Pinecone, or Weaviate
- Implement proper vector similarity search
- Add support for large-scale content indexing

### AI-Powered Features
- OpenAI embeddings for semantic understanding
- Query expansion and suggestion
- Content summarization and highlighting

### Advanced Search
- Faceted search and filtering
- Search analytics and insights
- Multi-language support
- Search result ranking optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in this repository
- Contact the Contentstack team
- Check the Contentstack documentation

## Roadmap

- [x] Basic search interface
- [x] Contentstack integration
- [x] Webhook handling
- [x] Real-time updates
- [ ] Vector database integration
- [ ] AI embeddings
- [ ] Advanced filtering
- [ ] Search analytics
- [ ] Multi-language support
# semanticsearch
