/**
 * winningCombinations
 * Contains all winning combinations for the Tic Tac Toe board (1-indexed).
 */
export const winningCombinations: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9], // rows
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9], // columns
  [1, 5, 9],
  [3, 5, 7], // diagonals
];
