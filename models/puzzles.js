const mongoose = require('mongoose');

const puzzleSchema = new mongoose.Schema({
    board: {
        type: [[Number]],
        required: true
    }
});

module.exports = mongoose.model('Puzzle', puzzleSchema);