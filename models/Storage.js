const mongoose = require('mongoose');

const storageSchema = new mongoose.Schema({
  name:   { type: String, required: true, trim: true },
  userId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Storage', storageSchema);
