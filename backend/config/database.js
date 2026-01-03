const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Set connection timeout and other options
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codex-playground', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 5, // Maintain a minimum of 5 socket connections
    });

    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

    return true; // Connection successful

  } catch (error) {
    console.error('Database connection error:', error);
    console.log('⚠️  Running without database connection - some features may not work');
    console.log('⚠️  Authentication will work with JWT tokens only');
    
    // Don't exit in development mode, allow app to run without DB
    if (process.env.NODE_ENV === 'production') {
      console.log('Production mode: Retrying database connection in 10 seconds...');
      setTimeout(() => connectDB(), 10000);
    }
    
    return false; // Connection failed
  }
};

// Check if MongoDB is available
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = { connectDB, isMongoConnected };