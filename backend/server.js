const express = require('express');
const cors = require('cors');
const LRUCache = require('./lru.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize cache with default capacity of 3
let cache = new LRUCache(3);

// Endpoint to set Cache Capacity
app.post('/api/cache/capacity', (req, res) => {
    const { capacity } = req.body;
    if (!capacity || capacity < 1) {
        return res.status(400).json({ error: 'Capacity must be at least 1' });
    }
    cache = new LRUCache(capacity);
    res.json({ message: `Cache capacity set to ${capacity}` });
});

// Endpoint to GET a key from Cache
app.get('/api/cache/:key', (req, res) => {
    const { key } = req.params;
    const value = cache.get(key);
    
    if (value === -1) {
        return res.json({ found: false, value: -1 });
    }
    
    res.json({ found: true, value });
});

// Endpoint to PUT a key-value pair into Cache
app.put('/api/cache', (req, res) => {
    const { key, value } = req.body;
    
    if (!key || value === undefined) {
        return res.status(400).json({ error: 'Key and value are required' });
    }
    
    // Check if key already exists or if we need to evict
    const exists = cache.cache.has(key);
    let evictedKey = null;
    
    if (!exists && cache.cache.size >= cache.capacity) {
        // Find the LRU key to report back eviction
        evictedKey = cache.dll.tail.prev.key;
    }
    
    cache.put(key, value);
    
    res.json({
        message: 'Success',
        evictedKey,
        isUpdate: exists
    });
});

// Endpoint to GET all cache entries
app.get('/api/cache', (req, res) => {
    const entries = [];
    let current = cache.dll.head.next;
    
    // Traverse from MRU (head) to LRU (tail)
    while (current !== cache.dll.tail) {
        entries.push([current.key, current.value]);
        current = current.next;
    }
    
    res.json({ entries });
});

app.listen(PORT, () => {
    console.log(`LRU Cache Server running on port ${PORT}`);
});
