const Background = require("../models/BackgroundModel");
const Media = require("../models/MediaModel");
const fs = require("fs").promises;
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const validateFileType = (file, expectedType) => {
  const imageTypes = ["image/jpeg", "image/png", "image/gif"];

  if (expectedType === "image") {
    return imageTypes.includes(file.mimetype);
  } 
  return false;
};
///////////////////////////// MediaItems //////////////////////////////////

// Create one MediaItems
const createMediaItems = async (req, res) => {
  try {  
    const MediaItems = await Media.create({
        facebookLink,
        youtubeLink,
        tiktokLink,
        whatsappLink,
        phoneNumber,
        email,
    });

    res.status(201).json({
      message: "Media item created successfully",
      MediaItems,
    });
  } catch (error) {
    console.error("Error creating Media item:", error);
    res.status(500).json({ message: "Failed to create Media item" });
  }
};

//Get First MediaItems
const getMediaItems = async (req, res) => {
  try {
    const mediaItem = await Media.findOne();
    if (mediaItem) {
      res.json(mediaItem);
    } else {
      res.status(404).json({ message: "No media items found" });
    }
  } catch (error) {
    console.error("Error fetching media item:", error);
    res.status(500).json({ message: "Failed to fetch media item" });
  }
};

// Update MediaItems
const updateMediaItems = async (req, res) => {
  try {
    const MediaItems = await Media.findByPk(1);
    if (!MediaItems) {
      return res.status(404).json({ message: "MediaItems not found" });
    }
    const updateData = { ...req.body };
    await Media.update(updateData);
    res.json(MediaItems);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

////////////////////////////////////// Background ////////////////////////////////////////////

const deleteImageFile = (imageUrl) => {
  if (imageUrl) {
    const imagePath = path.join(__dirname, "..", imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
};

const createBackground = async (req, res) => {
  try {
    const backgroundData = { ...req.body };

    // Handle image upload
    if (req.file) {
      backgroundData.imageUrl = `/uploads/background/${req.file.filename}`;
    }

    const background = await Background.create(backgroundData);
    res.status(201).json(background);
  } catch (error) {
    // If article creation fails, delete the uploaded image
    if (req.file) {
      deleteImageFile(`/uploads/background/${req.file.filename}`);
    }
    res.status(400).json({ message: error.message });
  }
};

// update Background

const updateBackground = async (req, res) => {
  try {
    const background = await Background.findByPk(req.params.id);
    if (!background) {
      return res.status(404).json({ message: "Background not found" });
    }

    const updateData = { ...req.body };

    // Handle image upload
    if (req.file) {
      // Delete old image if it exists
      deleteImageFile(background.imageUrl);
      updateData.imageUrl = `/uploads/background/${req.file.filename}`;
    }

    await background.update(updateData);
    res.json(background);
  } catch (error) {
    // If update fails, delete the newly uploaded image
    if (req.file) {
      deleteImageFile(`/uploads/background/${req.file.filename}`);
    }
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
// MediaItems    
  createMediaItems,
  getMediaItems,
  updateMediaItems,
  
// Background  
  createBackground,
  updateBackground,
};
