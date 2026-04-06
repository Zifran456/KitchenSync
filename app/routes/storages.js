const express     = require('express');
const router      = express.Router();
const Storage     = require('../models/Storage');
const Item        = require('../models/Item');
const requireAuth = require('../middleware/requireAuth');

// POST /storages — create a new custom storage
router.post('/', requireAuth, async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) return res.redirect('/dashboard');

  try {
    await Storage.create({ name: name.trim(), userId: req.session.userId });
  } catch (err) {
    console.error(err);
  }
  res.redirect('/dashboard#storage-section');
});

// DELETE /storages/:id — delete a custom storage and all its items
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const storage = await Storage.findOneAndDelete({ _id: req.params.id, userId: req.session.userId });
    if (storage) {
      await Item.deleteMany({ userId: req.session.userId, storage: storage.name });
    }
  } catch (err) {
    console.error(err);
  }
  res.redirect('/dashboard');
});

module.exports = router;
