const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Simple test endpoint
app.get('/hello', (req, res) => {
  res.send('Hello, World! Welcome to Bhone YouTube Channel.');
});

// Optional: root endpoint for easier browser testing
app.get('/', (req, res) => {
  res.send('✅ Node.js App is running on Kubernetes!');
});

// Bind to 0.0.0.0 to be accessible externally
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
});