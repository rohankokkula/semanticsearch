# Contentstack Webhook App

A simple React.js application that displays real-time entry updates from Contentstack webhooks.

## Features

- Real-time webhook data display using Socket.IO
- Clean, responsive UI
- Webhook status monitoring
- Entry history with timestamps
- Clear entries functionality
- RESTful API endpoints

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone or navigate to the project directory:
```bash
cd contentstack-webhook-app
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Development Mode

Run both the React development server and the backend server simultaneously:

```bash
npm run dev
```

This will start:
- React development server on port 3000
- Backend server on port 3001

### Production Mode

1. Build the React app:
```bash
npm run build
```

2. Start the production server:
```bash
npm run build-and-serve
```

Or run them separately:
```bash
npm run build
npm run server
```

## Configuration

### Contentstack Webhook Setup

1. In your Contentstack dashboard, go to **Settings** > **Webhooks**
2. Create a new webhook with the following details:
   - **Name**: Your webhook name
   - **URL**: `http://your-domain:3001/webhook`
   - **Events**: Select the events you want to monitor (e.g., Entry Publish, Entry Unpublish, Entry Update)
   - **Content Types**: Select the content types you want to monitor

### Environment Variables

- `PORT`: Server port (default: 3001)

## API Endpoints

- `POST /webhook` - Receive webhook data from Contentstack
- `GET /api/entries` - Get all received webhook entries
- `DELETE /api/entries` - Clear all entries
- `GET /webhook/status` - Check webhook endpoint status
- `GET /health` - Health check endpoint

## Webhook Data Structure

The app receives and displays webhook data in the following format:

```json
{
  "event_type": "entry.published",
  "content_type_uid": "blog_post",
  "entry_uid": "entry_123",
  "data": {
    "title": "Sample Blog Post",
    "description": "This is a sample blog post"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "received_at": "1/1/2024, 12:00:00 AM"
}
```

## Real-time Updates

The app uses Socket.IO to provide real-time updates:
- New webhook entries appear instantly
- Webhook status updates in real-time
- Multiple browser tabs stay synchronized

## Troubleshooting

### Webhook Status Shows as Inactive

1. Ensure the backend server is running
2. Check if the server is accessible at the expected port
3. Verify firewall settings allow incoming connections

### No Entries Displayed

1. Check if webhooks are being sent to the correct URL
2. Verify the webhook configuration in Contentstack
3. Check browser console for any JavaScript errors

### Port Conflicts

If port 3001 is already in use, you can change it by setting the `PORT` environment variable:

```bash
PORT=3002 npm run server
```

## Development

### Project Structure

```
contentstack-webhook-app/
├── public/
│   └── index.html
├── src/
│   ├── App.js          # Main React component
│   ├── App.css         # Component styles
│   ├── index.js        # React entry point
│   └── index.css       # Global styles
├── server.js           # Express backend server
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

### Adding New Features

- **New Webhook Events**: Modify the webhook endpoint in `server.js`
- **UI Enhancements**: Update components in the `src/` directory
- **Additional API Endpoints**: Add new routes in `server.js`

## License

This project is open source and available under the MIT License.
