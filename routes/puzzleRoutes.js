const express = require('express');
const router = express.Router();

const { 
  createPuzzle, 
  createBulkPuzzles, 
  getRandomPuzzle 
} = require('../controllers/puzzleControllers');

const { loginAdmin } = require('../controllers/adminController');
const adminAuth = require('../middleware/admin-auth');

// Public routes
router.get('/random', getRandomPuzzle);
router.post('/login', loginAdmin);

// Protected Admin routes
router.post('/', adminAuth, createPuzzle);
router.post('/bulk', adminAuth, createBulkPuzzles);

module.exports = router;