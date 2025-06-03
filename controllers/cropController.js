const Crop = require("../models/CropModel");
const Cultivation = require("../models/CultivationModel");
const Diseases = require("../models/DiseasesModel");
const Economics = require("../models/EconomicsModel");
const Environment = require("../models/EnvironmentModel");
const Fertilization = require("../models/FertilizationModel");
const Irrigation = require("../models/IrrigationModel");
const LocationSuitability = require("../models/LocationSuitabilityModel");
const sequelize = require("../config/database");
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

// Create a new crop with all related data
const createCrop = async (req, res) => {
  try {
    const {
      // Crop data
      name,
      arabicName,
      type,
      arabicType,
      season,
      arabicSeason,
      description,
      arabicDescription,
      growthPeriod,
      arabicGrowthPeriod,
      // Related data
      cultivation,
      diseases,
      economics,
      environment,
      fertilization,
      irrigation,
      locationSuitability,
    } = req.body;

    // Handle image upload
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/crop/${req.file.filename}`;
    }

    // Create crop with transaction to ensure data consistency
    const result = await sequelize.transaction(async (t) => {
      // Create the crop
      const crop = await Crop.create(
        {
          name,
          arabicName,
          type,
          arabicType,
          imageUrl,
          season,
          arabicSeason,
          description,
          arabicDescription,
          growthPeriod,
          arabicGrowthPeriod,
        },
        { transaction: t }
      );

      // Create related data if provided
      if (cultivation) {
        await Cultivation.create(
          { ...cultivation, CropId: crop.id },
          { transaction: t }
        );
      }
      if (diseases) {
        await Diseases.create(
          { ...diseases, CropId: crop.id },
          { transaction: t }
        );
      }
      if (economics) {
        await Economics.create(
          { ...economics, CropId: crop.id },
          { transaction: t }
        );
      }
      if (environment) {
        await Environment.create(
          { ...environment, CropId: crop.id },
          { transaction: t }
        );
      }
      if (fertilization) {
        await Fertilization.create(
          { ...fertilization, CropId: crop.id },
          { transaction: t }
        );
      }
      if (irrigation) {
        await Irrigation.create(
          { ...irrigation, CropId: crop.id },
          { transaction: t }
        );
      }
      if (locationSuitability) {
        await LocationSuitability.create(
          { ...locationSuitability, CropId: crop.id },
          { transaction: t }
        );
      }

      // Fetch the complete crop with all related data
      const completeCrop = await Crop.findByPk(crop.id, {
        include: [
          { model: Cultivation },
          { model: Diseases },
          { model: Economics },
          { model: Environment },
          { model: Fertilization },
          { model: Irrigation },
          { model: LocationSuitability },
        ],
        transaction: t,
      });

      return completeCrop;
    });

    res.status(201).json(result);
  } catch (error) {
    // If creation fails, delete the uploaded image
    if (req.file) {
      deleteImageFile(`/uploads/crop/${req.file.filename}`);
    }
    res.status(400).json({ message: error.message });
  }
};

// Update crop and its related data
const updateCrop = async (req, res) => {
  try {
    const cropId = req.params.id;
    const {
      // Crop data
      name,
      arabicName,
      type,
      arabicType,
      season,
      arabicSeason,
      description,
      arabicDescription,
      growthPeriod,
      arabicGrowthPeriod,
      // Related data
      cultivation,
      diseases,
      economics,
      environment,
      fertilization,
      irrigation,
      locationSuitability,
    } = req.body;

    const result = await sequelize.transaction(async (t) => {
      // Find the crop
      const crop = await Crop.findByPk(cropId, {
        include: [
          { model: Cultivation },
          { model: Diseases },
          { model: Economics },
          { model: Environment },
          { model: Fertilization },
          { model: Irrigation },
          { model: LocationSuitability },
        ],
        transaction: t,
      });

      if (!crop) {
        throw new Error("Crop not found");
      }

      // Handle image upload
      if (req.file) {
        // Delete old image if it exists
        deleteImageFile(crop.imageUrl);
        crop.imageUrl = `/uploads/crop/${req.file.filename}`;
      }

      // Update crop data
      await crop.update(
        {
          name,
          arabicName,
          type,
          arabicType,
          season,
          arabicSeason,
          description,
          arabicDescription,
          growthPeriod,
          arabicGrowthPeriod,
        },
        { transaction: t }
      );

      // Update related data if provided
      if (cultivation) {
        if (crop.Cultivation) {
          await crop.Cultivation.update(cultivation, { transaction: t });
        } else {
          await Cultivation.create(
            { ...cultivation, CropId: crop.id },
            { transaction: t }
          );
        }
      }

      if (diseases) {
        if (crop.Diseases) {
          await crop.Diseases.update(diseases, { transaction: t });
        } else {
          await Diseases.create(
            { ...diseases, CropId: crop.id },
            { transaction: t }
          );
        }
      }

      if (economics) {
        if (crop.Economics) {
          await crop.Economics.update(economics, { transaction: t });
        } else {
          await Economics.create(
            { ...economics, CropId: crop.id },
            { transaction: t }
          );
        }
      }

      if (environment) {
        if (crop.Environment) {
          await crop.Environment.update(environment, { transaction: t });
        } else {
          await Environment.create(
            { ...environment, CropId: crop.id },
            { transaction: t }
          );
        }
      }

      if (fertilization) {
        if (crop.Fertilization) {
          await crop.Fertilization.update(fertilization, { transaction: t });
        } else {
          await Fertilization.create(
            { ...fertilization, CropId: crop.id },
            { transaction: t }
          );
        }
      }

      if (irrigation) {
        if (crop.Irrigation) {
          await crop.Irrigation.update(irrigation, { transaction: t });
        } else {
          await Irrigation.create(
            { ...irrigation, CropId: crop.id },
            { transaction: t }
          );
        }
      }

      if (locationSuitability) {
        if (crop.LocationSuitability) {
          await crop.LocationSuitability.update(locationSuitability, {
            transaction: t,
          });
        } else {
          await LocationSuitability.create(
            { ...locationSuitability, CropId: crop.id },
            { transaction: t }
          );
        }
      }

      // Fetch the updated crop with all related data
      const updatedCrop = await Crop.findByPk(cropId, {
        include: [
          { model: Cultivation },
          { model: Diseases },
          { model: Economics },
          { model: Environment },
          { model: Fertilization },
          { model: Irrigation },
          { model: LocationSuitability },
        ],
        transaction: t,
      });

      return updatedCrop;
    });

    res.json(result);
  } catch (error) {
    // If update fails, delete the newly uploaded image
    if (req.file) {
      deleteImageFile(`/uploads/crop/${req.file.filename}`);
    }
    res.status(400).json({ message: error.message });
  }
};

// Get Crop by ID with all data
const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findByPk(req.params.id, {
      include: [
        { model: Cultivation },
        { model: Diseases },
        { model: Economics },
        { model: Environment },
        { model: Fertilization },
        { model: Irrigation },
        { model: LocationSuitability },
      ],
    });
    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }
    res.json(crop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Crops
const getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.findAll({
      include: [
        { model: Cultivation },
        { model: Diseases },
        { model: Economics },
        { model: Environment },
        { model: Fertilization },
        { model: Irrigation },
        { model: LocationSuitability },
      ],
    });
    if (!crops) {
      return res.status(404).json({ message: "Error To Fetch Crops" });
    }
    res.json(crops);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete crop by ID
const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findByPk(req.params.id);
    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    // Delete the image file before deleting the crop
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