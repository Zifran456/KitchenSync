const express     = require('express');
const router      = express.Router();
const Item        = require('../models/Item');
const Storage     = require('../models/Storage');
const LikedRecipe = require('../models/LikedRecipe');
const requireAuth = require('../middleware/requireAuth');
const { getSuggestedRecipes, lookupMeal, extractIngredients, parseSteps, getMatchedItemsForMeal } = require('../utils/mealdb');

// Helper: add display fields to a plain item object
function decorateItem(item) {
  const obj = item.toObject ? item.toObject() : item;
  obj.borderClass = obj.status === 'expired' ? 'border-red'
                  : obj.status === 'expiring' ? 'border-orange'
                  : 'border-green';
  obj.expiryFormatted = obj.expiryDate
    ? new Date(obj.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;
  return obj;
}

// GET / — welcome / landing
router.get('/', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.render('index');
});

// GET /login
router.get('/login', (req, res) => {
  const success = req.query.registered ? 'Account created! Please sign in.' : null;
  res.render('login', { error: null, success, demoEnabled: !!process.env.DEMO_EMAIL });
});

// GET /register — available on local; redirects to login on demo/Render deployment
router.get('/register', (req, res) => {
  if (process.env.DEMO_EMAIL) return res.redirect('/login');
  res.render('register', { error: null });
});

// GET /dashboard
router.get('/dashboard', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const today  = new Date();
  today.setHours(0, 0, 0, 0);
  const sevenDays = new Date(today);
  sevenDays.setDate(sevenDays.getDate() + 7);

  try {
    const [rawItems, expiredCount, expiringSoonCount, lowStockCount, customStorages, likedDocs] = await Promise.all([
      Item.find({ userId }).sort({ createdAt: -1 }),
      Item.countDocuments({ userId, expiryDate: { $lt: today } }),
      Item.countDocuments({ userId, expiryDate: { $gte: today, $lte: sevenDays } }),
      Item.countDocuments({ userId, quantity: { $lte: 2 } }),
      Storage.find({ userId }).sort({ createdAt: 1 }),
      LikedRecipe.find({ userId }).lean()
    ]);

    const allItems = rawItems.map(decorateItem);
    const expired  = allItems.filter(i => i.status === 'expired');
    const expiring = allItems.filter(i => i.status === 'expiring');
    const lowStock = allItems.filter(i => i.quantity <= 2);

    const userItemsForRecipes = rawItems.map(i => i.toObject({ virtuals: true }));
    const likedIds   = new Set(likedDocs.map(l => String(l.recipeId)));
    const allSuggested = await getSuggestedRecipes(userItemsForRecipes, likedIds);
    const topRecipes   = allSuggested.slice(0, 3);

    res.render('dashboard', {
      username:        req.session.username,
      isDemo:          !!req.session.isDemo,
      totalItems:      allItems.length,
      expiredCount,
      expiringSoonCount,
      lowStockCount,
      allItems,
      expired,
      expiring,
      lowStock,
      customStorages,
      topRecipes
    });
  } catch (err) {
    console.error(err);
    res.render('dashboard', {
      username: req.session.username,
      isDemo:   !!req.session.isDemo,
      totalItems: 0, expiredCount: 0, expiringSoonCount: 0, lowStockCount: 0,
      allItems: [], expired: [], expiring: [], lowStock: [], customStorages: [], topRecipes: []
    });
  }
});

// GET /add-item
router.get('/add-item', requireAuth, async (req, res) => {
  const storage = req.query.storage || null;
  const back    = req.query.back && req.query.back.startsWith('/') ? req.query.back : null;
  const error   = req.query.error ? 'Failed to add item. Make sure to select a storage location.' : null;
  const customStorages = await Storage.find({ userId: req.session.userId }).sort({ createdAt: 1 });
  res.render('add-item', { error, storage, back, customStorages });
});

// GET /storage/:id — custom storage page
router.get('/storage/:id', requireAuth, async (req, res) => {
  try {
    const storage = await Storage.findOne({ _id: req.params.id, userId: req.session.userId });
    if (!storage) return res.redirect('/dashboard');
    const items = (await Item.find({ userId: req.session.userId, storage: storage.name }).sort({ expiryDate: 1 }))
      .map(decorateItem);
    res.render('storage', { storage, items });
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
});

// GET /fridge
router.get('/fridge', requireAuth, async (req, res) => {
  const items = (await Item.find({ userId: req.session.userId, storage: 'Fridge' }).sort({ expiryDate: 1 }))
    .map(decorateItem);
  res.render('fridge', { items });
});

// GET /freezer
router.get('/freezer', requireAuth, async (req, res) => {
  const items = (await Item.find({ userId: req.session.userId, storage: 'Freezer' }).sort({ expiryDate: 1 }))
    .map(decorateItem);
  res.render('freezer', { items });
});

// GET /pantry
router.get('/pantry', requireAuth, async (req, res) => {
  const items = (await Item.find({ userId: req.session.userId, storage: 'Pantry' }).sort({ expiryDate: 1 }))
    .map(decorateItem);
  res.render('pantry', { items });
});

// GET /recipes — suggest recipes based on what the user has in storage
router.get('/recipes', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const [rawItems, likedDocs] = await Promise.all([
      Item.find({ userId }),
      LikedRecipe.find({ userId }).lean()
    ]);
    const userItems = rawItems.map(i => i.toObject({ virtuals: true }));
    const likedIds  = new Set(likedDocs.map(l => String(l.recipeId)));
    const recipes   = await getSuggestedRecipes(userItems, likedIds);
    res.render('recipes', { recipes });
  } catch (err) {
    console.error(err);
    res.render('recipes', { recipes: [] });
  }
});

// GET /liked-recipes — show recipes the user has saved
router.get('/liked-recipes', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const [rawItems, likedDocs] = await Promise.all([
      Item.find({ userId }),
      LikedRecipe.find({ userId }).lean()
    ]);

    if (likedDocs.length === 0) return res.render('liked-recipes', { recipes: [] });

    const userItems = rawItems.map(i => i.toObject({ virtuals: true }));

    const meals = await Promise.all(likedDocs.map(l => lookupMeal(l.recipeId)));

    const recipes = meals
      .filter(Boolean)
      .map(full => {
        const matchedItems = getMatchedItemsForMeal(full, userItems);
        const hasExpiring  = matchedItems.some(i => i.status === 'expiring');
        return {
          _id:         full.idMeal,
          name:        full.strMeal,
          description: [full.strCategory, full.strArea].filter(Boolean).join(' · '),
          thumbnail:   full.strMealThumb,
          ingredients: extractIngredients(full),
          steps:       parseSteps(full.strInstructions),
          matchedItems,
          hasExpiring,
          liked:       true
        };
      });

    res.render('liked-recipes', { recipes });
  } catch (err) {
    console.error(err);
    res.render('liked-recipes', { recipes: [] });
  }
});

module.exports = router;
