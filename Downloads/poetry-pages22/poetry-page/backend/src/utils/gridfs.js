const mongoose = require('mongoose');

/**
 * Returns a GridFSBucket instance. Ensure mongoose connection is established first.
 */
function getBucket() {
  if (!mongoose.connection || !mongoose.connection.db) {
    throw new Error('Mongoose connection not ready. Call getBucket after DB connection.');
  }
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
}

module.exports = { getBucket };
