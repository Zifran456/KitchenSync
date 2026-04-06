const express  = require('express');
const router   = express.Router();
const fs       = require('fs');
const path     = require('path');

const USERS_FILE = path.join(__dirname, '..', 'users.json');

function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// POST /auth/register
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.render('register', { error: 'All fields are required.' });
  }

  const users = readUsers();
  if (users.find(u => u.email === email || u.username === username)) {
    return res.render('register', { error: 'Username or email is already taken.' });
  }

  const newUser = {
    id: 'user_' + Date.now(),
    username,
    email,
    password
  };
  users.push(newUser);
  writeUsers(users);

  res.redirect('/login?registered=1');
});

// POST /auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('login', { error: 'Please enter your email and password.', success: null });
  }

  const users = readUsers();
  const user  = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.render('login', { error: 'Invalid email or password.', success: null });
  }

  req.session.userId   = user.id;
  req.session.username = user.username;
  res.redirect('/dashboard');
});

// GET /auth/logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
