const Crop = require("../models/CropModel");
const path = require("path");
const fs = require("fs");


// Helper function to delete image file
const deleteImageFile = (imageUrl) => {
    if (imageUrl) {
      const imagePath = path.join(__dirname, "..", imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
  };
  
  // Create a new crop
  const createCrop = async (req, res) => {
    try {
      const cropData = { ...req.body };
  
      // Handle image upload
      if (req.file) {
        cropData.imageUrl = `/uploads/crop/${req.file.filename}`;
      }
  
      const crop = await Crop.create(cropData);
      res.status(201).json(crop);
    } catch (error) {
      // If crop creation fails, delete the uploaded image
      if (req.file) {
        deleteImageFile(`/uploads/crop/${req.file.filename}`);
      }
      res.status(400).json({ message: error.message });
    }
  };
  
  // Update crop by ID
  const updateCrop = async (req, res) => {
    try {
      const crop = await Crop.findByPk(req.params.id);
      if (!crop) {
        return res.status(404).json({ message: "Crop not found" });
      }
  
      const updateData = { ...req.body };
  
      // Handle image upload
      if (req.file) {
        // Delete old image if it exists
        deleteImageFile(crop.imageUrl);
        updateData.imageUrl = `/uploads/crop/${req.file.filename}`;
      }
  
      await crop.update(updateData);
      res.json(crop);
    } catch (error) {
      // If update fails, delete the newly uploaded image
      if (req.file) {
        deleteImageFile(`/uploads/article/${req.file.filename}`);
      }
      res.status(400).json({ message: error.message });
    }
  };

  // Get Crop by ID with all data
  const getCropById = async (req, res) => {
    try {
      const crop = await Crop.findByPk(req.params.id);
      if (!crop) {
        return res.status(404).json({ message: "Crop not found" });
      }
      res.json(crop);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  // Get All Crops Founded
  const getAllCrops = async (req,res) => {
    try {
      const crops = await Crop.findAll();
      if(!crops) {
        return res.status(404).json({ message: "Error To Fetch Crops"});
      }
      res.json(crops);
    } catch (error) {
      res.status(400).json({ message: error.message});
    }
  }

  // Delete crop by ID
  const deleteCrop = async (req, res) => {
    try {
      const crop = await Crop.findByPk(req.params.id);
      if (!crop) {
        return res.status(404).json({ message: "Crop not found" });
      }
  
      // Delete the image file before deleting the article
      deleteImageFile(crop.imageUrl);
  
      await crop.destroy();
      res.json({ message: "Crop deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  module.exports = {
    createCrop,
    updateCrop,
    getCropById,
    deleteCrop,
    getAllCrops,
  };
  