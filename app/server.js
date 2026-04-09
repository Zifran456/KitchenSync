require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const path = require('path');

const app = express();
const PORT       = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kitchensync';

app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    const User = require('./models/User');

    // Ensure demo account exists (Render deployment)
    if (process.env.DEMO_EMAIL && process.env.DEMO_PASSWORD) {
      const existing = await User.findOne({ email: process.env.DEMO_EMAIL });
      if (!existing) {
        await User.create({ username: 'Demo User', email: process.env.DEMO_EMAIL, password: process.env.DEMO_PASSWORD });
        console.log('Demo account created');
      }
    }

    // Ensure test account exists for local development
    if (!process.env.DEMO_EMAIL) {
      const existing = await User.findOne({ email: 'test@kitchensync.local' });
      if (!existing) {
        await User.create({ username: 'Test User', email: 'test@kitchensync.local', password: 'test1234' });
        console.log('Test account created — email: test@kitchensync.local  password: test1234');
      }
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files (public/ folder serves CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Method override — allows DELETE/PUT via HTML forms using ?_method=DELETE
app.use(methodOverride('_method'));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'kitchensync-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGODB_URI }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  }
}));

// Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/items', require('./routes/items'));
app.use('/storages', require('./routes/storages'));
app.use('/recipes', require('./routes/recipes'));

app.listen(PORT, () => {
  console.log(`KitchenSync running at http://localhost:${PORT}`);
});
