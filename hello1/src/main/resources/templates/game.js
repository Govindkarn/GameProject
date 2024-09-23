// Selecting DOM elements
const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.status');
const restartBtn = document.getElementById('restartBtn');
const logoutBtn = document.getElementById('logoutBtn');
const playerXScoreElement = document.getElementById('playerXScore');
const playerOScoreElement = document.getElementById('playerOScore');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// Game state variables
let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let playerXScore = 0;
let playerOScore = 0;
let isAIActive = false;

// Win conditions
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Initialize the game
function initializeGame() {
    cells.forEach(cell => cell.addEventListener('click', cellClicked));
    restartBtn.addEventListener('click', restartGame);
    logoutBtn.addEventListener('click', logout);
    document.getElementById('aiMode').addEventListener('click', () => startGame(true));
    document.getElementById('multiplayerMode').addEventListener('click', () => startGame(false));
    statusText.textContent = "Player X's turn";
    running = true;
    clearHistoryBtn.addEventListener('click', clearHistory);
}

// Start a new game with the selected mode (AI or multiplayer)
function startGame(aiMode) {
    isAIActive = aiMode;
    restartGame();
    statusText.textContent = isAIActive ? "AI Mode: Player X's turn" : "Multiplayer Mode: Player X's turn";
}

// Handle cell click events
function cellClicked() {
    const cellIndex = this.getAttribute('data-index');

    if (options[cellIndex] !== "" || !running) return;

    updateCell(this, cellIndex);
    if (!checkWinner()) {
        if (isAIActive && currentPlayer === "X") {
            setTimeout(() => {
                currentPlayer = "O";
                const bestMove = getBestMove();
                updateCell(cells[bestMove], bestMove);
                if (!checkWinner()) {
                    currentPlayer = "X";
                    statusText.textContent = `${currentPlayer}'s turn`;
                }
            }, 500);
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            statusText.textContent = `${currentPlayer}'s turn`;
        }
    }
}

// Update the cell with the current player's mark
function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer); // Add class for animations
}

// Check for a winner or a draw
function checkWinner() {
    let roundWon = false;

    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if (cellA === "" || cellB === "" || cellC === "") {
            continue;
        }
        if (cellA === cellB && cellB === cellC) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `${currentPlayer} wins!`;
        running = false;
        updateScore();
        saveGameHistory("Player X", "Player O (AI)", currentPlayer, options.join(""), isAIActive ? 'ai' : 'multiplayer');
        return true;
    } else if (isBoardFull()) {
        statusText.textContent = `Draw!`;
        running = false;
        saveGameHistory("Player X", "Player O (AI)", "Draw", options.join(""), isAIActive ? 'ai' : 'multiplayer');
        return true;
    }

    return false;
}

// Update the scoreboard
function updateScore() {
    if (currentPlayer === "X") {
        playerXScore++;
        playerXScoreElement.textContent = `Player X: ${playerXScore}`;
    } else {
        playerOScore++;
        playerOScoreElement.textContent = `Player O (AI): ${playerOScore}`;
    }
}

// Check if the board is full
function isBoardFull() {
    return options.every(cell => cell !== "");
}

// Restart the game
function restartGame() {
    options = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("X", "O");
    });
    statusText.textContent = `Player X's turn`;
    currentPlayer = "X";
    running = true;
}

// Handle user logout
function logout() {
    window.location.href = "index.html"; // Redirect to login page
}

// AI: Minimax Algorithm to determine the best move
function getBestMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < options.length; i++) {
        if (options[i] === "") {
            options[i] = "O";
            let score = minimax(options, 0, false);
            options[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

const scores = {
    X: -1,
    O: 1,
    tie: 0
};

// Minimax algorithm implementation
function minimax(board, depth, isMaximizing) {
    let result = checkGameState();
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Check the game state for a win, loss, or tie
function checkGameState() {
    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if (cellA === cellB && cellB === cellC && cellA !== "") {
            return cellA;
        }
    }

    if (isBoardFull()) {
        return "tie";
    }
    return null;
}

// Function to save game history based on the mode (Multiplayer or AI)
function saveGameHistory(player1, player2, winner, moves, mode) {
    let key = mode === 'multiplayer' ? 'multiplayerHistory' : 'aiHistory';
    let history = JSON.parse(localStorage.getItem(key)) || [];
    let gameRecord = {
        player1: player1,
        player2: player2,
        winner: winner,
        moves: moves,
        date: new Date().toLocaleString(),
    };
    history.push(gameRecord);
    localStorage.setItem(key, JSON.stringify(history));
}

// Function to display game history for both Multiplayer and AI Mode
function displayGameHistory() {
    let multiplayerHistory = JSON.parse(localStorage.getItem('multiplayerHistory')) || [];
    let aiHistory = JSON.parse(localStorage.getItem('aiHistory')) || [];

    let multiplayerList = document.getElementById('multiplayerHistoryList');
    let aiHistoryList = document.getElementById('aiHistoryList');

    if (multiplayerList) {
        multiplayerList.innerHTML = '';
        if (multiplayerHistory.length === 0) {
            multiplayerList.innerHTML = '<li>No multiplayer game history found.</li>';
        } else {
            multiplayerHistory.forEach((game, index) => {
                let listItem = document.createElement('li');
                listItem.innerHTML = `
                    <strong>Game ${index + 1}</strong>: ${game.player1} vs ${game.player2}<br>
                    <strong>Winner</strong>: ${game.winner}<br>
                    <strong>Moves</strong>: ${game.moves}<br>
                    <strong>Date</strong>: ${game.date}
                `;
                multiplayerList.appendChild(listItem);
            });
        }
    }

    if (aiHistoryList) {
        aiHistoryList.innerHTML = '';
        if (aiHistory.length === 0) {
            aiHistoryList.innerHTML = '<li>No AI mode game history found.</li>';
        } else {
            aiHistory.forEach((game, index) => {
                let listItem = document.createElement('li');
                listItem.innerHTML = `
                    <strong>Game ${index + 1}</strong>: ${game.player1} vs ${game.player2}<br>
                    <strong>Winner</strong>: ${game.winner}<br>
                    <strong>Moves</strong>: ${game.moves}<br>
                    <strong>Date</strong>: ${game.date}
                `;
                aiHistoryList.appendChild(listItem);
            });
        }
    }
}

// Function to clear history
function clearHistory() {
    localStorage.removeItem('multiplayerHistory');
    localStorage.removeItem('aiHistory');
    displayGameHistory();
}

// Call displayGameHistory when the page loads
window.onload = function() {
    displayGameHistory();
};

initializeGame();
