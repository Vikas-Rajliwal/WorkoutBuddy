//index.js

import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import userRoute from "./routes/users.js";
import authRoute from "./routes/auth.js";
import entryRoute from "./routes/entries.js";
import routineRoute from "./routes/routines.js";
import mealRoute from "./routes/meals.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 8000;

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.use(cookieParser());
app.use(express.json());
app.use(helmet());

app.use(cors({
  origin: "https://workout-buddy-vikas-projects-29e8e67d.vercel.app", // Allow only this specific frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // If you are using cookies or authentication
}));
// app.use(cors({
//   origin: '*', // This allows all domains
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use(morgan("common"));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/entries", entryRoute);
app.use("/api/routines", routineRoute);
app.use("/api/meals", mealRoute);

app.listen(PORT, () => {
  console.log(`port is ${PORT}`);
  connect();
});
