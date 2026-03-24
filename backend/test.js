/**
 * test.js
 * Comprehensive testing suite for the LRU Cache.
 */

const LRUCache = require('./lru.js');

function runTests() {
    console.log("=========================================");
    console.log("       STARTING LRU CACHE TESTS           ");
    console.log("=========================================\n");

    console.log("--- Test Case 1: Core Functionality (Capacity: 2) ---");
    const cache1 = new LRUCache(2);
    
    cache1.put(1, 'A');
    cache1.put(2, 'B');
    cache1.printState(); // Expected: [2:B] -> [1:A]
    
    console.log(`Expected GET(1): A | Actual: ${cache1.get(1)}`);
    cache1.printState(); // Expected: [1:A] -> [2:B]
    
    // Eviction test
    cache1.put(3, 'C'); // Should evict 2
    cache1.printState(); // Expected: [3:C] -> [1:A]
    
    console.log(`Expected GET(2): -1 | Actual: ${cache1.get(2)}`);
    
    cache1.put(4, 'D'); // Should evict 1
    cache1.printState(); // Expected: [4:D] -> [3:C]
    
    console.log(`Expected GET(1): -1 | Actual: ${cache1.get(1)}`);
    console.log(`Expected GET(3): C | Actual: ${cache1.get(3)}`);
    console.log(`Expected GET(4): D | Actual: ${cache1.get(4)}`);
    console.log();

    console.log("--- Test Case 2: Updating Existing Keys ---");
    const cache2 = new LRUCache(3);
    
    cache2.put('apple', 10);
    cache2.put('banana', 20);
    cache2.put('cherry', 30);
    cache2.printState();
    
    cache2.put('banana', 25); // update + move to front
    cache2.printState();
    
    console.log(`Current Size: ${cache2.getSize()}`);
    console.log();

    console.log("--- Test Case 3: TTL Feature ---");
    const cache3 = new LRUCache(3);
    
    cache3.put('T1', 'Expiring Value', 100); // 100ms TTL
    cache3.put('T2', 'Persistent Value');
    
    cache3.printState();
    console.log(`Immediate GET(T1): ${cache3.get('T1')}`);
    
    setTimeout(() => {
        console.log("\n... Waited 150ms ...\n");
        
        console.log(`Expected GET(T1): -1 | Actual: ${cache3.get('T1')}`);
        console.log(`Expected GET(T2): Persistent Value | Actual: ${cache3.get('T2')}`);
        
        console.log(`Final Cache Size (Expected 1): ${cache3.getSize()}`);
        cache3.printState();
        
        console.log("\n=========================================");
        console.log("          ALL TESTS COMPLETED             ");
        console.log("=========================================\n");
    }, 150);
}

runTests();
