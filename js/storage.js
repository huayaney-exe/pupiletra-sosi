// Storage Manager for Pupiletra
// Handles LocalStorage persistence for TOP 10 scores

class StorageManager {
    constructor() {
        this.storageKey = 'pupiletra_top_scores';
    }

    // Calculate score based on game performance
    calculateScore(wordsFound, timeRemaining, totalWords, hintsUsed, streakCount) {
        const baseScore = wordsFound * 100; // 100 points per word
        const timeBonus = timeRemaining * 15; // 15 points per second remaining
        const completionBonus = (wordsFound === totalWords) ? 500 : 0; // Bonus for completing
        const hintPenalty = hintsUsed * 50; // 50 points penalty per hint
        const streakBonus = (streakCount > 1) ? (streakCount * 25) : 0; // 25 points extra per word in streak

        return baseScore + timeBonus + completionBonus - hintPenalty + streakBonus;
    }

    // Add a new score to the ranking
    addScore(playerName, score) {
        const newScore = {
            name: playerName,
            score: score,
            date: Date.now()
        };

        let scores = this.loadScores();
        scores.push(newScore);

        // Sort by score (descending)
        scores.sort((a, b) => b.score - a.score);

        // Keep only TOP 10
        scores = scores.slice(0, 10);

        // Save to localStorage
        this.saveScores(scores);

        return score;
    }

    // Save scores to localStorage
    saveScores(scores) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(scores));
        } catch (error) {
            console.error('Error saving scores:', error);
        }
    }

    // Load scores from localStorage
    loadScores() {
        try {
            const scoresJson = localStorage.getItem(this.storageKey);
            if (scoresJson) {
                return JSON.parse(scoresJson);
            }
        } catch (error) {
            console.error('Error loading scores:', error);
        }
        return [];
    }

    // Get TOP 10 scores
    getTopScores() {
        return this.loadScores();
    }

    // Clear all scores (for debugging/testing)
    clearAllScores() {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (error) {
            console.error('Error clearing scores:', error);
        }
    }
}
