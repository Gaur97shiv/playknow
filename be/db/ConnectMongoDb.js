import mongoose from "mongoose";

const ConnectMongoDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.Mongo_URI);
    console.log(`MongoDb connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default ConnectMongoDb;
