require("dotenv").config();


process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://taskflex-1.onrender.com"
  ],
  credentials: true
}));
app.use(express.json({ limit: "1mb" }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
}));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Team Task Manager API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  res.status(500).json({ message: "Unexpected server error", error: error.message });
});

const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is required");
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is required");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
  console.error("FULL ERROR BELOW:");
  console.error(error);
  process.exit(1);
}
};

startServer();
