import mongoose from "mongoose";

export const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.PASSWORD_MONGO}@cluster0.pdigbzn.mongodb.net/ecommerce?retryWrites=true&w=majority`;

export const initMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("La base de datos está corriendo");
  } catch (error) {}
};
