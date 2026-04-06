const express     = require('express');
const router      = express.Router();
const LikedRecipe = require('../models/LikedRecipe');
const requireAuth = require('../middleware/requireAuth');

// POST /recipes/:id/like — like a recipe
router.post('/:id/like', requireAuth, async (req, res) => {
  try {
    await LikedRecipe.create({ userId: req.session.userId, recipeId: req.params.id });
  } catch (err) {
    // Duplicate key error (already liked) — silently ignore
  }
  res.json({ liked: true });
});

// DELETE /recipes/:id/like — unlike a recipe
router.delete('/:id/like', requireAuth, async (req, res) => {
  try {
    await LikedRecipe.deleteOne({ userId: req.session.userId, recipeId: req.params.id });
  } catch (err) {
    console.error(err);
  }
  res.json({ liked: false });
});

module.exports = router;
