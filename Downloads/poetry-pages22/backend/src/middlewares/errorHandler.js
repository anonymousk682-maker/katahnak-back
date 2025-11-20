function errorHandler(err, req, res, next) {
  console.error(err);
  const msg = err.message || 'Server error';
  res.status(500).json({ message: msg });
}

module.exports = errorHandler;
