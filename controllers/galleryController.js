const Gallery = require("../models/GalleryModel");
const fs = require("fs").promises;
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
// Helper function to validate file type
const validateFileType = (file, expectedType) => {
  const imageTypes = ["image/jpeg", "image/png", "image/gif"];
  const videoTypes = ["video/mp4", "video/quicktime"];

  if (expectedType === "image") {
    return imageTypes.includes(file.mimetype);
  } else if (expectedType === "video") {
    return videoTypes.includes(file.mimetype);
  }
  return false;
};

// Create new gallery item
const createGalleryItem = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { type } = req.body;
    if (!type || !["image", "video"].includes(type)) {
      return res
        .status(400)
        .json({ message: "Invalid type. Must be 'image' or 'video'" });
    }

    // Validate file type matches the specified type
    if (!validateFileType(req.file, type)) {
      // Delete the uploaded file if type doesn't match
      await fs.unlink(req.file.path);
      return res.status(400).json({
        message: `Invalid file type. Expected ${type} but got ${req.file.mimetype}`,
      });
    }

    // Create URL for the file
    const fileUrl = `${req.protocol}://${req.get(
      "host"
    )}/uploads/gallery/${path.basename(req.file.path)}`;

    const galleryItem = await Gallery.create({
      url: fileUrl,
      type,
    });

    res.status(201).json({
      message: "Gallery item created successfully",
      galleryItem,
    });
  } catch (error) {
    console.error("Error creating gallery item:", error);
    // Delete the file if there's an error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError);
      }
    }
    res.status(500).json({ message: "Failed to create gallery item" });
  }
};

// Get all gallery items
const getAllGalleryItems = async (req, res) => {
  try {
    const galleryItems = await Gallery.findAll();
    res.json(galleryItems);
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    res.status(500).json({ message: "Failed to fetch gallery items" });
  }
};

// Delete gallery item
const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const galleryItem = await Gallery.findByPk(id);

    if (!galleryItem) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    // Extract filename from URL and delete the file
    const filename = path.basename(galleryItem.url);
    const filePath = path.join(__dirname, "../uploads/gallery", filename);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error("Error deleting file:", error);
    }

    // Delete the database record
    await galleryItem.destroy();

    res.json({ message: "Gallery item deleted successfully" });
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    res.status(500).json({ message: "Failed to delete gallery item" });
  }
};

module.exports = {
  createGalleryItem,
  getAllGalleryItems,
  deleteGalleryItem,
};
