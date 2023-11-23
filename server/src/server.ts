import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import { connectToDB } from "./utils/db";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";

const app = express();

dotenv.config({
  path: "./.env.local",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(cookieParser());

app.get("/", (req: express.Request, res: express.Response) => {
  try {
    res.send("Hello");
  } catch (error: any) {
    console.log(error);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

connectToDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`We are live at port - ${process.env.PORT}`);
  });
});
