const express = require('express');
const logger = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000; // different from the other programs

app.use(express.json());
app.use(logger);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/foods', require('./routes/foods'));
app.use('/api/orders', require('./routes/orders'));

app.use(notFound);      // must come after all routes
app.use(errorHandler);  // must be last

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
