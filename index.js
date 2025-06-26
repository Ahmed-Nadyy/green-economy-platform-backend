const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const sequelize = require("./config/database");

// Import models
const models = require("./models");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Auth routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/v1/auth", authRoutes);

// Admin management routes
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/v1/admins", adminRoutes);

// Job request routes
const jobRequestRoutes = require("./routes/jobRequestRoutes");
app.use("/api/v1/job-requests", jobRequestRoutes);

// Gallery routes
const galleryRoutes = require("./routes/galleryRoutes");
app.use("/api/v1/gallery", galleryRoutes);

// Crop routes
const cropRoutes = require("./routes/cropRoutes");
app.use("/api/v1/crops", cropRoutes);

// Article routes
const articleRoutes = require("./routes/articleRoutes");
app.use("/api/v1/articles", articleRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// Database sync
const PORT = process.env.PORT || 5001;

// Set up model associations
// Object.keys(models).forEach((modelName) => {
//   if (models[modelName].associate) {
//     models[modelName].associate(models);
//   }
// });

sequelize
  // .sync({ alter: true })
  .sync({})
  .then(() => {
    console.log("Sequelize sync completed");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Sequelize sync failed:", err);
  });
