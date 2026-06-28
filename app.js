require('dotenv').config();
const express = require('express');

const cors = require('cors');
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5000',
  optionsSuccessStatus: 200
};
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');

const mongoose = require('mongoose');

const puzzleRouter = require('./routes/puzzleRoutes');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const adminBasicAuth = require('./middleware/admin-basic-auth')

const app = express();

if (process.env.FRONTEND_URL) {
  app.set('trust proxy', 1);
} else {
  app.set('trust proxy', false);
}

app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

app.use(express.json({ limit: '10kb' }));
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors(corsOptions));

app.use('/admin', adminBasicAuth, express.static('./private'));

app.use(express.static('./public'));

app.use('/api/puzzles', puzzleRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(port, () => console.log(`Server listening on port ${port}...`));
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

start();