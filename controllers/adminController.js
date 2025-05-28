const Admin = require("../models/AdminModel");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

// Get all admins with basic info
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll({
      attributes: ["id", "fullName", "email", "job"],
    });
    res.json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ message: "Failed to fetch admins" });
  }
};

// Get admin by ID with all data
const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByPk(id, {
      attributes: { exclude: ["password"] }, // Exclude password from response
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (error) {
    console.error("Error fetching admin:", error);
    res.status(500).json({ message: "Failed to fetch admin" });
  }
};

// Update admin data
const updateAdmin = async (req, res) => {
  let imagePath = null;
  try {
    const { id } = req.params;
    const { fullName, email, password, job, phoneNumber } = req.body;
    const imageFile = req.file;

    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Handle image upload if new image is provided
    if (imageFile) {
      // Delete old image if exists
      if (admin.imageUrl) {
        const oldImagePath = path.join(__dirname, "..", admin.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Save new image
      const uploadDir = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const fileName = `${Date.now()}-${imageFile.originalname}`;
      imagePath = path.join(uploadDir, fileName);
      fs.writeFileSync(imagePath, imageFile.buffer);
    }

    // Update admin data
    const updateData = {
      fullName: fullName || admin.fullName,
      email: email || admin.email,
      job: job || admin.job,
      phoneNumber: phoneNumber || admin.phoneNumber,
      imageUrl: imagePath
        ? `/uploads/${path.basename(imagePath)}`
        : admin.imageUrl,
    };

    // Update password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await admin.update(updateData);

    res.json({
      message: "Admin updated successfully",
      admin: {
        id: admin.id,
        fullName: admin.fullName,
        email: admin.email,
        job: admin.job,
        phoneNumber: admin.phoneNumber,
        imageUrl: admin.imageUrl,
      },
    });
  } catch (error) {
    // Clean up new image if update fails
    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    console.error("Error updating admin:", error);
    res.status(500).json({ message: "Failed to update admin" });
  }
};

// Delete admin
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByPk(id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Delete admin's image if exists
    if (admin.imageUrl) {
      const imagePath = path.join(__dirname, "..", admin.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await admin.destroy();
    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ message: "Failed to delete admin" });
  }
};

module.exports = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
