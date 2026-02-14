// Low-Level Design (LLD) Problems for Scalable Systems

export const lldProblems = {
  easy: [
    {
      id: 'parking-lot',
      title: 'Design Parking Lot System',
      difficulty: 'Easy',
      companies: ['Amazon', 'Google', 'Microsoft'],
      category: 'Object-Oriented Design',
      description: 'Design a parking lot system that can handle multiple floors, different vehicle types, and parking spot allocation.',
      requirements: [
        'Support multiple vehicle types (Car, Bike, Truck)',
        'Multiple floors with different spot sizes',
        'Entry and exit gates',
        'Parking fee calculation',
        'Available spot tracking',
        'Ticket generation system'
      ],
      classes: [
        'ParkingLot',
        'Floor',
        'ParkingSpot',
        'Vehicle',
        'Ticket',
        'PaymentProcessor'
      ],
      starterCode: `// Design a Parking Lot System

class Vehicle {
  constructor(licensePlate, type) {
    this.licensePlate = licensePlate;
    this.type = type; // 'car', 'bike', 'truck'
  }
}

class ParkingSpot {
  constructor(id, type, floor) {
    this.id = id;
    this.type = type;
    this.floor = floor;
    this.isOccupied = false;
    this.vehicle = null;
  }
  
  parkVehicle(vehicle) {
    // Implement parking logic
  }
  
  removeVehicle() {
    // Implement removal logic
  }
}

class ParkingLot {
  constructor(floors, spotsPerFloor) {
    this.floors = [];
    this.tickets = new Map();
    this.initialize(floors, spotsPerFloor);
  }
  
  initialize(floors, spotsPerFloor) {
    // Initialize parking lot
  }
  
  findAvailableSpot(vehicleType) {
    // Find and return available spot
  }
  
  parkVehicle(vehicle) {
    // Park vehicle and generate ticket
  }
  
  exitVehicle(ticketId) {
    // Process exit and calculate fee
  }
}

// Test your implementation
const parkingLot = new ParkingLot(3, 10);
const car = new Vehicle('ABC123', 'car');
const ticket = parkingLot.parkVehicle(car);
console.log('Ticket:', ticket);`,
      testCases: [
        'Can park different vehicle types',
        'Tracks available spots correctly',
        'Generates unique tickets',
        'Calculates fees accurately',
        'Handles full parking lot',
        'Supports multiple floors'
      ],
      hints: [
        'Use enums for vehicle types and spot sizes',
        'Implement a strategy pattern for fee calculation',
        'Consider using a priority queue for spot allocation',
        'Think about thread safety for concurrent access'
      ]
    },
    {
      id: 'library-management',
      title: 'Library Management System',
      difficulty: 'Easy',
      companies: ['Flipkart', 'Amazon'],
      category: 'Object-Oriented Design',
      description: 'Design a library management system with book borrowing, returning, and member management.',
      requirements: [
        'Add/remove books',
        'Register members',
        'Borrow and return books',
        'Track due dates',
        'Calculate late fees',
        'Search books by title/author'
      ],
      classes: ['Library', 'Book', 'Member', 'Transaction', 'Catalog'],
      starterCode: `class Book {
  constructor(isbn, title, author, copies) {
    this.isbn = isbn;
    this.title = title;
    this.author = author;
    this.totalCopies = copies;
    this.availableCopies = copies;
  }
}

class Member {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.borrowedBooks = [];
  }
}

class Library {
  constructor() {
    this.books = new Map();
    this.members = new Map();
    this.transactions = [];
  }
  
  addBook(book) {
    // Add book to library
  }
  
  registerMember(member) {
    // Register new member
  }
  
  borrowBook(memberId, isbn) {
    // Borrow book logic
  }
  
  returnBook(memberId, isbn) {
    // Return book logic
  }
  
  searchBooks(query) {
    // Search implementation
  }
}`,
      testCases: [
        'Can add and remove books',
        'Members can borrow books',
        'Tracks available copies',
        'Calculates late fees',
        'Search works correctly',
        'Handles concurrent borrowing'
      ]
    }
  ],
  
  medium: [
    {
      id: 'rate-limiter',
      title: 'Design Rate Limiter',
      difficulty: 'Medium',
      companies: ['Google', 'Amazon', 'Uber', 'Netflix'],
      category: 'Scalable Systems',
      description: 'Design a rate limiter that can limit the number of requests a user can make in a given time window.',
      requirements: [
        'Support multiple rate limiting algorithms',
        'Token bucket algorithm',
        'Sliding window algorithm',
        'Per-user rate limiting',
        'Distributed rate limiting',
        'Handle high throughput'
      ],
      algorithms: [
        'Token Bucket',
        'Leaky Bucket',
        'Fixed Window',
        'Sliding Window',
        'Sliding Window Log'
      ],
      starterCode: `// Rate Limiter Implementation

class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRate; // tokens per second
    this.lastRefill = Date.now();
  }
  
  refill() {
    const now = Date.now();
    const timePassed = (now - this.lastRefill) / 1000;
    const tokensToAdd = timePassed * this.refillRate;
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
  
  allowRequest() {
    this.refill();
    if (this.tokens >= 1) {
      this.tokens--;
      return true;
    }
    return false;
  }
}

class RateLimiter {
  constructor(algorithm = 'token-bucket') {
    this.algorithm = algorithm;
    this.limiters = new Map(); // userId -> limiter
  }
  
  isAllowed(userId, limit, window) {
    // Implement rate limiting logic
  }
  
  // Implement different algorithms
  tokenBucket(userId, limit, window) {
    // Token bucket implementation
  }
  
  slidingWindow(userId, limit, window) {
    // Sliding window implementation
  }
  
  fixedWindow(userId, limit, window) {
    // Fixed window implementation
  }
}

// Test
const limiter = new RateLimiter('token-bucket');
console.log(limiter.isAllowed('user1', 10, 60)); // 10 requests per 60 seconds`,
      testCases: [
        'Correctly limits requests',
        'Handles burst traffic',
        'Resets after time window',
        'Works for multiple users',
        'Thread-safe implementation',
        'Efficient memory usage'
      ],
      scalabilityConsiderations: [
        'Use Redis for distributed rate limiting',
        'Implement sliding window for accuracy',
        'Consider memory vs accuracy tradeoff',
        'Handle clock skew in distributed systems'
      ]
    },
    {
      id: 'lru-cache',
      title: 'LRU Cache with TTL',
      difficulty: 'Medium',
      companies: ['Google', 'Facebook', 'Amazon'],
      category: 'Caching Systems',
      description: 'Design an LRU cache with time-to-live (TTL) support for entries.',
      requirements: [
        'O(1) get and put operations',
        'LRU eviction policy',
        'TTL support for entries',
        'Thread-safe operations',
        'Memory limit enforcement',
        'Statistics tracking'
      ],
      starterCode: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
    this.ttlMap = new Map();
  }
  
  get(key) {
    // Get value and update LRU order
  }
  
  put(key, value, ttl = null) {
    // Put value with optional TTL
  }
  
  evict() {
    // Evict least recently used
  }
  
  cleanExpired() {
    // Remove expired entries
  }
  
  getStats() {
    // Return cache statistics
  }
}`,
      testCases: [
        'Get and put work correctly',
        'LRU eviction works',
        'TTL expiration works',
        'Handles capacity limits',
        'Thread-safe operations',
        'Statistics are accurate'
      ]
    },
    {
      id: 'url-shortener',
      title: 'URL Shortener Service',
      difficulty: 'Medium',
      companies: ['Google', 'Amazon', 'TinyURL', 'Bitly'],
      category: 'Scalable Systems',
      description: 'Design a URL shortening service like bit.ly with analytics.',
      requirements: [
        'Generate short URLs',
        'Redirect to original URL',
        'Custom aliases support',
        'Analytics (click count, location)',
        'Expiration support',
        'High availability'
      ],
      starterCode: `class URLShortener {
  constructor() {
    this.urlMap = new Map(); // shortUrl -> longUrl
    this.analytics = new Map(); // shortUrl -> stats
    this.counter = 0;
  }
  
  encode(longUrl, customAlias = null, expiresIn = null) {
    // Generate short URL
  }
  
  decode(shortUrl) {
    // Get original URL
  }
  
  generateShortCode() {
    // Generate unique short code
  }
  
  trackClick(shortUrl, metadata) {
    // Track analytics
  }
  
  getAnalytics(shortUrl) {
    // Return analytics data
  }
}`,
      testCases: [
        'Generates unique short URLs',
        'Redirects correctly',
        'Custom aliases work',
        'Analytics tracking works',
        'Handles expiration',
        'Collision handling'
      ],
      scalabilityConsiderations: [
        'Use base62 encoding for short URLs',
        'Implement distributed ID generation',
        'Cache popular URLs',
        'Use CDN for redirects',
        'Partition data by hash'
      ]
    }
  ],
  
  hard: [
    {
      id: 'distributed-cache',
      title: 'Distributed Cache System',
      difficulty: 'Hard',
      companies: ['Google', 'Facebook', 'Amazon', 'Netflix'],
      category: 'Distributed Systems',
      description: 'Design a distributed cache system like Redis/Memcached with replication and consistency.',
      requirements: [
        'Consistent hashing',
        'Replication for fault tolerance',
        'Cache invalidation strategies',
        'Eventual consistency',
        'Partition tolerance',
        'High throughput'
      ],
      starterCode: `class ConsistentHashing {
  constructor(nodes, virtualNodes = 150) {
    this.ring = new Map();
    this.nodes = nodes;
    this.virtualNodes = virtualNodes;
    this.initialize();
  }
  
  initialize() {
    // Initialize hash ring
  }
  
  addNode(node) {
    // Add node to ring
  }
  
  removeNode(node) {
    // Remove node from ring
  }
  
  getNode(key) {
    // Find node for key
  }
}

class DistributedCache {
  constructor(nodes) {
    this.hashRing = new ConsistentHashing(nodes);
    this.caches = new Map(); // nodeId -> cache
    this.replicationFactor = 3;
  }
  
  get(key) {
    // Get from distributed cache
  }
  
  put(key, value) {
    // Put in distributed cache with replication
  }
  
  replicate(key, value, nodes) {
    // Replicate to multiple nodes
  }
  
  handleNodeFailure(nodeId) {
    // Handle node failure
  }
}`,
      testCases: [
        'Consistent hashing works',
        'Replication works correctly',
        'Handles node failures',
        'Load balancing is even',
        'Cache invalidation works',
        'High throughput'
      ],
      scalabilityConsiderations: [
        'Use virtual nodes for better distribution',
        'Implement read-through and write-through caching',
        'Use gossip protocol for node discovery',
        'Implement vector clocks for consistency',
        'Use bloom filters for existence checks'
      ]
    },
    {
      id: 'message-queue',
      title: 'Distributed Message Queue',
      difficulty: 'Hard',
      companies: ['Amazon', 'Kafka', 'RabbitMQ'],
      category: 'Distributed Systems',
      description: 'Design a distributed message queue system like Kafka/RabbitMQ.',
      requirements: [
        'Publish-subscribe pattern',
        'Message persistence',
        'Ordering guarantees',
        'At-least-once delivery',
        'Consumer groups',
        'High throughput'
      ],
      starterCode: `class Message {
  constructor(id, topic, data, timestamp) {
    this.id = id;
    this.topic = topic;
    this.data = data;
    this.timestamp = timestamp;
  }
}

class Topic {
  constructor(name, partitions = 3) {
    this.name = name;
    this.partitions = Array(partitions).fill(null).map(() => []);
    this.subscribers = [];
  }
  
  publish(message) {
    // Publish to partition
  }
  
  subscribe(consumer) {
    // Add subscriber
  }
}

class MessageQueue {
  constructor() {
    this.topics = new Map();
    this.consumers = new Map();
  }
  
  createTopic(name, partitions) {
    // Create topic
  }
  
  publish(topic, message) {
    // Publish message
  }
  
  subscribe(topic, consumerId, callback) {
    // Subscribe to topic
  }
  
  acknowledge(messageId) {
    // Acknowledge message delivery
  }
}`,
      testCases: [
        'Messages are delivered',
        'Ordering is maintained',
        'Handles failures gracefully',
        'Consumer groups work',
        'Persistence works',
        'High throughput'
      ]
    },
    {
      id: 'search-engine',
      title: 'Distributed Search Engine',
      difficulty: 'Hard',
      companies: ['Google', 'Elasticsearch', 'Amazon'],
      category: 'Search Systems',
      description: 'Design a distributed search engine with indexing and ranking.',
      requirements: [
        'Inverted index',
        'TF-IDF ranking',
        'Distributed indexing',
        'Query processing',
        'Autocomplete',
        'Fuzzy search'
      ],
      starterCode: `class InvertedIndex {
  constructor() {
    this.index = new Map(); // term -> [docId, positions]
  }
  
  addDocument(docId, content) {
    // Build inverted index
  }
  
  search(query) {
    // Search documents
  }
  
  calculateTFIDF(term, docId) {
    // Calculate TF-IDF score
  }
}

class SearchEngine {
  constructor() {
    this.index = new InvertedIndex();
    this.documents = new Map();
  }
  
  indexDocument(docId, content) {
    // Index document
  }
  
  search(query, limit = 10) {
    // Search and rank results
  }
  
  autocomplete(prefix) {
    // Autocomplete suggestions
  }
  
  fuzzySearch(query) {
    // Fuzzy search implementation
  }
}`,
      testCases: [
        'Indexing works correctly',
        'Search returns relevant results',
        'Ranking is accurate',
        'Autocomplete works',
        'Fuzzy search works',
        'Handles large datasets'
      ]
    }
  ]
};

export const lldCategories = [
  'Object-Oriented Design',
  'Scalable Systems',
  'Caching Systems',
  'Distributed Systems',
  'Search Systems',
  'Database Design',
  'API Design'
];

export const lldCompanies = [
  'Google', 'Amazon', 'Microsoft', 'Facebook', 'Netflix',
  'Uber', 'Airbnb', 'Twitter', 'LinkedIn', 'Dropbox'
];
