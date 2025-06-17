const JobRequest = require("../models/JobRequestModel");
const bcrypt = require("bcryptjs");

// Get all job requests with basic info
const getAllJobRequests = async (req, res) => {
  try {
    const jobRequests = await JobRequest.findAll({
      // attributes: ["id", "fullName", "email", "role", "phoneNumber"],
    });
    res.json(jobRequests);
  } catch (error) {
    console.error("Error fetching job requests:", error);
    res.status(500).json({ message: "Failed to fetch job requests" });
  }
};

// Get job request by ID with all data
const getJobRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const jobRequest = await JobRequest.findByPk(id);

    if (!jobRequest) {
      return res.status(404).json({ message: "Job request not found" });
    }

    res.json(jobRequest);
  } catch (error) {
    console.error("Error fetching job request:", error);
    res.status(500).json({ message: "Failed to fetch job request" });
  }
};

// Create new job request
const createJobRequest = async (req, res) => {
  try {
    const { fullName, email, role, phoneNumber, qualification, experience } =
      req.body;

    // Validate phone number format
    const phoneRegex = /^(\+20|0)?1[0125][0-9]{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        message: "Please enter a valid Egyptian phone number",
        details:
          "Phone number should start with +20 or 0 followed by 1, 0, 1, 2, or 5 and 8 digits",
      });
    }

    // Format phone number to standard format (+20XXXXXXXXXX)
    const formattedPhone = phoneNumber.startsWith("+20")
      ? phoneNumber
      : phoneNumber.startsWith("0")
      ? "+20" + phoneNumber.slice(1)
      : "+20" + phoneNumber;

    // Check if email already exists
    const existingRequest = await JobRequest.findOne({ where: { email } });
    if (existingRequest) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create job request
    const jobRequest = await JobRequest.create({
      fullName,
      email,
      role,
      phoneNumber: formattedPhone,
      qualification,
      experience,
    });

    res.status(201).json({
      message: "Job request submitted successfully",
      jobRequest: {
        id: jobRequest.id,
        fullName: jobRequest.fullName,
        email: jobRequest.email,
        role: jobRequest.role,
        phoneNumber: jobRequest.phoneNumber,
        qualification: jobRequest.qualification,
        experience: jobRequest.experience,
      },
    });
  } catch (error) {
    console.error("Error creating job request:", error);

    // Handle validation errors
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Validation error",
        details: error.errors.map((err) => err.message),
      });
    }

    res.status(500).json({ message: "Failed to create job request" });
  }
};

module.exports = {
  getAllJobRequests,
  getJobRequestById,
  createJobRequest,
};
