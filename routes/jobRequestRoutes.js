const express = require("express");
const router = express.Router();
const {
  getAllJobRequests,
  getJobRequestById,
  createJobRequest,
} = require("../controllers/jobRequestController");

// Job request routes
router.get("/", getAllJobRequests);
router.get("/:id", getJobRequestById);
router.post("/", createJobRequest);

module.exports = router;
