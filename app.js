const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Root endpoint with styled HTML response
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Node.js on Kubernetes</title>
        <style>
          body {
            background: linear-gradient(135deg, #e0f7fa, #f8bbd0);
            margin: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          .container {
            text-align: center;
            background-color: #ffffffbb;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          }
          h1 {
            color: #0077cc;
            font-size: 40px;
            margin-bottom: 20px;
          }
          p {
            font-size: 20px;
            color: #333;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✅ Node.js App is Running on Kubernetes!</h1>
          <p>Visit <code>/hello</code> for a friendly greeting!</p>
        </div>
      </body>
    </html>
  `);
});

// Optional: test endpoint
app.get('/hello', (req, res) => {
  res.send('👋 Hello, World! Welcome to BhoneMyat13579 YouTube Channel.');
});

// Bind to 0.0.0.0 for external access
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
});
