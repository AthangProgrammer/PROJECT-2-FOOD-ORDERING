// 404 for unknown routes
exports.notFound = (req, res) => {
  res.status(404).json({ error: 'Route not found' });
};

// Central error handler (must have 4 params)
exports.errorHandler = (err, req, res, next) => {
  if (err.type === 'entity.parse.failed')
    return res.status(400).json({ error: 'Invalid JSON body' });
  if (err.name === 'ValidationError') // Mongoose validation failed
    return res.status(400).json({ error: Object.values(err.errors).map((e) => e.message).join(', ') });
  if (err.name === 'CastError') // e.g. malformed ObjectId in the URL
    return res.status(400).json({ error: 'Invalid id' });
  if (err.code === 11000) // duplicate key (unique index)
    return res.status(409).json({ error: 'Already exists' });
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};
