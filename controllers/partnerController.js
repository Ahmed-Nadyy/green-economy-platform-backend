const Partner = require("../models/PartnerModel");
const path = require("path");
const fs = require("fs");

const deleteImageFile = (imageUrl) => {
  if (imageUrl) {
    const imagePath = path.join(__dirname, "..", imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
};

// Create new Partner
const createPartner = async (req, res) => {
  try {
    const PartnerData = { ...req.body };

    // Handle image upload
    if (req.file) {
      PartnerData.imageUrl = `/uploads/partner/${req.file.filename}`;
    }

    const partner = await Partner.create(PartnerData);
    res.status(201).json(partner);
  } catch (error) {
    if (req.file) {
      deleteImageFile(`/uploads/partner/${req.file.filename}`);
    }
    res.status(400).json({ message: error.message });
  }
};

// update Partner
const updatePartner = async (req, res) => {
  try {
    const partner = await Partner.findByPk(req.params.id);
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    const updateData = { ...req.body };

    // Handle image upload
    if (req.file) {
      // Delete old image if it exists
      deleteImageFile(partner.imageUrl);
      updateData.imageUrl = `/uploads/partner/${req.file.filename}`;
    }

    await partner.update(updateData);
    res.json(partner);
  } catch (error) {
    // If update fails, delete the newly uploaded image
    if (req.file) {
      deleteImageFile(`/uploads/partner/${req.file.filename}`);
    }
    res.status(400).json({ message: error.message });
  }
};

// Get articles by subType with specific fields
const getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.findAll();
    res.json(partners);
  } catch (error) {
    console.error("Error fetching Partners:", error);
    res.status(500).json({ message: "Failed to fetch Partners" });
  }
};

// Get article by ID with all data
const getPartnerById = async (req, res) => {
  try {
    const partner = await Partner.findByPk(req.params.id);
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    res.json(partner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete article by ID
const deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findByPk(req.params.id);
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    // Delete the image file before deleting the partner
    deleteImageFile(partner.imageUrl);

    await partner.destroy();
    res.json({ message: "Partner deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createPartner,
  updatePartner,
  getAllPartners,
  getPartnerById,
  deletePartner,
};
