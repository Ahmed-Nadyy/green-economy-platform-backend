const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const sequelize = require("./config/database");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Auth routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Admin management routes
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admins", adminRoutes);

// Job request routes
const jobRequestRoutes = require("./routes/jobRequestRoutes");
app.use("/api/job-requests", jobRequestRoutes);

// Gallery routes
const galleryRoutes = require("./routes/galleryRoutes");
app.use("/api/gallery", galleryRoutes);

// Crop routes
const cropRoutes = require("./routes/cropRoutes");
app.use("/api/crops", cropRoutes);

// Article routes
const articleRoutes = require("./routes/articleRoutes");
app.use("/api/articles", articleRoutes);

// Example: user routes
// const userRoutes = require('./routes/user.routes');
// app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// Database sync
const PORT = process.env.PORT || 5000;

sequelize
  .sync({ alter: true })
  // .sync({ force: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`The Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log(err));
