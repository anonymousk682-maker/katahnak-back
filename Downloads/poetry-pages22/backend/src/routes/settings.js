const express = require('express');
const SiteSettings = require('../models/SiteSettings');

const router = express.Router();

// GET /api/settings
router.get('/settings', async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = await SiteSettings.create({
        heroQuote: `"A poem is a small (or large) machine made of words — built to move the reader." — Anonymous`,
        featuredCardQuote: `"Poetry is life itself — it starts with words and becomes experience."`,
        contactEmail: "admin@example.com",
        locationText: "The Digital Verse (Online)"
      });
    }

    res.json(settings);
  } catch (err) {
    next(err);
  }
});

// PUT /api/settings
router.put('/settings', async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = await SiteSettings.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }

    res.json(settings);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
