class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }

    get(key) {
        if (!this.cache.has(key)) return -1;
        
        const value = this.cache.get(key);
        // Re-insert to make it the most recently used (at the end of Map)
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
    }

    put(key, value) {
        let evictedKey = null;
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            // Cache is full, evict LRU (first item in Map)
            evictedKey = this.cache.keys().next().value;
            this.cache.delete(evictedKey);
        }
        
        this.cache.set(key, value);
        return { evictedKey, isUpdate: evictedKey === null && this.cache.has(key) };
    }

    getEntries() {
        // Map iterates in insertion order
        // Reverse it so MRU is first (index 0) and LRU is last
        return Array.from(this.cache.entries()).reverse();
    }
}

// DOM Elements
const capacityInput = document.getElementById('capacity-input');
const setCapacityBtn = document.getElementById('set-capacity-btn');
const keyInput = document.getElementById('key-input');
const valueInput = document.getElementById('value-input');
const getBtn = document.getElementById('get-btn');
const putBtn = document.getElementById('put-btn');
const statusMessage = document.getElementById('status-message');
const cacheDisplay = document.getElementById('cache-display');

// Initialize cache
let lruCache = new LRUCache(parseInt(capacityInput.value) || 3);
let recentActionKey = null;

// Helpers
function showStatus(message, type = 'info') {
    statusMessage.textContent = message;
    statusMessage.className = `status ${type}`;
}

function renderCache() {
    cacheDisplay.innerHTML = '';
    
    const entries = lruCache.getEntries();
    
    if (entries.length === 0) {
        cacheDisplay.innerHTML = '<div class="empty-state">Cache is empty</div>';
        return;
    }

    entries.forEach(([key, value], index) => {
        const card = document.createElement('div');
        card.className = 'cache-card';
        card.id = `card-${key}`;
        
        // Highlight logic
        if (key === recentActionKey) {
            // First item after reverse is MRU
            if (index === 0) {
                card.classList.add('highlight');
            } else {
                card.classList.add('flash');
            }
        }
        
        const keyEl = document.createElement('div');
        keyEl.className = 'card-key';
        keyEl.textContent = key;
        
        const valueEl = document.createElement('div');
        valueEl.className = 'card-value';
        valueEl.textContent = value;
        
        card.appendChild(keyEl);
        card.appendChild(valueEl);
        
        cacheDisplay.appendChild(card);
    });
}

function handleEviction(evictedKey, callback) {
    if (evictedKey !== null) {
        const cardToEvict = document.getElementById(`card-${evictedKey}`);
        if (cardToEvict) {
            cardToEvict.classList.add('evicting');
            setTimeout(() => {
                callback();
            }, 400); // match slideOut animation duration
            return;
        }
    }
    callback();
}

// Event Listeners
setCapacityBtn.addEventListener('click', () => {
    const newCapacity = parseInt(capacityInput.value);
    if (isNaN(newCapacity) || newCapacity < 1) {
        showStatus('Capacity must be at least 1!', 'error');
        return;
    }
    
    lruCache = new LRUCache(newCapacity);
    recentActionKey = null;
    renderCache();
    showStatus(`Success: Cache capacity set to ${newCapacity}`, 'success');
});

putBtn.addEventListener('click', () => {
    const key = keyInput.value.trim();
    const value = valueInput.value.trim();
    
    if (!key || !value) {
        showStatus('Please enter both Key and Value to PUT!', 'error');
        return;
    }
    
    const { evictedKey } = lruCache.put(key, value);
    recentActionKey = key;
    
    keyInput.value = '';
    valueInput.value = '';
    
    const updateUI = () => {
        renderCache();
        if (evictedKey !== null) {
            showStatus(`PUT (${key}, ${value}) - Evicted LRU key: ${evictedKey}`, 'success');
        } else {
            showStatus(`PUT (${key}, ${value}) inserted successfully`, 'success');
        }
    };
    
    if (evictedKey !== null) {
        handleEviction(evictedKey, updateUI);
    } else {
        updateUI();
    }
});

getBtn.addEventListener('click', () => {
    const key = keyInput.value.trim();
    
    if (!key) {
        showStatus('Please enter a Key to GET!', 'error');
        return;
    }
    
    const value = lruCache.get(key);
    recentActionKey = key;
    
    if (value === -1) {
        recentActionKey = null; // Don't highlight anything
        showStatus(`GET (${key}) - Not Found in Cache`, 'error');
        renderCache();
    } else {
        showStatus(`GET (${key}) - Found Value: ${value}`, 'success');
        renderCache();
    }
});

// Initial Render
renderCache();
