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
    const mediaItem = await Media.findByPk(1);
    
    if (!mediaItem) {
      return res.status(404).json({ message: "Media item not found" });
    }

    await mediaItem.update(req.body); // هذا يحدث السجل مباشرة

    res.json(mediaItem); // رجّع العنصر المحدث
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports = {
// MediaItems    
  getMediaItems,
  updateMediaItems,
};
