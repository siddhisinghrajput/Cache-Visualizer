/**
 * dll.js
 * Helper class for Doubly Linked List operations.
 */
const Node = require('./node.js');

class DoublyLinkedList {
    constructor() {
        // Dummy head and tail to completely avoid edge cases with null during add/remove
        this.head = new Node(null, null);
        this.tail = new Node(null, null);
        
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    /**
     * Adds a node right after the dummy head (Most Recently Used position).
     * @param {Node} node 
     */
    addNode(node) {
        node.prev = this.head;
        node.next = this.head.next;
        
        this.head.next.prev = node;
        this.head.next = node;
    }

    /**
     * Removes an existing node from the linked list.
     * @param {Node} node 
     */
    removeNode(node) {
        const prevNode = node.prev;
        const nextNode = node.next;

        prevNode.next = nextNode;
        nextNode.prev = prevNode;
        
        // Clean up references for garbage collection
        node.prev = null;
        node.next = null;
    }

    /**
     * Moves an existing node to the head (Most Recently Used position).
     * @param {Node} node 
     */
    moveToHead(node) {
        this.removeNode(node);
        this.addNode(node);
    }

    /**
     * Pops (removes) the tail node (Least Recently Used element).
     * @returns {Node|null} The removed node or null if list is empty
     */
    popTail() {
        const lruNode = this.tail.prev;
        if (lruNode === this.head) {
            return null; // The list is empty
        }
        this.removeNode(lruNode);
        return lruNode;
    }
}

module.exports = DoublyLinkedList;
