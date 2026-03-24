/**
 * lru.js
 * Main LRUCache class combining HashMap and DoublyLinkedList.
 */
const Node = require('./node.js');
const DoublyLinkedList = require('./dll.js');

class LRUCache {
    /**
     * @param {number} capacity - Maximum number of items the cache can hold
     * @param {number|null} defaultTTL - Default time-to-live in milliseconds (optional bonus)
     */
    constructor(capacity, defaultTTL = null) {
        if (capacity <= 0) {
            throw new Error('Capacity must be strictly positive');
        }
        
        this.capacity = capacity;
        this.defaultTTL = defaultTTL;
        
        this.cache = new Map(); // HashMap for O(1) lookups
        this.dll = new DoublyLinkedList(); // DLL to track usage order accurately
    }

    /**
     * Retrieves the value of the key if it exists, otherwise returns -1.
     * Operation is strictly O(1) time complexity.
     * @param {*} key 
     * @returns {*} 
     */
    get(key) {
        if (!this.cache.has(key)) {
            console.log(`[GET] Key ${key} not found.`);
            return -1;
        }

        const node = this.cache.get(key);

        // Check TTL expiration (Bonus Feature)
        if (node.isExpired()) {
            console.log(`[GET] Key ${key} has expired. Evicting.`);
            this.dll.removeNode(node);
            this.cache.delete(key);
            return -1;
        }

        // On read, move the accessed node to the Most Recently Used position (front)
        this.dll.moveToHead(node);
        console.log(`[GET] Key ${key} found. Value: ${node.value}. Moved to front.`);
        
        return node.value;
    }

    /**
     * Inserts or updates the value of the key. 
     * If capacity is exceeded, evicts the Least Recently Used element.
     * Operation is strictly O(1) time complexity.
     * @param {*} key 
     * @param {*} value 
     * @param {number|null} ttl - Optional specific TTL
     */
    put(key, value, ttl = this.defaultTTL) {
        if (this.cache.has(key)) {
            // Key already exists, update its value and move it to the front
            const node = this.cache.get(key);
            node.value = value;
            node.expireAt = ttl ? Date.now() + ttl : null; // Refresh expiration if provided
            
            this.dll.moveToHead(node);
            console.log(`[PUT] Updated key ${key} to value ${value}. Moved to front.`);
        } else {
            // Insert new key
            const newNode = new Node(key, value, ttl);
            this.cache.set(key, newNode);
            this.dll.addNode(newNode);
            console.log(`[PUT] Inserted key ${key} with value ${value}.`);

            // If capacity exceeded, evict LRU item
            if (this.cache.size > this.capacity) {
                const lruNode = this.dll.popTail();
                if (lruNode) {
                    this.cache.delete(lruNode.key);
                    console.log(`[EVICT] Capacity exceeded. Evicted least recently used key ${lruNode.key}.`);
                }
            }
        }
    }

    /**
     * Bonus: Returns the current valid cache size, lazily cleaning expired entries.
     * @returns {number}
     */
    getSize() {
        for (const [key, node] of this.cache.entries()) {
            if (node.isExpired()) {
                this.dll.removeNode(node);
                this.cache.delete(key);
                console.log(`[CLEANUP] Automatically evicted expired key ${key}.`);
            }
        }
        return this.cache.size;
    }

    /**
     * Debugging / Output method: prints current cache state (Most Recently Used to Least Recently Used)
     */
    printState() {
        let current = this.dll.head.next;
        const items = [];
        
        while (current !== this.dll.tail) {
            items.push(`[${current.key}:${current.value}]`);
            current = current.next;
        }
        
        console.log(`[STATE] Current Cache (MRU -> LRU): ${items.length > 0 ? items.join(' -> ') : 'Empty'}`);
    }
}

module.exports = LRUCache;
