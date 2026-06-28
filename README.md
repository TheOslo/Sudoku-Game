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
- Admin login for adding one puzzle or many puzzles
- Basic production middleware: Helmet, CORS, JSON body limits, and rate limiting

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | HTML, CSS, vanilla JavaScript |
| Backend | Node.js, Express |
| Database | MongoDB Atlas, Mongoose |
| Auth | JSON Web Tokens |
| Security middleware | Helmet, CORS, express-rate-limit |
| Config | dotenv |

## Project Structure

```text
Sudoku-Game/
|-- app.js                         # Express server, middleware, and route mounting
|-- package.json                   # Node dependencies
|-- package-lock.json
|-- .env                           # Local environment variables, not committed
|-- controllers/
|   |-- adminController.js         # Admin login and JWT issuing
|   `-- puzzleControllers.js       # Puzzle API handlers
|-- middleware/
|   |-- admin-auth.js              # Bearer token admin protection
|   |-- error-handler.js
|   `-- not-found.js
|-- models/
|   `-- puzzles.js                 # Mongoose puzzle schema and board validation
|-- routes/
|   `-- puzzleRoutes.js            # Puzzle and admin auth routes
`-- public/
    |-- index.html                 # Game UI
    |-- admin.html                 # Admin puzzle upload UI
    |-- admin.js                   # Admin login/upload browser logic
    |-- style.css                  # Styling and themes
    `-- logic.js                   # Game logic, solver, and API calls
```

## Getting Started

### Prerequisites

- Node.js 20.19.0 or newer
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
FRONTEND_URL=http://localhost:5000
ADMIN_USER=your_admin_username
ADMIN_PASS=your_strong_admin_password
JWT_SECRET=your_long_random_jwt_secret
PORT=5000
```

`PORT` is optional. If it is not set, the server uses `5000`.

Use strong values for `ADMIN_PASS` and `JWT_SECRET`. Do not commit `.env`; it is already ignored by `.gitignore`.

If you use MongoDB Atlas, make sure your current IP address is allowed in Atlas Network Access.

### Run the App

```bash
npm start
```

When the backend connects successfully, the terminal should show:

```text
Server listening on port 5000...
```

Open the game:

```text
http://localhost:5000
```

Open the admin page:

```text
http://localhost:5000/admin.html
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

You can add puzzles through `http://localhost:5000/admin.html`, or through the API.

### Login

```bash
curl -X POST http://localhost:5000/api/puzzles/login \
  -H "Content-Type: application/json" \
  -d '{"username":"your_admin_username","password":"your_strong_admin_password"}'
```

Success response:

```json
{
  "success": true,
  "token": "jwt_token_here"
}
```

Use the returned token as a Bearer token for protected admin routes.

### Add One Puzzle

```bash
curl -X POST http://localhost:5000/api/puzzles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer jwt_token_here" \
  -d '{"board":[[5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],[8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],[0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9]]}'
```

PowerShell:

```powershell
$login = Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:5000/api/puzzles/login `
  -ContentType "application/json" `
  -Body '{"username":"your_admin_username","password":"your_strong_admin_password"}'

Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:5000/api/puzzles `
  -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer $($login.token)" } `
  -Body '{"board":[[5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],[8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],[0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9]]}'
```

### Add Multiple Puzzles

```bash
curl -X POST http://localhost:5000/api/puzzles/bulk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer jwt_token_here" \
  -d '{"puzzles":[{"board":[[5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],[8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],[0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9]]}]}'
```

Bulk uploads accept up to 100 puzzles per request.

## API Endpoints

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/puzzles/random` | Returns one random puzzle board |
| `POST` | `/api/puzzles/login` | Logs in the admin and returns a one-hour JWT |
| `POST` | `/api/puzzles` | Saves one puzzle, requires `Authorization: Bearer <token>` |
| `POST` | `/api/puzzles/bulk` | Saves multiple puzzles, requires `Authorization: Bearer <token>` |

### GET `/api/puzzles/random`

Success response:

```json
{
  "_id": "database_id",
  "board": [[5, 3, 0, 0, 7, 0, 0, 0, 0]],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

If no puzzles exist:

```json
{
  "msg": "No puzzles found in the database."
}
```

### POST `/api/puzzles/login`

Request body:

```json
{
  "username": "your_admin_username",
  "password": "your_strong_admin_password"
}
```

### POST `/api/puzzles`

Required header:

```text
Authorization: Bearer jwt_token_here
```

Request body:

```json
{
  "board": [[5, 3, 0, 0, 7, 0, 0, 0, 0]]
}
```

### POST `/api/puzzles/bulk`

Required header:

```text
Authorization: Bearer jwt_token_here
```

Request body:

```json
{
  "puzzles": [
    {
      "board": [[5, 3, 0, 0, 7, 0, 0, 0, 0]]
    }
  ]
}
```

## Deploy to Vercel

The project can run on Vercel as an Express-backed Node app.

Set these environment variables in Vercel Project Settings:

```text
MONGODB_URI
FRONTEND_URL=https://your-vercel-domain.vercel.app
ADMIN_USER
ADMIN_PASS
JWT_SECRET
NODE_ENV=production
```

After changing environment variables, redeploy the project so Vercel applies the new values.

Before treating the deployment as production-ready, review the security notes below.

## Security Notes

- Keep Helmet enabled. If Content Security Policy blocks scripts, prefer moving inline JavaScript into external `.js` files instead of disabling CSP.
- `admin.js` is already an external script. CSP problems are more likely caused by inline `onclick` handlers or inline `<style>` blocks.
- Avoid `script-src 'unsafe-inline'` in production. If you need a temporary compromise, allowing inline styles is less risky than allowing inline scripts.
- The current admin token is stored in `localStorage`, which is convenient but can be stolen by XSS. A more secure production design would use an `HttpOnly`, `Secure`, `SameSite` cookie.
- Add a stricter rate limit to `/api/puzzles/login` before a public production launch.
- Return generic 500 errors in production so internal database or validation details are not exposed.
- Do not commit `.env` or real credentials.

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
npm start
```

The app serves the frontend from `public/`, so `public/index.html` must exist.

### `MONGODB_URI` is undefined

Check that `.env` is in the project root and the variable name is spelled exactly:

```env
MONGODB_URI=your_mongodb_connection_string
```

### Admin login errors

If `POST /api/puzzles/login` returns `401`, check `ADMIN_USER` and `ADMIN_PASS`.

If protected admin routes return `401`, log in again and send:

```text
Authorization: Bearer jwt_token_here
```

If token creation or verification fails, check that `JWT_SECRET` is set locally or in Vercel Environment Variables.

### MongoDB connection fails

Check these common causes:

- Your current IP is not allowed in MongoDB Atlas Network Access.
- The database username or password is incorrect.
- The database user does not have read/write permissions.
- The connection string was copied incorrectly.

### The page loads but no puzzle appears

Add at least one puzzle with the admin page or `POST /api/puzzles`. The game needs stored puzzles before `New Game` can load a random board.

## Notes

- No frontend build step is required.
- Empty Sudoku cells are stored as `0`.
- `.env` is ignored by git, but deployed environments still need their variables set in the hosting provider.
