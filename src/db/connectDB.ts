import mongoose from "mongoose";

export default async function connectDB(): Promise<typeof mongoose> {

    const MONGO_URI = process.env.DATABASE_URL;
    const DB_NAME = process.env.DB_NAME;

    if (!MONGO_URI) {
      throw new Error("DATABASE_URL environment variable is not defined!");
    }
    
    let isConnected: boolean = false;

    if (isConnected) {
      console.log("Using existing database connection!");
      return mongoose;
    }

    try {

      const db = await mongoose.connect(`${MONGO_URI}/${DB_NAME}`); 

      isConnected = !!db.connections[0].readyState;

      console.log("Database connected!");  
      
      return db;

    } catch (error) {

      console.error("MongoDB connection error:", error);

      throw new Error("Failed to connect to the database");
      
    }
}