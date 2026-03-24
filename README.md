LRU Cache Visualizer

An interactive project that demonstrates how an LRU (Least Recently Used) Cache works internally using a combination of HashMap and Doubly Linked List. The project includes both backend logic and a frontend UI to visualize cache operations in real time.

Features
O(1) get and put operations
Implemented using HashMap and Doubly Linked List
Automatic eviction of least recently used items
Real-time cache visualization (MRU to LRU)
Updates existing keys and reorders dynamically
Optional TTL (Time-To-Live) support
Simple and interactive UI
Project Structure
LRU Cache visualizer/
│
├── backend/
│   ├── lru.js
│   ├── dll.js
│   ├── node.js
│   └── test.js
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md

How It Works
The cache stores key-value pairs
Recently accessed items move to the front (MRU)
Least recently used items stay at the end (LRU)
When capacity is exceeded, the LRU item is evicted automatically
Run Locally
Backend (Testing)
cd backend
node test.js

Frontend (UI)
Open frontend/index.html in your browser
OR
Use Live Server in VS Code
Example
PUT 1:A
PUT 2:B
PUT 3:C

Cache:
[3:C] → [2:B] → [1:A]

GET 1

Cache:
[1:A] → [3:C] → [2:B]

PUT 4:D (Eviction happens)

Cache:
[4:D] → [1:A] → [3:C]

Real-World Applications
Web browser caching
Mobile app data storage
Database query optimization
Operating system memory management
Tech Stack
Frontend: HTML, CSS, JavaScript
Backend: Node.js
Concepts: Data Structures and Algorithms
Demo

Add your screenshot here:

![LRU Visualizer](screenshot.png)

Future Improvements
Add smooth animations and transitions
Deploy as a live web application
Improve UI/UX design
Add API-based backend integration
Author

Siddhi Singh Rajput
