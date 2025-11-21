// routes/settings.js
import express from 'express';
import SiteSettings from '../models/SiteSettings.js';
const router = express.Router();

// Get settings
router.get('/', async (req,res) => {
  let s = await SiteSettings.findOne();
  if (!s) {
    s = await SiteSettings.create({
      heroQuote: `"A poem is a small (or large) machine made of words — built to move the reader." — Anonymous`,
      featuredCardQuote: `"Poetry is life itself — it starts with words and becomes experience."`,
      contactEmail: "admin@example.com",
      locationText: "The Digital Verse (Online)"
    });
  }
  res.json(s);
});

// Update settings
router.put('/', async (req,res) => {
  let s = await SiteSettings.findOne();
  if (!s) s = await SiteSettings.create(req.body);
  else Object.assign(s, req.body);
  await s.save();
  res.json(s);
});

export default router;
