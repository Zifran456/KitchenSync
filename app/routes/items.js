const express     = require('express');
const router      = express.Router();
const Item        = require('../models/Item');
const Storage     = require('../models/Storage');
const requireAuth = require('../middleware/requireAuth');

// POST /items — create a new item
router.post('/', requireAuth, async (req, res) => {
  const { itemName, quantity, storage, expiryDate, back } = req.body;
  const safeBack = back && back.startsWith('/') ? back : null;

  if (!itemName || !storage) {
    const qs = new URLSearchParams({ error: '1', ...(storage && { storage }), ...(safeBack && { back: safeBack }) });
    return res.redirect(`/add-item?${qs}`);
  }

  try {
    await Item.create({
      name:       itemName.trim(),
      quantity:   parseInt(quantity) || 1,
      storage,
      expiryDate: expiryDate || null,
      userId:     req.session.userId
    });
    res.redirect(safeBack || '/dashboard');
  } catch (err) {
    console.error(err);
    const qs = new URLSearchParams({ error: '1', ...(storage && { storage }), ...(safeBack && { back: safeBack }) });
    res.redirect(`/add-item?${qs}`);
  }
});

// GET /items/:id/edit — show pre-filled edit form
router.get('/:id/edit', requireAuth, async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, userId: req.session.userId });
    if (!item) return res.redirect('/dashboard');

    const customStorages = await Storage.find({ userId: req.session.userId }).sort({ createdAt: 1 });
    const back = req.get('Referer') && req.get('Referer').startsWith(req.protocol + '://' + req.get('host'))
      ? new URL(req.get('Referer')).pathname
      : '/dashboard';

    const expiryValue = item.expiryDate ? item.expiryDate.toISOString().split('T')[0] : '';
    res.render('edit-item', { item, expiryValue, customStorages, back, error: null });
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
});

// PUT /items/:id — save edits
router.put('/:id', requireAuth, async (req, res) => {
  const { itemName, quantity, storage, expiryDate, back } = req.body;
  const safeBack = back && back.startsWith('/') ? back : '/dashboard';

  try {
    await Item.findOneAndUpdate(
      { _id: req.params.id, userId: req.session.userId },
      {
        name:       itemName.trim(),
        quantity:   parseInt(quantity) || 1,
        storage,
        expiryDate: expiryDate || null
      }
    );
    res.redirect(safeBack);
  } catch (err) {
    console.error(err);
    res.redirect(safeBack);
  }
});

// DELETE /items/:id — delete an item (requires ?_method=DELETE from form)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await Item.findOneAndDelete({ _id: req.params.id, userId: req.session.userId });
  } catch (err) {
    console.error(err);
  }
  // Redirect back to whichever page the user was on
  const ref = req.get('Referer') || '/dashboard';
  res.redirect(ref);
});

module.exports = router;
