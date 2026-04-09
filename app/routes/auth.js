const express     = require('express');
const router      = express.Router();
const User        = require('../models/User');
const Item        = require('../models/Item');
const Storage     = require('../models/Storage');
const LikedRecipe = require('../models/LikedRecipe');
const requireAuth = require('../middleware/requireAuth');

// POST /auth/register — available on local; disabled on demo/Render deployment
router.post('/register', async (req, res) => {
  if (process.env.DEMO_EMAIL) return res.redirect('/login');
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.render('register', { error: 'All fields are required.' });
  }
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.render('register', { error: 'An account with that email already exists.' });
    await User.create({ username, email, password });
    res.redirect('/login?registered=1');
  } catch (err) {
    console.error(err);
    res.render('register', { error: 'Something went wrong. Please try again.' });
  }
});

// GET /auth/demo — one-click login as the demo account
router.get('/demo', async (req, res) => {
  if (!process.env.DEMO_EMAIL) return res.redirect('/login');
  try {
    const user = await User.findOne({ email: process.env.DEMO_EMAIL });
    if (!user) return res.redirect('/login');
    req.session.userId   = user._id.toString();
    req.session.username = user.username;
    req.session.isDemo   = true;
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.redirect('/login');
  }
});

// POST /auth/demo/reset — wipe and re-seed demo account data
router.post('/demo/reset', requireAuth, async (req, res) => {
  if (!process.env.DEMO_EMAIL || !req.session.isDemo) return res.redirect('/dashboard');
  try {
    const demoUser = await User.findOne({ email: process.env.DEMO_EMAIL });
    if (!demoUser || req.session.userId !== demoUser._id.toString()) return res.redirect('/dashboard');

    const userId = demoUser._id;
    const today  = new Date();
    const d = days => new Date(today.getFullYear(), today.getMonth(), today.getDate() + days);

    await Promise.all([
      Item.deleteMany({ userId }),
      LikedRecipe.deleteMany({ userId }),
      Storage.deleteMany({ userId })
    ]);

    await Item.insertMany([
      { name: 'Eggs',          quantity: 12, storage: 'Fridge',  expiryDate: d(10),  userId },
      { name: 'Milk',          quantity: 1,  storage: 'Fridge',  expiryDate: d(3),   userId },
      { name: 'Butter',        quantity: 2,  storage: 'Fridge',  expiryDate: d(14),  userId },
      { name: 'Chicken Breast',quantity: 2,  storage: 'Fridge',  expiryDate: d(2),   userId },
      { name: 'Spinach',       quantity: 1,  storage: 'Fridge',  expiryDate: d(-1),  userId },
      { name: 'Ground Beef',   quantity: 3,  storage: 'Freezer', expiryDate: d(30),  userId },
      { name: 'Frozen Corn',   quantity: 2,  storage: 'Freezer', expiryDate: d(60),  userId },
      { name: 'Pasta',         quantity: 4,  storage: 'Pantry',  expiryDate: d(90),  userId },
      { name: 'Garlic',        quantity: 5,  storage: 'Pantry',  expiryDate: d(7),   userId },
      { name: 'Onion',         quantity: 3,  storage: 'Pantry',  expiryDate: d(20),  userId },
      { name: 'Rice',          quantity: 2,  storage: 'Pantry',  expiryDate: d(120), userId },
      { name: 'Tomato',        quantity: 3,  storage: 'Pantry',  expiryDate: d(5),   userId },
      { name: 'Olive Oil',     quantity: 1,  storage: 'Pantry',  expiryDate: d(180), userId },
    ]);

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('login', { error: 'Please enter your email and password.', success: null });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.render('login', { error: 'Invalid email or password.', success: null });
    }

    req.session.userId   = user._id.toString();
    req.session.username = user.username;
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Something went wrong. Please try again.', success: null });
  }
});

// GET /auth/logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

module.exports = router;
