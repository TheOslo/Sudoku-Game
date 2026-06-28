const BOARD_SIZE = 9;
const BOX_SIZE = 3;
const EMPTY_CELL = 0;

let initialBoard = createEmptyBoard();
let currentBoard = createEmptyBoard();

currentBoard = cloneBoard(initialBoard);
let selectedCell = null;
let timerInterval = null;
let totalSeconds = 0;

const API_BASE_URL = window.location.protocol === 'file:' ? 'http://localhost:5000' : '';

function createEmptyBoard() {
    return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(EMPTY_CELL));
}

function cloneBoard(board) {
    return board.map(row => [...row]);
}

function isValidBoard(board) {
    return Array.isArray(board)
        && board.length === BOARD_SIZE
        && board.every(row =>
            Array.isArray(row)
            && row.length === BOARD_SIZE
            && row.every(value => Number.isInteger(value) && value >= 0 && value <= 9)
        );
}

function initGame() {
    const cells = document.querySelectorAll('.sudoku-cell');

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (cell.classList.contains('preset')) return;

            cells.forEach(c => c.classList.remove('active', 'highlight-related'));

            selectedCell = cell;
            cell.classList.add('active');

            highlightGridIntersections(cell);
        });
    });
}

function readBoardFromDOM() {
    const cells = document.querySelectorAll('.sudoku-cell');

    initialBoard = createEmptyBoard();

    cells.forEach(cell => {
        const index = parseInt(cell.getAttribute('data-index'));
        const row = Math.floor(index / BOARD_SIZE);
        const col = index % BOARD_SIZE;
        const value = parseInt(cell.textContent, 10);

        initialBoard[row][col] = Number.isInteger(value) && value >= 1 && value <= 9 ? value : EMPTY_CELL;
    });

    currentBoard = cloneBoard(initialBoard);
}

function renderBoard(board) {
    if (!isValidBoard(board)) {
        throw new Error('Cannot render an invalid Sudoku board.');
    }

    const cells = document.querySelectorAll('.sudoku-cell');

    cells.forEach(cell => {
        const index = parseInt(cell.getAttribute('data-index'));
        const row = Math.floor(index / BOARD_SIZE);
        const col = index % BOARD_SIZE;
        const value = board[row][col];

        cell.textContent = value || '';
        cell.style.color = '';
        cell.classList.remove('active', 'highlight-related', 'preset');

        if (value) {
            cell.classList.add('preset');
        }
    });

    selectedCell = null;
}

async function loadRandomPuzzle() {
    const response = await fetch(`${API_BASE_URL}/api/puzzles/random`);

    if (!response.ok) {
        throw new Error(`Puzzle request failed with status ${response.status}`);
    }

    const puzzle = await response.json();

    if (!isValidBoard(puzzle.board)) {
        throw new Error('Puzzle response did not contain a valid board.');
    }

    initialBoard = puzzle.board;
    currentBoard = cloneBoard(initialBoard);
    renderBoard(initialBoard);
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    totalSeconds = 0;
    updateTimerUI();

    timerInterval = setInterval(() => {
        totalSeconds++;
        updateTimerUI();
    }, 1000);
}

function updateTimerUI() {
    const timerElement = document.getElementById('timer');
    if (!timerElement) return;

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

    timerElement.textContent = `${formattedMinutes}:${formattedSeconds}`;
}

function highlightGridIntersections(targetCell) {
    const index = parseInt(targetCell.getAttribute('data-index'));
    const targetRow = Math.floor(index / BOARD_SIZE);
    const targetCol = index % BOARD_SIZE;
    const targetBoxRow = targetRow - (targetRow % BOX_SIZE);
    const targetBoxCol = targetCol - (targetCol % BOX_SIZE);

    const cells = document.querySelectorAll('.sudoku-cell');
    cells.forEach(cell => {
        const i = parseInt(cell.getAttribute('data-index'));
        const r = Math.floor(i / BOARD_SIZE);
        const c = i % BOARD_SIZE;

        if (r === targetRow || c === targetCol || (r >= targetBoxRow && r < targetBoxRow + BOX_SIZE && c >= targetBoxCol && c < targetBoxCol + BOX_SIZE)) {
            if (cell !== targetCell) {
                cell.classList.add('highlight-related');
            }
        }
    });
}

function isSafe(board, row, col, num) {
    for (let i = 0; i < BOARD_SIZE; i++) {
        if ((i !== col && board[row][i] === num) || (i !== row && board[i][col] === num)) {
            return false;
        }
    }

    const startRow = row - (row % BOX_SIZE);
    const startCol = col - (col % BOX_SIZE);
    for (let i = 0; i < BOX_SIZE; i++) {
        for (let j = 0; j < BOX_SIZE; j++) {
            const currentRow = startRow + i;
            const currentCol = startCol + j;

            if ((currentRow !== row || currentCol !== col) && board[currentRow][currentCol] === num) {
                return false;
            }
        }
    }
    return true;
}

function handleInput(num) {
    if (!selectedCell) return;

    const index = parseInt(selectedCell.getAttribute('data-index'));
    const row = Math.floor(index / BOARD_SIZE);
    const col = index % BOARD_SIZE;

    if (num === EMPTY_CELL) {
        selectedCell.textContent = '';
        selectedCell.style.color = '';
        currentBoard[row][col] = EMPTY_CELL;
        return;
    }

    if (!Number.isInteger(num) || num < 1 || num > 9) return;

    currentBoard[row][col] = num;
    selectedCell.textContent = num;

    if (isSafe(currentBoard, row, col, num)) {
        selectedCell.style.color = 'var(--primary)';
    } else {
        selectedCell.style.color = 'var(--error)';
    }
}

function solve(board) {
    let row = -1;
    let col = -1;
    let isEmpty = false;

    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] === EMPTY_CELL) {
                row = i;
                col = j;
                isEmpty = true;
                break;
            }
        }
        if (isEmpty) break;
    }

    if (!isEmpty) return true;

    for (let num = 1; num <= BOARD_SIZE; num++) {
        if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            if (solve(board)) return true;
            board[row][col] = EMPTY_CELL;
        }
    }
    return false;
}

function hasBoardConflicts(board) {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const value = board[row][col];

            if (value !== EMPTY_CELL && !isSafe(board, row, col, value)) {
                return true;
            }
        }
    }

    return false;
}

function solveSudoku() {
    let boardToSolve = cloneBoard(currentBoard);

    if (hasBoardConflicts(boardToSolve)) return;

    if (solve(boardToSolve)) {
        currentBoard = boardToSolve;
        clearInterval(timerInterval); 
        
        const cells = document.querySelectorAll('.sudoku-cell');
        
        cells.forEach(c => c.classList.remove('active', 'highlight-related'));

        cells.forEach(cell => {
            const index = parseInt(cell.getAttribute('data-index'));
            const r = Math.floor(index / BOARD_SIZE);
            const c = index % BOARD_SIZE;

            cell.textContent = currentBoard[r][c];

            if (!cell.classList.contains('preset')) {
                cell.style.color = 'var(--primary)';
            }
        });
    }
}

function clearBoard() {
    const cells = document.querySelectorAll('.sudoku-cell');
    cells.forEach(cell => {
        if (!cell.classList.contains('preset')) {
            cell.textContent = '';
            cell.style.color = '';
        }
    });
    cells.forEach(c => c.classList.remove('active', 'highlight-related'));
    selectedCell = null;
    currentBoard = cloneBoard(initialBoard);
    startTimer();
}

async function newGame() {
    try {
        await loadRandomPuzzle();
    } catch (error) {
        console.error('Failed to load puzzle from backend:', error);
        clearBoard();
    }
}

function setupThemeToggle() {
    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            
            const icon = themeToggleBtn.querySelector('.material-symbols-outlined');
            if (icon) {
                if (document.body.classList.contains('dark')) {
                    icon.textContent = 'light_mode';
                } else {
                    icon.textContent = 'dark_mode';
                }
            }
        });
    }
}

document.addEventListener('keydown', (event) => {
    if (!selectedCell) return;
    if (event.key >= '1' && event.key <= '9') {
        handleInput(parseInt(event.key));
    } else if (event.key === 'Backspace' || event.key === 'Delete') {
        handleInput(0);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    readBoardFromDOM();
    initGame();
    setupThemeToggle();
    loadRandomPuzzle().catch(error => {
        console.error('Failed to load puzzle from backend:', error);
        startTimer();
    });
});
