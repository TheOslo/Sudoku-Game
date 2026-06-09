# ZenSudoku

A browser-based Sudoku game with a clean, responsive UI and an Express + MongoDB backend for puzzle storage (in progress).

## Features

- **Interactive 9×9 grid** — click cells to select them; related rows, columns, and 3×3 boxes are highlighted
- **Number pad & keyboard input** — use on-screen buttons or keys `1`–`9`; `Backspace` / `Delete` clears a cell
- **Live validation** — correct entries appear in the primary color; conflicts are shown in red
- **Solve** — backtracking solver fills the board from the starting puzzle
- **Timer** — tracks elapsed time while you play
- **Dark / light theme** — toggle from the header
- **Game controls** — New Game, Solve, and Clear

## Tech Stack

| Layer    | Technologies                          |
| -------- | ------------------------------------- |
| Frontend | HTML, CSS, vanilla JavaScript         |
| Backend  | Node.js, Express, Mongoose, MongoDB   |
| Config   | dotenv                                |

## Project Structure

```
Sudoku-Game/
├── index.html    # Game UI
├── style.css     # Styling and themes
├── logic.js      # Sudoku logic, solver, and UI interactions
├── app.js        # Express API server
├── connect.js    # MongoDB connection helper
├── package.json
└── .env          # Environment variables (not committed)
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (for the backend)

### 1. Clone and install

```bash
git clone <https://github.com/TheOslo/Sudoku-Game.git>
cd Sudoku-Game
npm install
```

The backend also uses Express and CORS. If they are not already installed:

```bash
npm install express cors
```

### 2. Environment variables

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
```

Replace the placeholder with your MongoDB Atlas connection string.

### 3. Run the frontend

Open `index.html` in your browser, or serve the folder with a static server:

```bash
npx serve .
```

### 4. Run the backend (optional)

```bash
node app.js
```

The API listens on **http://localhost:5000**.

## API Endpoints

| Method | Route               | Description                          |
| ------ | ------------------- | ------------------------------------ |
| GET    | `/api/puzzles/random` | Fetch a random puzzle (planned)    |
| POST   | `/api/puzzles`        | Save a new puzzle layout (planned) |

Database integration for these routes is still in progress.

## How to Play

1. Click an empty cell to select it.
2. Enter a number with the pad or keyboard.
3. Fill every row, column, and 3×3 box with digits **1–9** without repeating any number.
4. Preset cells (clues) cannot be edited.
5. Use **Solve** to reveal the solution, or **Clear** to reset your entries and restart the timer.

## License

This project is open source. Add a license file if you plan to publish it publicly.
