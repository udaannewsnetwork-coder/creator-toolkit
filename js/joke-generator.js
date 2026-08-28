// ============================================
// Joke Generator Application
// Using JokeAPI for random jokes
// ============================================

class JokeGenerator {
    constructor() {
        // API Configuration
        this.apiBaseUrl = 'https://v2.jokeapi.dev/joke';
        this.jokeCacheKey = 'jokeGeneratorCache';
        this.favoritesKey = 'favoriteJokes';
        this.statsKey = 'jokeGeneratorStats';
        
        // DOM Elements
        this.jokeText = document.getElementById('jokeText');
        this.jokeAnswer = document.getElementById('jokeAnswer');
        this.revealBtn = document.getElementById('revealBtn');
        this.getJokeBtn = document.getElementById('getJokeBtn');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.errorMessage = document.getElementById('errorMessage');
        this.errorText = document.getElementById('errorText');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.favoritesList = document.getElementById('favoritesList');
        this.clearFavoritesBtn = document.getElementById('clearFavoritesBtn');
        this.jokesLoadedCount = document.getElementById('jokesLoadedCount');
        this.favoriteCount = document.getElementById('favoriteCount');
        this.lastUpdated = document.getElementById('lastUpdated');
        this.jokeContent = document.querySelector('.joke-content');
        
        // Application State
        this.currentJoke = null;
        this.selectedType = 'random';
        this.favorites = [];
        this.stats = {
            jokesLoaded: 0,
            lastUpdated: 'Never'
        };
        
        // Initialize
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.loadFavorites();
        this.loadStats();
        this.attachEventListeners();
        this.renderUI();
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        this.getJokeBtn.addEventListener('click', () => this.fetchJoke());
        this.refreshBtn.addEventListener('click', () => this.refreshPage());
        this.revealBtn.addEventListener('click', () => this.revealAnswer());
        this.clearFavoritesBtn.addEventListener('click', () => this.clearAllFavorites());
        
        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.selectedType = e.target.dataset.type;
            });
        });
    }

    /**
     * Fetch a joke from the API
     */
    async fetchJoke() {
        try {
            // Show loading state
            this.showLoading(true);
            this.hideError();
            
            // Build API URL based on selected type
            const url = this.buildApiUrl();
            
            // Fetch the joke
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Handle API error
            if (data.error) {
                throw new Error('No jokes found for this category');
            }
            
            // Process the joke
            this.currentJoke = this.parseJoke(data);
            this.updateStats();
            this.displayJoke();
            this.showLoading(false);
            
        } catch (error) {
            console.error('Error fetching joke:', error);
            this.showError(`Failed to load joke: ${error.message}`);
            this.showLoading(false);
        }
    }

    /**
     * Build the API URL based on selected type
     */
    buildApiUrl() {
        const excludeFlags = 'nsfw,religious,political,racist,sexist';
        
        const typeMap = {
            'random': 'Any',
            'programming': 'Programming',
            'knock-knock': 'Knock-Knock',
            'general': 'General'
        };
        
        const type = typeMap[this.selectedType] || 'Any';
        return `${this.apiBaseUrl}/${type}?blacklistFlags=${excludeFlags}`;
    }

    /**
     * Parse joke data from API response
     */
    parseJoke(data) {
        let setup = '';
        let delivery = '';
        
        if (data.type === 'twopart') {
            setup = data.setup;
            delivery = data.delivery;
        } else if (data.type === 'single') {
            setup = data.joke;
            delivery = '';
        }
        
        return {
            setup: setup,
            delivery: delivery,
            category: data.category,
            type: data.type,
            flags: data.flags || {}
        };
    }

    /**
     * Display the current joke
     */
    displayJoke() {
        if (!this.currentJoke) return;
        
        // Reset reveal button
        this.revealBtn.classList.add('hidden');
        this.jokeAnswer.classList.add('hidden');
        this.jokeAnswer.textContent = '';
        
        // Display setup
        this.jokeText.textContent = this.currentJoke.setup;
        
        // Show reveal button if joke has delivery
        if (this.currentJoke.delivery) {
            this.revealBtn.classList.remove('hidden');
        } else {
            // Single-line joke, no reveal needed
            this.revealBtn.classList.add('hidden');
        }
    }

    /**
     * Reveal the joke answer
     */
    revealAnswer() {
        if (!this.currentJoke || !this.currentJoke.delivery) return;
        
        this.jokeAnswer.textContent = this.currentJoke.delivery;
        this.jokeAnswer.classList.remove('hidden');
        
        // Add to favorites button after revealing
        this.addFavoriteButton();
    }

    /**
     * Add favorite button dynamically
     */
    addFavoriteButton() {
        const existingBtn = this.jokeContent.querySelector('.btn-favorite');
        if (existingBtn) return;
        
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'btn btn-secondary btn-favorite';
        favoriteBtn.innerHTML = '❤️ Save to Favorites';
        favoriteBtn.style.marginTop = '20px';
        
        favoriteBtn.addEventListener('click', () => {
            this.addToFavorites(this.currentJoke);
            favoriteBtn.disabled = true;
            favoriteBtn.textContent = '✓ Added to Favorites';
        });
        
        // Check if already in favorites
        if (this.isFavorited(this.currentJoke)) {
            favoriteBtn.disabled = true;
            favoriteBtn.textContent = '✓ Already Favorited';
        }
        
        this.jokeContent.appendChild(favoriteBtn);
    }

    /**
     * Add joke to favorites
     */
    addToFavorites(joke) {
        const isFavorited = this.favorites.some(fav => 
            fav.setup === joke.setup && fav.delivery === joke.delivery
        );
        
        if (!isFavorited) {
            this.favorites.push(joke);
            this.saveFavorites();
            this.renderFavorites();
            this.showNotification('Joke saved to favorites!', 'success');
        }
    }

    /**
     * Check if joke is already favorited
     */
    isFavorited(joke) {
        return this.favorites.some(fav => 
            fav.setup === joke.setup && fav.delivery === joke.delivery
        );
    }

    /**
     * Remove from favorites
     */
    removeFromFavorites(index) {
        this.favorites.splice(index, 1);
        this.saveFavorites();
        this.renderFavorites();
    }

    /**
     * Render favorites list
     */
    renderFavorites() {
        const container = this.favoritesList;
        container.innerHTML = '';
        
        if (this.favorites.length === 0) {
            container.innerHTML = '<p class="empty-message">No favorites yet. Click the heart to save jokes!</p>';
            this.clearFavoritesBtn.style.display = 'none';
            this.favoriteCount.textContent = '0';
            return;
        }
        
        this.clearFavoritesBtn.style.display = 'block';
        this.favoriteCount.textContent = this.favorites.length;
        
        this.favorites.forEach((joke, index) => {
            const item = document.createElement('div');
            item.className = 'favorite-item';
            
            const textDiv = document.createElement('div');
            textDiv.className = 'favorite-text';
            textDiv.innerHTML = `
                <strong>${this.escapeHtml(joke.setup)}</strong>
                ${joke.delivery ? `<p class="favorite-answer">${this.escapeHtml(joke.delivery)}</p>` : ''}
            `;
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-favorite';
            removeBtn.textContent = 'Remove';
            removeBtn.addEventListener('click', () => this.removeFromFavorites(index));
            
            item.appendChild(textDiv);
            item.appendChild(removeBtn);
            container.appendChild(item);
        });
    }

    /**
     * Clear all favorites
     */
    clearAllFavorites() {
        if (confirm(`Delete all ${this.favorites.length} favorite jokes?`)) {
            this.favorites = [];
            this.saveFavorites();
            this.renderFavorites();
            this.showNotification('All favorites cleared', 'warning');
        }
    }

    /**
     * Update statistics
     */
    updateStats() {
        this.stats.jokesLoaded++;
        this.stats.lastUpdated = new Date().toLocaleTimeString();
        this.saveStats();
        this.renderUI();
    }

    /**
     * Render UI elements
     */
    renderUI() {
        this.jokesLoadedCount.textContent = this.stats.jokesLoaded;
        this.lastUpdated.textContent = this.stats.lastUpdated;
        this.renderFavorites();
    }

    /**
     * Show/hide loading spinner
     */
    showLoading(show) {
        if (show) {
            this.loadingSpinner.classList.remove('hidden');
            this.getJokeBtn.disabled = true;
            this.refreshBtn.disabled = true;
        } else {
            this.loadingSpinner.classList.add('hidden');
            this.getJokeBtn.disabled = false;
            this.refreshBtn.disabled = false;
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        this.errorText.textContent = message;
        this.errorMessage.classList.remove('hidden');
    }

    /**
     * Hide error message
     */
    hideError() {
        this.errorMessage.classList.add('hidden');
    }

    /**
     * Refresh the page
     */
    refreshPage() {
        location.reload();
    }

    /**
     * Show notification (console log)
     */
    showNotification(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Save favorites to local storage
     */
    saveFavorites() {
        try {
            localStorage.setItem(this.favoritesKey, JSON.stringify(this.favorites));
        } catch (error) {
            console.error('Failed to save favorites:', error);
        }
    }

    /**
     * Load favorites from local storage
     */
    loadFavorites() {
        try {
            const stored = localStorage.getItem(this.favoritesKey);
            this.favorites = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load favorites:', error);
            this.favorites = [];
        }
    }

    /**
     * Save statistics to local storage
     */
    saveStats() {
        try {
            localStorage.setItem(this.statsKey, JSON.stringify(this.stats));
        } catch (error) {
            console.error('Failed to save stats:', error);
        }
    }

    /**
     * Load statistics from local storage
     */
    loadStats() {
        try {
            const stored = localStorage.getItem(this.statsKey);
            if (stored) {
                this.stats = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new JokeGenerator();
});
