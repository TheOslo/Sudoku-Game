const mongoose = require('mongoose');

const validateSudokuBoard = (matrix) => {
  if (!Array.isArray(matrix) || matrix.length !== 9) return false;
  
  let i = 0;
  while (i < 9) {
    if (!Array.isArray(matrix[i]) || matrix[i].length !== 9) return false;
    let j = 0;
    while (j < 9) {
      if (!Number.isInteger(matrix[i][j]) || matrix[i][j] < 0 || matrix[i][j] > 9) return false;
      j++;
    }
    i++;
  }

  let r = 0;
  while (r < 9) {
    let c = 0;
    while (c < 9) {
      let val = matrix[r][c];
      if (val !== 0) {
        let k = 0;
        while (k < 9) {
          if (k !== c && matrix[r][k] === val) return false;
          if (k !== r && matrix[k][c] === val) return false;
          k++;
        }
        
        let startR = r - (r % 3);
        let startC = c - (c % 3);
        let boxR = 0;
        while (boxR < 3) {
          let boxC = 0;
          while (boxC < 3) {
            if ((startR + boxR !== r || startC + boxC !== c) && matrix[startR + boxR][startC + boxC] === val) {
              return false;
            }
            boxC++;
          }
          boxR++;
        }
      }
      c++;
    }
    r++;
  }
  return true;
};

const PuzzleSchema = new mongoose.Schema({
  board: {
    type: [[Number]],
    required: [true, 'Please provide a 9x9 Sudoku board matrix'],
    validate: {
      validator: validateSudokuBoard,
      message: 'Board must be a valid 9x9 matrix containing integers from 0 to 9.'
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Puzzle', PuzzleSchema);