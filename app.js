require('dotenv').config();
const express = require('express');
const connectDB = require('./db/connect');
const Puzzle = require('./models/puzzles')
const { getRandomPuzzle, createPuzzle, createBulkPuzzles } = require('./controllers/puzzleControllers')


const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(express.static('public'));

// --- Routes ---
app.get('/api/puzzles/random', getRandomPuzzle);
app.post('/api/puzzles', createPuzzle);
app.post('/api/puzzles/bulk', createBulkPuzzles);


// Start
const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URI);
        console.log("MongoDB Atlas Connected cleanly!");

        app.listen(port, () => {
            console.log(`Server is running on port ${port}...`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
    }
};

start()