const express = require("express");
const router = express.Router();
const {
  getAllJobRequests,
  getJobRequestById,
  createJobRequest,
  deleteJobRequest,
} = require("../controllers/jobRequestController");

router.get("/", getAllJobRequests);
router.get("/:id", getJobRequestById);
router.post("/", createJobRequest);
router.delete("/:id", deleteJobRequest);

module.exports = router;
