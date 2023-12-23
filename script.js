// Event listener for when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Variable to store the user's chosen player (X or O)
    let userPlayer;
    // Loop until the user enters a valid player (X or O)
    while (true) {
        let input = prompt("Do you want to be X or O?");
        // If the user's input is a valid player, store it and break the loop
        if (["x", "o", "X", "O"].includes(input)) {
            userPlayer = input.toUpperCase();
            break;
        } else {
            // If the user's input is not a valid player, alert them and continue the loop
            alert("Invalid input. Please enter either 'X' or 'O'.");
        }
    }
    // Determine the computer's player based on the user's player
    let computerPlayer = userPlayer === "X" ? "O" : "X";
    // Set the current player to the user's player
    let currentPlayer = userPlayer;
    // Get all the squares from the DOM
    const squares = document.querySelectorAll(".square");
    // Get the result display from the DOM
    const resultDisplay = document.getElementById("result");
    // Get the new game button from the DOM
    const newGameButton = document.getElementById("newGameButton");
    // Get the countdown display from the DOM
    let countdownDisplay = document.getElementById("countdown"); 
    // Array to store all the intervals
    let intervals = [];
    // Object to store the score
    let score = { wins: 0, losses: 0, draws: 0 };
    
    // Array to represent the game board
    let board = ["", "", "", "", "", "", "", "", ""];
    // Boolean to represent whether the game is active
    let gameActive = true;
    // Variable to store the timer
    let timer;
    // Boolean to represent whether the timer has expired
    let timerExpired = false;

    // Array of winning conditions
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // Add a click event listener to each square
    squares.forEach((square, index) => {
        square.addEventListener("click", () => {
            makeMove(square, index);
        });
    });

    // Add a click event listener to the new game button
    newGameButton.addEventListener("click", resetGame);

    // Function to start the timer
    function startTimer() {
        let timeLeft = 30; // 30 seconds
        countdownDisplay.textContent = timeLeft; 
        timerExpired = false; 
        // Start the timer
        timer = setInterval(function() {
            timeLeft--;
            countdownDisplay.textContent = timeLeft; 
            // If the timer expires, end the game and announce the winner
            if (timeLeft <= 0) {
                timerExpired = true;
                gameActive = false;
                announce(currentPlayer === "X" ? "O wins (timeout)" : "X wins (timeout)");
                updateScore(currentPlayer === userPlayer ? "losses" : "wins");
                clearInterval(timer); // Clear the interval
            }
        }, 1000); 
        intervals.push(timer); // Add the interval to the array
    }
    
    // Function to check if there is a winner
    function checkWin() {
        let roundWon = false;
        // Loop through each winning condition
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = board[winCondition[0]];
            let b = board[winCondition[1]];
            let c = board[winCondition[2]];
            // If any square in the winning condition is empty, continue to the next condition
            if (a === "" || b === "" || c === "") {
                continue;
            }
            // If all squares in the winning condition are the same, the round is won
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }
    
        // If the round is won, announce the winner and update the score
        if (roundWon) {
            announce(currentPlayer + " wins!");
            updateScore(currentPlayer === userPlayer ? "wins" : "losses");
            gameActive = false;
            intervals.forEach(clearInterval); // Clear all intervals
            intervals = []; // Reset the array
            countdownDisplay.textContent = 30; // Set the timer display to 30
            return;
        }
    
        // If the board is full and no one has won, it's a draw
        if (!board.includes("")) {
            announce("Draw!");
            updateScore("draws");
            gameActive = false;
            intervals.forEach(clearInterval); // Clear all intervals
            intervals = []; // Reset the array
            countdownDisplay.textContent = 30; // Set the timer display to 30
            return;
        }
    }
    // Function to announce a message
    function announce(message) {
        resultDisplay.textContent = message;
    }

    

    // Function to reset the game
    function resetGame() {
        currentPlayer = userPlayer;
        board = ["", "", "", "", "", "", "", "", ""];
        gameActive = true;
        resultDisplay.textContent = "";
        // Reset each square
        squares.forEach(square => {
            square.textContent = "";
            square.classList.remove("X", "O"); 
        });
        clearTimeout(timer);
        timerExpired = false;
        countdownDisplay.textContent = 30;
    }

    // Function to make a move
    function makeMove(square, index) {
        // If the game is active, the square is empty, and the timer has not expired, make a move
        if (gameActive && square.textContent === "" && !timerExpired) {
            square.classList.remove("X", "O"); 
            square.textContent = currentPlayer;
            board[index] = currentPlayer;
            square.classList.add(currentPlayer.toString());
            // If no one has won, switch the current player and start the timer
            if (!checkWin()) {
                currentPlayer = currentPlayer === "X" ? "O" : "X"; 
                clearTimeout(timer);
                startTimer(); 
                // If the game is active and it's the computer's turn, make a move
                if (gameActive && currentPlayer === computerPlayer) {
                    computerMove();
                }
            }
        }
    }

    // Function for the computer to make a move
    function computerMove() {
        // Get all the empty squares
        let emptySquares = board.reduce((acc, val, idx) => val === "" ? acc.concat(idx) : acc, []);
        // Choose a random empty square
        let randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)];
        let square = squares[randomIndex];
        // Make a move on the chosen square
        makeMove(square, randomIndex);
    }

    // Function to update the score
    function updateScore(result) {
        score[result]++;
        let scoreDisplay = document.getElementById("score");
        // Update the score display
        scoreDisplay.textContent = `Wins: ${score.wins}, Losses: ${score.losses}, Draws: ${score.draws}`;
    }

   
});
