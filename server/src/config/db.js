import mongoose from 'mongoose';

// Disable Mongoose command buffering so queries do not hang for 10 seconds if MongoDB is offline
mongoose.set('bufferCommands', false);

let isMongoDBConnected = false;

export const isDBConnected = () => isMongoDBConnected && mongoose.connection.readyState === 1;

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agricycle',
      { serverSelectionTimeoutMS: 2000 }
    );
    isMongoDBConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isMongoDBConnected = false;
    console.warn(`⚠️ Local MongoDB offline (${error.message}). Using resilient in-memory database.`);
  }
};

export default connectDB;

