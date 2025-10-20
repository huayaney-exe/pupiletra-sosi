// Pupiletra Game Logic
// Main game controller for the word search game

class PupiletraGame {
    constructor() {
        this.gridCols = 10;
        this.gridRows = 12;
        this.gridSize = 12; // For legacy compatibility
        this.targetWords = [
            'SCOTIA', 'PERU', 'BANCO', 'CLIENTE', 'INTEGRIDAD', 'TORONTO'
        ];

        this.grid = [];
        this.wordPositions = {}; // Store positions for each word
        this.foundWords = new Set();
        this.foundCells = new Set();
        this.selectedCells = [];
        this.timeRemaining = 90;
        this.isGameActive = false;
        this.timerInterval = null;
        this.hintsUsed = 0;
        this.maxHints = 3;
        this.score = 0;

        this.storageManager = new StorageManager();

        // Fun facts for win/lose scenarios
        this.winFunFacts = [
            '🏦 Scotiabank opera en más de 25 países en las Américas',
            '🌟 Tenemos más de 190 años de experiencia financiera',
            '🌎 Somos el banco internacional de Canadá con presencia global',
            '💼 Ayudamos a más de 25 millones de clientes en todo el mundo',
            '🚀 Fuimos pioneros en banca digital en América Latina',
            '🎯 Nuestro enfoque está en el cliente y la innovación',
            '🏆 Reconocidos por nuestra solidez y confiabilidad financiera',
            '🌱 Comprometidos con la sostenibilidad y responsabilidad social',
            '💳 Ofrecemos soluciones financieras integrales para todos',
            '🤝 Creemos en construir relaciones duraderas con nuestros clientes',
            '🏆 Líderes en servicios bancarios internacionales',
            '🌟 Innovamos constantemente para mejorar tu experiencia'
        ];

        this.loseFunFacts = [
            '📅 Scotiabank fue fundado en 1832 en Halifax, Canadá',
            '🏛️ Comenzamos como el Banco de Nueva Escocia',
            '🌊 Nuestro nombre proviene de Nueva Escocia (Nova Scotia)',
            '📈 Fuimos uno de los primeros bancos en expandirse internacionalmente',
            '💎 Nuestros valores: Enfoque en el cliente, Integridad, Inclusión y Responsabilidad',
            '💡 La innovación ha sido clave en nuestros 190+ años de historia',
            '🤝 Siempre hemos creído en construir relaciones duraderas',
            '🏦 Tenemos presencia en Perú desde hace más de 20 años',
            '🌟 Nuestra visión es ser el socio financiero más confiable de nuestros clientes',
            '💼 Ofrecemos una amplia gama de productos financieros',
            '🌎 Conectamos a las Américas a través de servicios bancarios',
            '🎯 Nos enfocamos en la inclusión financiera y el crecimiento'
        ];

        this.initializeUI();
    }

    initializeUI() {
        // Get DOM elements
        this.elements = {
            grid: document.getElementById('game-grid'),
            wordList: document.getElementById('word-list'),
            timer: document.getElementById('timer-value'),
            timerDisplay: document.getElementById('timer'),
            controlBtn: document.getElementById('control-btn'),
            rankingBtn: document.getElementById('ranking-btn'),
            hintSection: document.getElementById('hint-section'),
            hintBtn: document.getElementById('hint-btn'),
            hintsCount: document.getElementById('hints-count'),
            hintMessage: document.getElementById('hint-message'),
            resultModal: document.getElementById('result-modal'),
            resultTitle: document.getElementById('result-title'),
            resultMessage: document.getElementById('result-message'),
            resultScore: document.getElementById('result-score'),
            resultFunFact: document.getElementById('result-fun-fact'),
            playerNameInput: document.getElementById('player-name-input'),
            saveScoreBtn: document.getElementById('save-score-btn'),
            playAgainBtn: document.getElementById('play-again-btn'),
            rankingModal: document.getElementById('ranking-modal'),
            rankingList: document.getElementById('ranking-list'),
            closeRankingBtn: document.getElementById('close-ranking-btn'),
            wordListContainer: document.getElementById('word-list-container')
        };

        // Event listeners
        this.elements.controlBtn.addEventListener('click', () => this.toggleGame());
        this.elements.rankingBtn.addEventListener('click', () => this.showRanking());
        this.elements.hintBtn.addEventListener('click', () => this.useHint());
        this.elements.saveScoreBtn.addEventListener('click', () => this.saveScore());
        this.elements.playAgainBtn.addEventListener('click', () => this.playAgain());
        this.elements.closeRankingBtn.addEventListener('click', () => this.hideRanking());

        // Initialize word list display
        this.renderWordList();
    }

    toggleGame() {
        if (this.isGameActive) {
            this.resetGame();
        } else {
            this.startGame();
        }
    }

    startGame() {
        this.generateGrid();
        this.renderGrid();
        this.renderWordList();
        this.foundWords.clear();
        this.foundCells.clear();
        this.selectedCells = [];
        this.timeRemaining = 90;
        this.isGameActive = true;
        this.hintsUsed = 0;
        this.score = 0;

        this.elements.controlBtn.textContent = 'REINICIAR';
        this.elements.hintSection.style.display = 'block';
        this.elements.wordListContainer.style.display = 'block';
        this.updateHintDisplay();
        this.startTimer();
    }

    generateGrid() {
        // Initialize empty grid with new dimensions
        this.grid = Array(this.gridRows).fill(null).map(() =>
            Array(this.gridCols).fill(' ')
        );
        this.wordPositions = {};

        // Shuffle words for random order
        const shuffledWords = [...this.targetWords].sort(() => Math.random() - 0.5);

        // Place each word
        shuffledWords.forEach(word => {
            let placed = false;
            let attempts = 0;
            const maxAttempts = 100;

            while (!placed && attempts < maxAttempts) {
                const direction = Math.floor(Math.random() * 3); // 0: horizontal, 1: vertical, 2: diagonal
                const row = Math.floor(Math.random() * this.gridRows);
                const col = Math.floor(Math.random() * this.gridCols);

                if (this.canPlaceWord(word, row, col, direction)) {
                    this.placeWord(word, row, col, direction);
                    placed = true;
                }
                attempts++;
            }
        });

        // Fill empty spaces with random letters
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (this.grid[i][j] === ' ') {
                    this.grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                }
            }
        }
    }

    canPlaceWord(word, row, col, direction) {
        const len = word.length;

        // Check if word fits with new dimensions
        if (direction === 0 && col + len > this.gridCols) return false;
        if (direction === 1 && row + len > this.gridRows) return false;
        if (direction === 2 && (row + len > this.gridRows || col + len > this.gridCols)) return false;

        // Check if cells are empty
        for (let i = 0; i < len; i++) {
            let r = row + (direction === 1 || direction === 2 ? i : 0);
            let c = col + (direction === 0 || direction === 2 ? i : 0);
            if (this.grid[r][c] !== ' ' && this.grid[r][c] !== word[i]) {
                return false;
            }
        }

        return true;
    }

    placeWord(word, row, col, direction) {
        const positions = [];
        for (let i = 0; i < word.length; i++) {
            const r = row + (direction === 1 || direction === 2 ? i : 0);
            const c = col + (direction === 0 || direction === 2 ? i : 0);
            this.grid[r][c] = word[i];
            positions.push([r, c]);
        }
        this.wordPositions[word] = { positions, direction };
    }

    renderGrid() {
        this.elements.grid.innerHTML = '';
        for (let i = 0; i < this.gridRows; i++) {
            for (let j = 0; j < this.gridCols; j++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.textContent = this.grid[i][j];
                cell.dataset.row = i;
                cell.dataset.col = j;

                cell.addEventListener('click', () => this.selectCell(i, j));

                this.elements.grid.appendChild(cell);
            }
        }
    }

    renderWordList() {
        this.elements.wordList.innerHTML = '';
        this.targetWords.forEach(word => {
            const wordItem = document.createElement('div');
            wordItem.className = 'word-item';
            if (this.foundWords.has(word)) {
                wordItem.classList.add('found');
            }
            wordItem.textContent = word;
            this.elements.wordList.appendChild(wordItem);
        });
    }

    selectCell(row, col) {
        if (!this.isGameActive) return;

        const cellKey = `${row},${col}`;

        // Check if already found
        if (this.foundCells.has(cellKey)) return;

        // If this is the first cell, just select it
        if (this.selectedCells.length === 0) {
            this.selectedCells.push([row, col]);
            this.updateGridDisplay();
            return;
        }

        // Check if adjacent to last selected cell
        const lastCell = this.selectedCells[this.selectedCells.length - 1];
        if (!this.isAdjacent(lastCell, [row, col])) {
            // Start new selection
            this.selectedCells = [[row, col]];
            this.updateGridDisplay();
            return;
        }

        // Add to selection
        this.selectedCells.push([row, col]);
        this.updateGridDisplay();

        // Check for word if selection is long enough
        if (this.selectedCells.length >= 4) {
            this.checkWord();
        }
    }

    isAdjacent(cell1, cell2) {
        const [r1, c1] = cell1;
        const [r2, c2] = cell2;
        return Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1 && !(r1 === r2 && c1 === c2);
    }

    checkWord() {
        const word = this.selectedCells.map(([r, c]) => this.grid[r][c]).join('');

        if (this.targetWords.includes(word) && !this.foundWords.has(word)) {
            this.foundWord(word);
        }
    }

    foundWord(word) {
        this.foundWords.add(word);

        // Add selected cells to found cells
        this.selectedCells.forEach(([r, c]) => {
            this.foundCells.add(`${r},${c}`);
        });

        this.selectedCells = [];
        this.renderWordList();
        this.updateGridDisplay();

        // Check if game won
        if (this.foundWords.size === this.targetWords.length) {
            this.endGame(true);
        }
    }

    updateGridDisplay() {
        const cells = this.elements.grid.querySelectorAll('.grid-cell');
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            const cellKey = `${row},${col}`;

            cell.classList.remove('selected', 'found');

            if (this.foundCells.has(cellKey)) {
                cell.classList.add('found');
            } else if (this.selectedCells.some(([r, c]) => r === row && c === col)) {
                cell.classList.add('selected');
            }
        });
    }

    startTimer() {
        this.updateTimerDisplay();
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();

            if (this.timeRemaining <= 0) {
                this.endGame(false);
            }
        }, 1000);
    }

    updateTimerDisplay() {
        this.elements.timer.textContent = `${this.timeRemaining}s`;

        this.elements.timerDisplay.classList.remove('warning', 'danger');
        if (this.timeRemaining <= 10) {
            this.elements.timerDisplay.classList.add('danger');
        } else if (this.timeRemaining <= 20) {
            this.elements.timerDisplay.classList.add('warning');
        }
    }

    useHint() {
        if (this.hintsUsed >= this.maxHints || !this.isGameActive) return;

        const remainingWords = this.targetWords.filter(word => !this.foundWords.has(word));
        if (remainingWords.length === 0) return;

        const word = remainingWords[Math.floor(Math.random() * remainingWords.length)];
        const wordData = this.wordPositions[word];

        let direction = 'horizontal';
        if (wordData.direction === 1) direction = 'vertical';
        if (wordData.direction === 2) direction = 'diagonal';

        this.hintsUsed++;
        this.elements.hintMessage.textContent = `Pista: Busca '${word}' en dirección ${direction}`;
        this.elements.hintMessage.style.display = 'block';
        this.updateHintDisplay();

        // Hide hint after 3 seconds
        setTimeout(() => {
            this.elements.hintMessage.style.display = 'none';
        }, 3000);
    }

    updateHintDisplay() {
        this.elements.hintsCount.textContent = `Pistas: ${this.hintsUsed}/${this.maxHints}`;
        this.elements.hintBtn.disabled = this.hintsUsed >= this.maxHints;
    }

    endGame(won) {
        this.isGameActive = false;
        clearInterval(this.timerInterval);

        this.score = this.storageManager.calculateScore(
            this.foundWords.size,
            this.timeRemaining,
            this.targetWords.length,
            this.hintsUsed
        );

        const funFact = won
            ? this.winFunFacts[Math.floor(Math.random() * this.winFunFacts.length)]
            : this.loseFunFacts[Math.floor(Math.random() * this.loseFunFacts.length)];

        this.elements.resultModal.querySelector('.result-modal-content').classList.remove('win', 'lose');
        this.elements.resultModal.querySelector('.result-modal-content').classList.add(won ? 'win' : 'lose');

        this.elements.resultTitle.textContent = won ? '¡Felicidades!' : '¡Tiempo agotado!';
        this.elements.resultMessage.textContent = won
            ? 'Has encontrado todas las palabras'
            : 'Inténtalo de nuevo';
        this.elements.resultScore.textContent = `Puntuación: ${this.score}`;
        this.elements.resultFunFact.textContent = funFact;
        this.elements.playerNameInput.value = '';

        this.elements.resultModal.classList.add('active');
    }

    saveScore() {
        const playerName = this.elements.playerNameInput.value.trim();
        if (!playerName) return;

        this.storageManager.addScore(
            playerName,
            this.foundWords.size,
            this.timeRemaining,
            this.targetWords.length,
            this.hintsUsed
        );

        this.elements.resultModal.classList.remove('active');
        this.showRanking();
    }

    playAgain() {
        this.elements.resultModal.classList.remove('active');
        this.resetGame();
        this.startGame();
    }

    resetGame() {
        this.isGameActive = false;
        clearInterval(this.timerInterval);
        this.foundWords.clear();
        this.foundCells.clear();
        this.selectedCells = [];
        this.timeRemaining = 90;
        this.hintsUsed = 0;
        this.elements.controlBtn.textContent = 'INICIAR JUEGO';
        this.elements.hintSection.style.display = 'none';
        this.elements.wordListContainer.style.display = 'none';
        this.elements.grid.innerHTML = '';
        this.elements.timerDisplay.classList.remove('warning', 'danger');
        this.updateTimerDisplay();
    }

    showRanking() {
        const scores = this.storageManager.getTopScores();
        this.elements.rankingList.innerHTML = '';

        if (scores.length === 0) {
            this.elements.rankingList.innerHTML = '<div class="ranking-empty">¡Aún no hay puntuaciones!<br><br>¡Sé el primero en jugar!</div>';
        } else {
            scores.forEach((score, index) => {
                const item = document.createElement('div');
                item.className = 'ranking-item';

                const position = document.createElement('div');
                position.className = 'ranking-position';
                position.textContent = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;

                const name = document.createElement('div');
                name.className = 'ranking-name';
                name.textContent = score.name;

                const scoreValue = document.createElement('div');
                scoreValue.className = 'ranking-score';
                scoreValue.textContent = `${score.score} pts`;

                item.appendChild(position);
                item.appendChild(name);
                item.appendChild(scoreValue);

                this.elements.rankingList.appendChild(item);
            });
        }

        this.elements.rankingModal.classList.add('active');
    }

    hideRanking() {
        this.elements.rankingModal.classList.remove('active');
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new PupiletraGame();
});
