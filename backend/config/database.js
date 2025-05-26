import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      // process.env.MONGODB_URI ||
      //   "mongodb+srv://colt:RandomPassword@cluster0.hjdz7sb.mongodb.net/eco-options-data",
      "mongodb+srv://colt:RandomPassword@cluster0.hjdz7sb.mongodb.net/eco-options-data",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
