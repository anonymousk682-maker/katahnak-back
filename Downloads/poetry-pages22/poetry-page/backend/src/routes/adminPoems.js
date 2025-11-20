const express = require('express');
const Poem = require('../models/Poem');
const { upload } = require('../utils/upload-memory');
const { getBucket } = require('../utils/gridfs');
const mongoose = require('mongoose');
const auth = require('../middlewares/auth');

const router = express.Router();
router.use(auth);

// helper: upload buffer to GridFS, returns ObjectId
async function uploadBufferToGridFS(buffer, originalname, mimetype) {
  const bucket = getBucket();
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(originalname, {
      contentType: mimetype,
      metadata: {}
    });
    uploadStream.end(buffer, (err) => {
      if (err) return reject(err);
      resolve(uploadStream.id);
    });
  });
}

// create poem (multipart/form-data)
router.post('/admin/poems', upload.single('image'), async (req,res, next) => {
  try {
    const { title, author, body, tags, isFeatured } = req.body;
    let imageFileId = null, imageFilename = null;

    if (req.file) {
      imageFilename = req.file.originalname;
      imageFileId = await uploadBufferToGridFS(req.file.buffer, req.file.originalname, req.file.mimetype);
    }

    const poem = await Poem.create({
      title,
      author,
      body,
      tags: tags ? JSON.parse(tags) : [],
      imageFileId,
      imageFilename,
      isFeatured: !!isFeatured,
      createdBy: req.user._id
    });

    res.json({ poem });
  } catch (err) { next(err); }
});

// update poem (optionally replace image)
router.put('/admin/poems/:id', upload.single('image'), async (req,res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

    const update = {};
    if (req.body.title) update.title = req.body.title;
    if (req.body.author) update.author = req.body.author;
    if (req.body.body) update.body = req.body.body;
    if (req.body.tags) update.tags = typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags;
    if (typeof req.body.isFeatured !== 'undefined') update.isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true;

    if (req.file) {
      // upload new image to GridFS
      const imageFilename = req.file.originalname;
      const imageFileId = await uploadBufferToGridFS(req.file.buffer, imageFilename, req.file.mimetype);
      // delete old image if exists
      const existing = await Poem.findById(id).select('imageFileId');
      if (existing && existing.imageFileId) {
        try {
          const bucket = getBucket();
          await bucket.delete(existing.imageFileId);
        } catch (err) {
          console.warn('Failed deleting old GridFS file', err);
        }
      }
      update.imageFileId = imageFileId;
      update.imageFilename = imageFilename;
    }

    const poem = await Poem.findByIdAndUpdate(id, update, { new: true });
    res.json({ poem });
  } catch (err) { next(err); }
});

// delete poem + remove GridFS file if present
router.delete('/admin/poems/:id', async (req,res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

    const poem = await Poem.findById(id);
    if (!poem) return res.status(404).json({ message: 'Not found' });

    if (poem.imageFileId) {
      try {
        const bucket = getBucket();
        await bucket.delete(poem.imageFileId);
      } catch (err) {
        console.warn('Failed deleting associated GridFS file', err);
      }
    }

    await Poem.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

// analytics: daily unique visitors for last N days
router.get('/admin/analytics/daily-unique', async (req,res, next) => {
  try {
    const days = Math.min(90, parseInt(req.query.days || 7));
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days-1));
    const startStr = start.toISOString().slice(0,10);

    const DailyVisit = require('../models/DailyVisit');
    const aggr = await DailyVisit.aggregate([
      { $match: { date: { $gte: startStr } } },
      { $group: { _id: "$date", uniqueVisitors: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const results = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const s = d.toISOString().slice(0,10);
      const found = aggr.find(a => a._id === s);
      results.push({ date: s, uniqueVisitors: found ? found.uniqueVisitors : 0 });
    }

    res.json(results);
  } catch (err) { next(err); }
});

module.exports = router;
