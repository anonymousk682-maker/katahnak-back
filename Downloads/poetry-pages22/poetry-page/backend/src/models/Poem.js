const mongoose = require('mongoose');

const poemSchema = new mongoose.Schema({
  title:{ type:String, required:true },
  author:{ type:String, default: 'Unknown' },
  body:{ type:String, required:true },
  tags:[String],
  // remove imageUrl; use a GridFS file id instead
  imageFileId: { type: mongoose.Schema.Types.ObjectId, default: null },
  imageFilename: { type: String, default: null }, // optional helpful metadata
  views:{ type:Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isFeatured:{ type:Boolean, default:false },
  createdAt:{ type:Date, default: Date.now }
});

module.exports = mongoose.model('Poem', poemSchema);
