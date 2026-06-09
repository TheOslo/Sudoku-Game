const express = require('express');
const cors = require('cors');
const connectDB = require

const app = express();
const PORT = 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());  

// --- Routes ---
app.get('/api/puzzles/random', async (req, res) => {
    try {
        // We will insert the MongoDB collection query logic here next
        res.json({ message: "Route working! Ready for database integration." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Add a new puzzle layout preset to the database
app.post('/api/puzzles', async (req, res) => {
    try {
        // We will insert the database save logic here next
        res.status(201).json({ message: "Route working! Ready to accept post data." });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// --- Server Execution ---
app.listen(PORT, () => {
    console.log(`Server running smoothly on port ${PORT}`);
});