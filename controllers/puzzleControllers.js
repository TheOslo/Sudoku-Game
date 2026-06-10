const Puzzle = require('../models/puzzles');

const createPuzzle = async (req, res) => {
    try {
        const newPuzzle = new Puzzle({ board: req.body.board });
        const savedPuzzle = await newPuzzle.save();
        res.status(201).json(savedPuzzle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const createBulkPuzzles = async (req, res) => {
    try {
        if (!Array.isArray(req.body)) {
            return res.status(400).json({ error: "The request body must be an array of objects." });
        }
        const savedPuzzles = await Puzzle.insertMany(req.body);
        res.status(201).json({ message: `${savedPuzzles.length} puzzles added successfully!` });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getRandomPuzzle = async (req, res) => {
    try {
        const count = await Puzzle.countDocuments();
        if (count === 0) {
            return res.status(404).json({ error: "No puzzles found in database." });
        }
        const random = Math.floor(Math.random() * count);
        const randomPuzzle = await Puzzle.findOne().skip(random);
        res.json({ board: randomPuzzle.board });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { 
    getRandomPuzzle, 
    createPuzzle, 
    createBulkPuzzles 
};