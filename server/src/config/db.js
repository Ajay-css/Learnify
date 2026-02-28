import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.error("DB Error: No connection string provided (MONGO_URI or MONGODB_URI)");
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
      connectTimeoutMS: 10000,       // Connection timeout after 10s
    });
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("DB Connection Failure:", error.message);
  }
};


export default connectDB;