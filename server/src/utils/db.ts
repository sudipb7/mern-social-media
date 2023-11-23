import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    const uri = process.env.DB_URL as string;
    await mongoose.connect(uri);
    console.log("DB connected");
  } catch (error: any) {
    console.log("DB not connected", error);
  }
};
