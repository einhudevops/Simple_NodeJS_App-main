const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Root endpoint with styled HTML response
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Welcome</title>
        <style>
          body {
            background-color: #f0f8ff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
          }
          h1 {
            color: #0077cc;
            font-size: 48px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h1>✅ Node.js App is Running on Kubernetes!</h1>
      </body>
    </html>
  `);
});

// Optional: test endpoint
app.get('/hello', (req, res) => {
  res.send('Hello, World! Welcome to BhoneMyatKyaw YouTube Channel.');
});

// Bind to 0.0.0.0 for external access
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
});
