const mongoose = require('mongoose');

const likedRecipeSchema = new mongoose.Schema({
  userId:   { type: String, required: true },
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true }
}, { timestamps: true });

// A user can only like a given recipe once
likedRecipeSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

module.exports = mongoose.model('LikedRecipe', likedRecipeSchema);
