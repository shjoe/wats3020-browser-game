let game;

class Player {
    constructor(token) {
        this.token = token;
    }
}

class TicTacToe {
    constructor() {
        // Properties initialized to track game progress.
        this.player1 = new Player('times');
        this.player2 = new Player('circle');
        this.player2 = null;
        this.currentPlayer = null;
        this.gameStatus = null;
        this.winner = null;
        this.moveCount = 0;
        // Data items that constitute the state of the game.
        this.startPrompt = document.querySelector('#start-prompt');
        this.movePrompt = document.querySelector('#move-prompt');
        this.currentPlayerToken = document.querySelector('#player-token');
        this.gameboard = document.querySelector('#gameboard');
        this.winScreen = document.querySelector('#win-screen');
        this.winnerToken = document.querySelector('#winner-token');
        this.drawScreen = document.querySelector('#draw-screen');
        // Game state/initial board layout.
        this.gameState = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
        // All possible winning combinations.
        this.winStates = [
            [
                [0, 0],
                [0, 1],
                [0, 2]
            ],
            [
                [1, 0],
                [1, 1],
                [1, 2]
            ],
            [
                [2, 0],
                [2, 1],
                [2, 2]
            ],
            [
                [0, 0],
                [1, 0],
                [2, 0]
            ],
            [
                [0, 1],
                [1, 1],
                [2, 1]
            ],
            [
                [0, 2],
                [1, 2],
                [2, 2]
            ],
            [
                [0, 0],
                [1, 1],
                [2, 2]
            ],
            [
                [0, 2],
                [1, 1],
                [2, 0]
            ]
        ];
    }
    checkForWinner() {
        for (let condition of this.winStates) {
            let winningCondition = true;
            for (let position of condition) {
                if (this.gameState[position[0]][position[1]] != this.currentPlayer.token) {
                    winningCondition = false;
                }
            }
            if (winningCondition) {
                console.log('We have a winner!');
                console.log(`Condition is: ${condition}`);
                this.gameStatus = 'won';
                this.winner = this.currentPlayer;
                let winEvent = new Event('win');
                document.dispatchEvent(winEvent);
                return true; // Return a value to stop processing the additional move count check.
            }
        }
        this.moveCount++;
        console.log(`Reviewed move ${this.moveCount}.`)
        if (this.moveCount >= 9) {
            console.log(`This game is a draw at ${this.moveCount} moves.`);
            this.gameStatus = 'draw';
            let drawEvent = new Event('draw');
            document.dispatchEvent(drawEvent);
        }
    }
    recordMove(event) {
        // Records click and claims spot for currentPlayer if free.
        let tile_x = event.target.dataset.x;
        let tile_y = event.target.dataset.y;
        if (!this.gameState[tile_x][tile_y]) {
            this.gameState[tile_x][tile_y] = this.currentPlayer.token;
            event.target.setAttribute('class', `tile played fas fa-${this.currentPlayer.token}`)
        } else {
            return false;
        }
    }
    switchPlayer() {
        // Sets the class on the `this.currentPlayerToken` property to show the proper class.
        if (this.currentPlayer === this.player1) {
            this.currentPlayer = this.player2;
        } else {
            this.currentPlayer = this.player1;
        }
        this.currentPlayerToken.setAttribute('class', `fas fa-${this.currentPlayerToken}`);
    }
    setUpTileListeners() {
        // Event listeners added to all tiles when a new game is started.
        let tileElements = document.querySelectorAll('.tile');
        for (const tile of tileElements) {
            tile.addEventListener('click', handleMove);
        }
    }
    showWinScreen() {
        // This method displays the end game screen for a Win.
        this.winScreen.setAttribute('class', 'show');
        this.winnerToken.setAttribute('class', `fas fa-${this.currentPlayer.token}`);
    }
    showDrawScreen() {
        // This method displays the end game screen for a Draw.
        this.drawScreen.setAttribute('class', 'show');
    }
    setUpBoard() {
        this.gameboard.innerHTML = '';
        // This will loop 3 times to draw the gameboard.
        for (let i = 0; i < 3; i++) {
            let newRow = document.createElement('div');
            newRow.setAttribute('class', 'row');
            for (let j = 0; j < 3; j++) {
                let newCol = document.createElement('div');
                newCol.setAttribute('class', 'col-xs-3');

                let newTile = document.createElement('span');
                newTile.setAttribute('class', 'tile fas fa-question-sign');
                newTile.setAttribute('data-x', i);
                newTile.setAttribute('data-y', j);

                newCol.appendChild(newTile);
                newRow.appendChild(newCol);
            }
            this.gameboard.appendChild(newRow);
        }
        this.setUpTileListeners();
    }
    initializeMovePrompt() {
        this.startPrompt.setAttribute('class', 'hidden');
        this.movePrompt.setAttribute('class', '');
        this.currentPlayer = this.player1;
        this.currentPlayerToken.setAttribute('class', `fas fa-${this.currentPlayer.token}`);
    }
    start() {
        console.log('start game');
        this.setUpBoard();
        console.log('set up board');
        this.initializeMovePrompt();
        console.log('init move prompt');
    }
} // End of the Tic Tac Toe Class definition.
// This listener will execute an anonymous function to handle the "DOMContentLoaded" event.
document.addEventListener('DOMContentLoaded', (event) => {
    let startButton = document.querySelector('#start-button');
    startButton.addEventListener('click', (event) => {
        game = new TicTacToe();
        game.start();
    });
});
// "Win" event listener. 
document.addEventListener('win', (event) => {
    console.log('win event fired');
    game.showWinScreen();
})
// "Draw" event listener.
document.addEventListener('draw', (event) => {
    console.log('draw event fired');
    game.showDrawScreen();
})
// External function for event listeners provided for you.
function handleMove(event) {
    // Record the move for the current player.
    game.recordMove(event);

    // Check to see if the last move was a winning move.
    game.checkForWinner();

    // Rotate players.
    game.switchPlayer();
}