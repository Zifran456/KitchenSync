const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  quantity:   { type: Number, required: true, min: 1, default: 1 },
  storage:    { type: String, required: true },
  expiryDate: { type: Date, default: null },
  userId:     { type: String, required: true }
}, { timestamps: true });

// Virtual: derive status from expiryDate
itemSchema.virtual('status').get(function () {
  if (!this.expiryDate) return 'good';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  if (this.expiryDate < today) return 'expired';
  if (this.expiryDate <= sevenDaysFromNow) return 'expiring';
  return 'good';
});

itemSchema.set('toObject', { virtuals: true });
itemSchema.set('toJSON',   { virtuals: true });

module.exports = mongoose.model('Item', itemSchema);
