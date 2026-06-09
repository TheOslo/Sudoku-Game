let initialBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
let currentBoard = Array.from({ length: 9 }, () => Array(9).fill(0));

currentBoard = JSON.parse(JSON.stringify(initialBoard));
let selectedCell = null;
let timerInterval = null;
let totalSeconds = 0;

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
    const targetRow = Math.floor(index / 9);
    const targetCol = index % 9;
    const targetBoxRow = targetRow - (targetRow % 3);
    const targetBoxCol = targetCol - (targetCol % 3);

    const cells = document.querySelectorAll('.sudoku-cell');
    cells.forEach(cell => {
        const i = parseInt(cell.getAttribute('data-index'));
        const r = Math.floor(i / 9);
        const c = i % 9;

        if (r === targetRow || c === targetCol || (r >= targetBoxRow && r < targetBoxRow + 3 && c >= targetBoxCol && c < targetBoxCol + 3)) {
            if (cell !== targetCell) {
                cell.classList.add('highlight-related');
            }
        }
    });
}

function isSafe(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) {
            return false;
        }
    }

    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }
    return true;
}

function handleInput(num) {
    if (!selectedCell) return;

    const index = parseInt(selectedCell.getAttribute('data-index'));
    const row = Math.floor(index / 9);
    const col = index % 9;

    if (num === 0) {
        selectedCell.textContent = '';
        selectedCell.style.color = '';
        currentBoard[row][col] = 0;
        return;
    }

    selectedCell.textContent = num;

    if (isSafe(currentBoard, row, col, num)) {
        selectedCell.style.color = 'var(--primary)';
        currentBoard[row][col] = num;
    } else {
        selectedCell.style.color = 'var(--error)';
        currentBoard[row][col] = num; 
    }
}

function solve(board) {
    let row = -1;
    let col = -1;
    let isEmpty = false;

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) {
                row = i;
                col = j;
                isEmpty = true;
                break;
            }
        }
        if (isEmpty) break;
    }

    if (!isEmpty) return true;

    for (let num = 1; num <= 9; num++) {
        if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            if (solve(board)) return true;
            board[row][col] = 0;
        }
    }
    return false;
}

function solveSudoku() {
    let boardToSolve = JSON.parse(JSON.stringify(initialBoard));

    if (solve(boardToSolve)) {
        currentBoard = boardToSolve;
        clearInterval(timerInterval); 
        
        const cells = document.querySelectorAll('.sudoku-cell');
        
        cells.forEach(c => c.classList.remove('active', 'highlight-related'));

        cells.forEach(cell => {
            const index = parseInt(cell.getAttribute('data-index'));
            const r = Math.floor(index / 9);
            const c = index % 9;

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
    currentBoard = JSON.parse(JSON.stringify(initialBoard));
    startTimer();
}

function newGame() {
    clearBoard();
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
    initGame();
    setupThemeToggle();
    startTimer();
});