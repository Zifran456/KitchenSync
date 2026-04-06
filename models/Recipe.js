const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, default: '' },
  category:    { type: String, default: 'dinner' }, // breakfast, lunch, dinner, snack
  keywords:    [{ type: String }],   // lowercase strings matched against user item names
  ingredients: [{ type: String }],   // human-readable ingredient list shown to user
  steps:       [{ type: String }]    // step-by-step instructions
});

module.exports = mongoose.model('Recipe', recipeSchema);
