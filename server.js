const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path'); // Added missing import for path

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Store received webhook data
let webhookEntries = [];

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Send existing entries to newly connected client
  socket.emit('entries', webhookEntries);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Webhook endpoint to receive Contentstack webhooks
app.post('/webhook', (req, res) => {
  try {
    console.log('Webhook received:', req.body);
    
    // Add timestamp to the webhook data
    const webhookData = {
      ...req.body,
      timestamp: new Date().toISOString(),
      received_at: new Date().toLocaleString()
    };
    
    // Add to entries array
    webhookEntries.unshift(webhookData);
    
    // Keep only last 50 entries to prevent memory issues
    if (webhookEntries.length > 50) {
      webhookEntries = webhookEntries.slice(0, 50);
    }
    
    // Emit to all connected clients
    io.emit('newEntry', webhookData);
    
    res.status(200).json({ 
      success: true, 
      message: 'Webhook received successfully',
      entry_count: webhookEntries.length
    });
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing webhook',
      error: error.message
    });
  }
});

// Endpoint to get all entries
app.get('/api/entries', (req, res) => {
  res.json(webhookEntries);
});

// Endpoint to clear all entries
app.delete('/api/entries', (req, res) => {
  webhookEntries = [];
  io.emit('entriesCleared');
  res.json({ success: true, message: 'All entries cleared' });
});

// Webhook status endpoint
app.get('/webhook/status', (req, res) => {
  res.json({ 
    status: 'active', 
    timestamp: new Date().toISOString(),
    entry_count: webhookEntries.length
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve static files from React build
app.use(express.static('build'));

// Catch all handler for React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/webhook`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
