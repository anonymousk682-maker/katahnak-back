const express = require('express');
const Poem = require('../models/Poem');
const { ensureVisitor, recordDailyVisitIfNew } = require('../middlewares/visitor');
const mongoose = require('mongoose');
const { getBucket } = require('../utils/gridfs');

const router = express.Router();

// visitor check endpoint
router.get('/visitor/check', ensureVisitor, (req,res) => {
  res.json({ visitorId: req.visitorId });
});

// list poems paginated
router.get('/poems', async (req,res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page||1));
    const limit = Math.min(50, parseInt(req.query.limit||20));
    const skip = (page-1)*limit;
    const poems = await Poem.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Poem.countDocuments();
    res.json({ poems, page, total });
  } catch (err) { next(err); }
});

// get poem detail (increments view once per visitor per day)
router.get('/poems/:id', ensureVisitor, async (req,res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

    const poem = await Poem.findById(id);
    if (!poem) return res.status(404).json({ message: 'Not found' });

    const isNew = await recordDailyVisitIfNew(req.visitorId, `/poems/${id}`);
    if (isNew) {
      poem.views = (poem.views || 0) + 1;
      await poem.save();
    }
    res.json({ poem, counted: isNew });
  } catch (err) { next(err); }
});

// featured poems
router.get('/featured', async (req,res, next) => {
  try {
    const limit = parseInt(req.query.limit || 6);
    // prioritize isFeatured true then by views
    const poems = await Poem.find().sort({ isFeatured: -1, views: -1 }).limit(limit);
    res.json({ poems });
  } catch (err) { next(err); }
});

// serve image from GridFS by file id
router.get('/uploads/:id', async (req,res, next) => {
  try {
    const fileId = req.params.id;
    if (!fileId || !mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).send('Invalid id');
    }
    const bucket = getBucket();

    const filesColl = mongoose.connection.db.collection('uploads.files');
    const fileDoc = await filesColl.findOne({ _id: new mongoose.Types.ObjectId(fileId) });
    if (!fileDoc) return res.status(404).send('Not found');

    res.setHeader('Content-Type', fileDoc.contentType || 'application/octet-stream');
    res.setHeader('Content-Length', fileDoc.length);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day

    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
    downloadStream.on('error', (err) => {
      console.error('GridFS download error', err);
      if (!res.headersSent) res.status(500).send('Error reading file');
    });
    downloadStream.pipe(res);
  } catch (err) { next(err); }
});

module.exports = router;
