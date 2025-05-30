class TicTacToeGame {
    constructor() {
        this.board = Array(9).fill('');
        this.playerSymbol = '';
        this.aiSymbol = '';
        this.currentPlayer = '';
        this.gameActive = false;
        this.scores = {
            player: 0,
            draws: 0,
            ai: 0
        };
        
        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Lignes
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colonnes
            [0, 4, 8], [2, 4, 6] // Diagonales
        ];
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.setupEventListeners();
        this.updateScoreDisplay();
    }
    
    setupEventListeners() {
        // Choix du symbole
        document.querySelectorAll('.symbol-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectSymbol(e.currentTarget.dataset.symbol);
            });
        });
        
        // Clics sur le plateau
        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', (e) => {
                this.handleCellClick(e.currentTarget);
            });
        });
        
        // Boutons de contrôle
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.resetBoard();
        });
        
        document.getElementById('change-symbol-btn').addEventListener('click', () => {
            this.showSetupScreen();
        });
    }
    
    selectSymbol(symbol) {
        this.playerSymbol = symbol;
        this.aiSymbol = symbol === 'X' ? 'O' : 'X';
        this.currentPlayer = 'X'; // X commence toujours
        
        document.getElementById('player-symbol').textContent = this.playerSymbol;
        document.getElementById('ai-symbol').textContent = this.aiSymbol;
        
        this.hideSetupScreen();
        this.showGameScreen();
        this.resetBoard();
    }
    
    hideSetupScreen() {
        document.getElementById('game-setup').classList.add('hidden');
    }
    
    showSetupScreen() {
        document.getElementById('game-setup').classList.remove('hidden');
        document.getElementById('game-area').classList.add('hidden');
    }
    
    showGameScreen() {
        document.getElementById('game-area').classList.remove('hidden');
    }
    
    handleCellClick(cell) {
        const index = parseInt(cell.dataset.index);
        
        if (!this.gameActive || this.board[index] !== '' || this.currentPlayer !== this.playerSymbol) {
            return;
        }
        
        this.makeMove(index, this.playerSymbol);
        
        if (this.gameActive && this.currentPlayer === this.aiSymbol) {
            this.aiMove();
        }
    }
    
    makeMove(index, symbol) {
        this.board[index] = symbol;
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.textContent = symbol === 'X' ? '✕' : '○';
        cell.classList.add('taken', symbol);
        
        if (this.checkWin(symbol)) {
            this.endGame(symbol);
        } else if (this.isBoardFull()) {
            this.endGame('draw');
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updateGameStatus();
        }
    }
    
    async aiMove() {
        this.showAiThinking();
        
        // Délai pour montrer que l'IA "réfléchit"
        await this.delay(1000 + Math.random() * 2000);
        
        const bestMove = this.getBestMove();
        this.hideAiThinking();
        
        if (bestMove !== -1) {
            this.makeMove(bestMove, this.aiSymbol);
        }
    }
    
    getBestMove() {
        // Algorithme minimax avec évaluation des probabilités
        let bestScore = -Infinity;
        let bestMove = -1;
        
        // Analyser chaque position libre
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                // Tester ce mouvement
                this.board[i] = this.aiSymbol;
                let score = this.minimax(this.board, 0, false);
                this.board[i] = '';
                
                // Ajouter une petite randomisation pour éviter la prévisibilité
                score += Math.random() * 0.1;
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        
        return bestMove;
    }
    
    minimax(board, depth, isMaximizing) {
        // Vérifier les conditions de fin
        if (this.checkWin(this.aiSymbol)) return 10 - depth;
        if (this.checkWin(this.playerSymbol)) return depth - 10;
        if (this.isBoardFull()) return 0;
        
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = this.aiSymbol;
                    let score = this.minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = this.playerSymbol;
                    let score = this.minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }
    
    checkWin(symbol) {
        return this.winningCombinations.some(combination => {
            return combination.every(index => this.board[index] === symbol);
        });
    }
    
    isBoardFull() {
        return this.board.every(cell => cell !== '');
    }
    
    endGame(winner) {
        this.gameActive = false;
        
        if (winner === 'draw') {
            this.scores.draws++;
            document.getElementById('game-status').textContent = 'Match nul !';
        } else if (winner === this.playerSymbol) {
            this.scores.player++;
            document.getElementById('game-status').textContent = 'Vous avez gagné ! 🎉';
            this.highlightWinningCells(winner);
        } else {
            this.scores.ai++;
            document.getElementById('game-status').textContent = 'L\'IA a gagné ! 🤖';
            this.highlightWinningCells(winner);
        }
        
        this.updateScoreDisplay();
    }
    
    highlightWinningCells(winner) {
        const winningCombination = this.winningCombinations.find(combination => {
            return combination.every(index => this.board[index] === winner);
        });
        
        if (winningCombination) {
            winningCombination.forEach(index => {
                document.querySelector(`[data-index="${index}"]`).classList.add('winning');
            });
        }
    }
    
    resetBoard() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        // Nettoyer le plateau
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
        
        this.updateGameStatus();
        
        // Si l'IA commence (X), faire son mouvement
        if (this.currentPlayer === this.aiSymbol) {
            setTimeout(() => this.aiMove(), 500);
        }
    }
    
    updateGameStatus() {
        if (this.gameActive) {
            if (this.currentPlayer === this.playerSymbol) {
                document.getElementById('game-status').textContent = 'À votre tour !';
            } else {
                document.getElementById('game-status').textContent = 'Tour de l\'IA...';
            }
        }
    }
    
    showAiThinking() {
        document.getElementById('ai-thinking').classList.remove('hidden');
        document.getElementById('game-status').textContent = 'L\'IA analyse les probabilités...';
    }
    
    hideAiThinking() {
        document.getElementById('ai-thinking').classList.add('hidden');
    }
    
    updateScoreDisplay() {
        document.getElementById('player-wins').textContent = this.scores.player;
        document.getElementById('draws').textContent = this.scores.draws;
        document.getElementById('ai-wins').textContent = this.scores.ai;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialiser le jeu quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToeGame();
});