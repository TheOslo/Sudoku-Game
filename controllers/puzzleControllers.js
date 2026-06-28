const Puzzle = require('../models/puzzles');
const { StatusCodes } = require('http-status-codes');

const createPuzzle = async (req, res) => {
  const { board } = req.body; 
  const puzzle = await Puzzle.create({ board });
  res.status(StatusCodes.CREATED).json({ success: true, puzzle });
};

const createBulkPuzzles = async (req, res) => {
  const { puzzles } = req.body;

  if (!Array.isArray(puzzles)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Please provide an array of puzzles' });
  }

  if (puzzles.length > 100) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Cannot upload more than 100 puzzles at once' });
  }

  const formattedPuzzles = puzzles.map(p => ({ board: p.board }));
  
  const result = await Puzzle.insertMany(formattedPuzzles);
  res.status(StatusCodes.CREATED).json({ success: true, count: result.length });
};

const getRandomPuzzle = async (req, res, next) => {
  try {
    const puzzle = await Puzzle.aggregate([{ $sample: { size: 1 } }]);
    if (!puzzle || puzzle.length === 0) {
      return res.status(404).json({ msg: 'No puzzles found in the database.' });
    }
    res.status(200).json(puzzle[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPuzzle,
  createBulkPuzzles,
  getRandomPuzzle
};