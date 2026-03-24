/**
 * node.js
 * Defines a doubly linked list node used in the LRU Cache.
 */
class Node {
    /**
     * @param {*} key - The key of the item
     * @param {*} value - The value of the item
     * @param {number|null} ttl - Optional Time-To-Live in milliseconds
     */
    constructor(key, value, ttl = null) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
        
        // Bonus: TTL feature
        this.expireAt = ttl ? Date.now() + ttl : null;
    }

    /**
     * Checks if the node has expired based on TTL.
     * @returns {boolean}
     */
    isExpired() {
        if (!this.expireAt) return false;
        return Date.now() > this.expireAt;
    }
}

module.exports = Node;
