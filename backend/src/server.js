// src/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// existing route files used by other pages
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const adminRoutes = require("./routes/adminRoutes");


// new query forum routes
const queryForumRoutes = require("./routes/queryForumRoutes");

<<<<<<< HEAD
=======
// 🔔 NEW (Socket.IO extensions)
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
>>>>>>> Company-b1
const app = express();

// middleware
app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// MongoDB connection
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/careerconnect";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error", err));

// health check
app.get("/", (req, res) => {
  res.send("CareerConnect API running");
});

// existing APIs (keep paths same as before so pages still work)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);

// new Query Forum API
app.use("/api/query-forum", queryForumRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


=======
// Routes (UNCHANGED)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/company", require("./routes/companyRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

// Global error handler (UNCHANGED)
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({ message: err.message });
});

// ===============================
// 🔔 SOCKET.IO EXTENSION (SAFE)
// ===============================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Make io available everywhere
app.set("io", io);

io.on("connection", (socket) => {
  // Socket connect/disconnect logs are optional. Enable by setting SOCKET_LOGS=true in .env
  if (process.env.SOCKET_LOGS === "true") {
    console.log("Socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  } else {
    // still attach the disconnect handler but without logging
    socket.on("disconnect", () => {});
  }
});

// Start server (EXTENDED, not changed)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
>>>>>>> Company-b1
