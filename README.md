# ZenSudoku

ZenSudoku is a full-stack Sudoku game with a responsive browser UI and an Express + MongoDB backend. The frontend displays the Sudoku board, handles player input, and requests random puzzles from the backend.

## Features

- Random puzzles loaded from MongoDB
- Interactive 9x9 Sudoku grid
- Row, column, and 3x3 box highlighting
- On-screen number pad and keyboard input
- Conflict detection for repeated numbers
- Backtracking solver
- Timer
- Clear board and new game controls
- Light/dark theme toggle
- API routes for adding one puzzle or many puzzles

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | HTML, CSS, vanilla JavaScript |
| Backend | Node.js, Express |
| Database | MongoDB Atlas, Mongoose |
| Config | dotenv |

## Project Structure

```text
Sudoku-Game/
|-- app.js                         # Express server and routes
|-- package.json                   # Node dependencies
|-- package-lock.json
|-- .env                           # Local environment variables, not committed
|-- controllers/
|   `-- puzzleControllers.js       # Puzzle API handlers
|-- db/
|   `-- connect.js                 # MongoDB connection helper
|-- models/
|   `-- puzzles.js                 # Mongoose puzzle schema
`-- public/
    |-- index.html                 # Game UI
    |-- style.css                  # Styling and themes
    `-- logic.js                   # Game logic, solver, and API calls
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- MongoDB Atlas cluster or another MongoDB database

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

`PORT` is optional. If it is not set, the server uses `5000`.

If you use MongoDB Atlas, make sure your current IP address is allowed in Atlas Network Access.

### Run the App

```bash
node app.js
```

When the backend connects successfully, the terminal should show:

```text
MongoDB Atlas Connected cleanly!
Server is running on port 5000...
```

Open the game:

```text
http://localhost:5000
```

For auto-restart during development:

```bash
npx nodemon app.js
```

## Puzzle Format

Each puzzle is stored as a 9x9 matrix. Use `0` for empty cells.

```json
{
  "board": [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ]
}
```

## Add Puzzle Data

Start the server first, then add at least one puzzle. The frontend calls `/api/puzzles/random`, so the database must contain puzzle documents.

### Add One Puzzle

```bash
curl -X POST http://localhost:5000/api/puzzles \
  -H "Content-Type: application/json" \
  -d '{"board":[[5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],[8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],[0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9]]}'
```

PowerShell:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:5000/api/puzzles `
  -ContentType "application/json" `
  -Body '{"board":[[5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],[8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],[0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9]]}'
```

### Add Multiple Puzzles

```bash
curl -X POST http://localhost:5000/api/puzzles/bulk \
  -H "Content-Type: application/json" \
  -d '[{"board":[[5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],[8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],[0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9]]}]'
```

## API Endpoints

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/puzzles/random` | Returns one random puzzle board |
| `POST` | `/api/puzzles` | Saves one puzzle |
| `POST` | `/api/puzzles/bulk` | Saves multiple puzzles |

### GET `/api/puzzles/random`

Success response:

```json
{
  "board": [[5, 3, 0, 0, 7, 0, 0, 0, 0]]
}
```

If no puzzles exist:

```json
{
  "error": "No puzzles found in database."
}
```

### POST `/api/puzzles`

Request body:

```json
{
  "board": [[5, 3, 0, 0, 7, 0, 0, 0, 0]]
}
```

### POST `/api/puzzles/bulk`

Request body:

```json
[
  {
    "board": [[5, 3, 0, 0, 7, 0, 0, 0, 0]]
  }
]
```

## How to Play

1. Open `http://localhost:5000`.
2. Click an empty cell to select it.
3. Enter a number with the on-screen pad or keyboard keys `1` to `9`.
4. Use `Backspace` or `Delete` to clear a selected cell.
5. Click `New Game` to load another random puzzle.
6. Click `Clear` to reset your entries for the current puzzle.
7. Click `Solve` to fill the board with the solver.

## Troubleshooting

### `Cannot GET /`

Make sure the server is running from the project root:

```bash
node app.js
```

The app serves the frontend from `public/`, so `public/index.html` must exist.

### `MONGODB_URI` is undefined

Check that `.env` is in the project root and the variable name is spelled exactly:

```env
MONGODB_URI=your_mongodb_connection_string
```

### MongoDB connection fails

Check these common causes:

- Your current IP is not allowed in MongoDB Atlas Network Access.
- The database username or password is incorrect.
- The database user does not have read/write permissions.
- The connection string was copied incorrectly.

### The page loads but no puzzle appears

Add at least one puzzle with `POST /api/puzzles`. The game needs stored puzzles before `New Game` can load a random board.

## Notes

- Do not commit `.env`.
- No frontend build step is required.
- Empty Sudoku cells are stored as `0`.
