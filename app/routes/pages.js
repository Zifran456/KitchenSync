const express     = require('express');
const router      = express.Router();
const Item        = require('../models/Item');
const Storage     = require('../models/Storage');
const Recipe      = require('../models/Recipe');
const LikedRecipe = require('../models/LikedRecipe');
const requireAuth = require('../middleware/requireAuth');

// Returns true if a user item name matches a recipe keyword.
// We check both directions so "eggs" matches keyword "egg" and vice versa.
function itemMatchesKeyword(itemName, keyword) {
  const name = itemName.toLowerCase().trim();
  const kw   = keyword.toLowerCase().trim();
  return name.includes(kw) || kw.includes(name);
}

// Given all of the user's items and one recipe, return the subset of non-expired
// items that match at least one keyword. Expired items are excluded entirely.
function getMatchedItems(userItems, recipe) {
  const matched = [];
  const seen = new Set();
  for (const item of userItems) {
    if (item.status === 'expired') continue;  // skip expired items
    for (const kw of recipe.keywords) {
      if (itemMatchesKeyword(item.name, kw) && !seen.has(String(item._id))) {
        seen.add(String(item._id));
        matched.push({ name: item.name, status: item.status });
        break;
      }
    }
  }
  return matched;
}

// Score a recipe for sorting: expiring items rank above good.
function recipeScore(matchedItems) {
  return matchedItems.reduce((sum, i) => {
    if (i.status === 'expiring') return sum + 2;
    return sum + 1;
  }, 0);
}

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
  res.render('login', { error: null, success });
});

// GET /register
router.get('/register', (req, res) => {
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
    const [rawItems, expiredCount, expiringSoonCount, lowStockCount, customStorages, allRecipes] = await Promise.all([
      Item.find({ userId }).sort({ createdAt: -1 }),
      Item.countDocuments({ userId, expiryDate: { $lt: today } }),
      Item.countDocuments({ userId, expiryDate: { $gte: today, $lte: sevenDays } }),
      Item.countDocuments({ userId, quantity: { $lte: 2 } }),
      Storage.find({ userId }).sort({ createdAt: 1 }),
      Recipe.find().lean()
    ]);

    const allItems = rawItems.map(decorateItem);
    const expired  = allItems.filter(i => i.status === 'expired');
    const expiring = allItems.filter(i => i.status === 'expiring');
    const lowStock = allItems.filter(i => i.quantity <= 2);

    // Build top 3 recipe suggestions (same logic as /recipes)
    const userItemsForRecipes = rawItems.map(i => i.toObject({ virtuals: true }));
    const suggestedRecipes = [];
    for (const recipe of allRecipes) {
      const matchedItems = getMatchedItems(userItemsForRecipes, recipe);
      if (matchedItems.length === 0) continue;
      const hasExpiring = matchedItems.some(i => i.status === 'expiring');
      const score       = recipeScore(matchedItems);
      suggestedRecipes.push({ ...recipe, matchedItems, hasExpiring, score });
    }
    suggestedRecipes.sort((a, b) => b.score - a.score);
    const topRecipes = suggestedRecipes.slice(0, 3);

    res.render('dashboard', {
      username:        req.session.username,
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
    const [rawItems, allRecipes, likedDocs] = await Promise.all([
      Item.find({ userId }),
      Recipe.find().lean(),
      LikedRecipe.find({ userId }).lean()
    ]);

    // Attach virtual status to every item
    const userItems = rawItems.map(i => i.toObject({ virtuals: true }));

    const likedIds = new Set(likedDocs.map(l => String(l.recipeId)));

    // Build matched recipe objects
    const matched = [];
    for (const recipe of allRecipes) {
      const matchedItems = getMatchedItems(userItems, recipe);
      if (matchedItems.length === 0) continue;

      const hasExpiring = matchedItems.some(i => i.status === 'expiring');
      const score       = recipeScore(matchedItems);

      matched.push({
        ...recipe,
        matchedItems,
        hasExpiring,
        score,
        liked: likedIds.has(String(recipe._id))
      });
    }

    // Sort: expiring items first, then by match count
    matched.sort((a, b) => b.score - a.score);

    res.render('recipes', { recipes: matched, totalRecipes: allRecipes.length });
  } catch (err) {
    console.error(err);
    res.render('recipes', { recipes: [], totalRecipes: 0 });
  }
});

// GET /liked-recipes — show recipes the user has saved
router.get('/liked-recipes', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const [rawItems, likedDocs] = await Promise.all([
      Item.find({ userId }),
      LikedRecipe.find({ userId }).populate('recipeId').lean()
    ]);

    const userItems = rawItems.map(i => i.toObject({ virtuals: true }));

    const likedRecipes = likedDocs
      .filter(l => l.recipeId) // guard against deleted recipes
      .map(l => {
        const recipe      = l.recipeId;
        const matchedItems = getMatchedItems(userItems, recipe);
        const hasExpiring = matchedItems.some(i => i.status === 'expiring');
        return { ...recipe, matchedItems, hasExpiring, liked: true };
      });

    res.render('liked-recipes', { recipes: likedRecipes });
  } catch (err) {
    console.error(err);
    res.render('liked-recipes', { recipes: [] });
  }
});

module.exports = router;
