const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'https://code-defenders-cih-2-0-1vn9.vercel.app/', // Set to frontend URL in production
}));
app.use(express.json());

// Connected SSE clients
let clients = [];

// SSE Route: Frontend listens here
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  clients.push(res);

  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

// Alert route: Extension posts here
app.post('/alert', (req, res) => {
  const alert = req.body;

  if (!alert.message) {
    return res.status(400).json({ error: 'Alert message required' });
  }

  clients.forEach(client => {
    client.write(`data: ${JSON.stringify(alert)}\n\n`);
  });

  console.log('Alert sent to clients:', alert);

  res.status(200).json({ message: 'Alert sent to connected clients.' });
});

// Health check route (optional)
app.get('/', (req, res) => {
  res.send('CyberSentinel Backend is running.');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CyberSentinel backend listening on port ${PORT}`);
});
