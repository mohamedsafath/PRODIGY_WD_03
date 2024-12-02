const cells = document.querySelectorAll("[data-cell]");
const board = document.getElementById("game-board");
const restartButton = document.getElementById("restart-button");
const twoPlayerButton = document.getElementById("two-player");
const aiModeButton = document.getElementById("ai-mode");
let currentPlayer = "X";
let gameActive = true;
let gameMode = ""; // Will be set to "two-player" or "ai" depending on the selection

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

twoPlayerButton.addEventListener("click", () => {
  gameMode = "two-player";
  startGame();
});

aiModeButton.addEventListener("click", () => {
  gameMode = "ai";
  startGame();
});

function startGame() {
  gameActive = true;
  currentPlayer = "X"; // Player X starts
  board.style.display = "grid"; // Show the game board
  restartButton.style.display = "block"; // Show the restart button
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("taken");
    cell.addEventListener("click", handleCellClick);
  });
}

function handleCellClick(e) {
  const cell = e.target;

  if (cell.classList.contains("taken") || !gameActive || (currentPlayer === "O" && gameMode === "ai")) return;

  cell.textContent = currentPlayer;
  cell.classList.add("taken");

  if (checkWin(currentPlayer)) {
    alert(`${currentPlayer} wins!`);
    gameActive = false;
    return;
  }

  if (isDraw()) {
    alert("It's a draw!");
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (currentPlayer === "O" && gameMode === "ai") {
    aiMove();
  }
}

function aiMove() {
  const bestMove = minimax(cells, "O");
  cells[bestMove.index].textContent = "O";
  cells[bestMove.index].classList.add("taken");

  if (checkWin("O")) {
    alert("AI wins!");
    gameActive = false;
    return;
  }

  if (isDraw()) {
    alert("It's a draw!");
    gameActive = false;
    return;
  }

  currentPlayer = "X";
}

function minimax(board, player) {
  const availableCells = [...cells].filter(cell => !cell.classList.contains("taken"));
  
  if (checkWin("X")) return { score: -10 };
  if (checkWin("O")) return { score: 10 };
  if (isDraw()) return { score: 0 };
  
  const moves = [];
  availableCells.forEach(cell => {
    const index = [...cells].indexOf(cell);
    const move = { index };
    board[index].textContent = player;
    cell.classList.add("taken");

    if (player === "O") {
      const result = minimax(board, "X");
      move.score = result.score;
    } else {
      const result = minimax(board, "O");
      move.score = result.score;
    }

    board[index].textContent = "";
    cell.classList.remove("taken");
    moves.push(move);
  });

  if (player === "O") {
    return moves.reduce((bestMove, move) => move.score > bestMove.score ? move : bestMove);
  } else {
    return moves.reduce((bestMove, move) => move.score < bestMove.score ? move : bestMove);
  }
}

function checkWin(player) {
  return winningCombinations.some(combination =>
    combination.every(index => cells[index].textContent === player)
  );
}

function isDraw() {
  return [...cells].every(cell => cell.classList.contains("taken"));
}

function restartGame() {
  gameActive = true;
  currentPlayer = "X";
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("taken");
  });
}

restartButton.addEventListener("click", restartGame);
