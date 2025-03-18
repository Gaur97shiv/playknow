import mongoose from "mongoose";

const ConnectMongoDb = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://munendrashiv97:LQqr0hpvVgImu7Ql@playknow.yg0rt.mongodb.net/?retryWrites=true&w=majority&appName=playknow");
    console.log(`MongoDb connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default ConnectMongoDb;
