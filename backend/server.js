const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

let users = []; // This array will store user data

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  const user = { email, password };
  users.push(user);
  res.json({ message: 'User registered successfully.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
