const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.DATABASE_URL;
    
    if (!mongoURI) {
      console.log('⚠️  No MongoDB URI provided, running in offline mode');
      return false;
    }

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('⚠️  Continuing without database connection');
    return false;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('🍃 MongoDB Disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting from database:', error.message);
  }
};

module.exports = {
  connectDB,
  disconnectDB
};