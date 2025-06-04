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
      cultivation,
      diseases,
      economics,
      environment,
      fertilization,
      irrigation,
      locationSuitability,
    } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/crop/${req.file.filename}`;
    }

    const result = await sequelize.transaction(async (t) => {
      const relatedRecords = {};

      if (cultivation) relatedRecords.cultivation = await Cultivation.create(cultivation, { transaction: t });
      if (diseases) relatedRecords.diseases = await Diseases.create(diseases, { transaction: t });
      if (economics) relatedRecords.economics = await Economics.create(economics, { transaction: t });
      if (environment) relatedRecords.environment = await Environment.create(environment, { transaction: t });
      if (fertilization) relatedRecords.fertilization = await Fertilization.create(fertilization, { transaction: t });
      if (irrigation) relatedRecords.irrigation = await Irrigation.create(irrigation, { transaction: t });
      if (locationSuitability) relatedRecords.locationSuitability = await LocationSuitability.create(locationSuitability, { transaction: t });

      const crop = await Crop.create({
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
        cultivationId: relatedRecords.cultivation?.id,
        diseasesId: relatedRecords.diseases?.id,
        economicsId: relatedRecords.economics?.id,
        environmentId: relatedRecords.environment?.id,
        fertilizationId: relatedRecords.fertilization?.id,
        irrigationId: relatedRecords.irrigation?.id,
        locationSuitabilityId: relatedRecords.locationSuitability?.id,
      }, { transaction: t });

      const completeCrop = await Crop.findByPk(crop.id, {
        include: [
          { model: Cultivation, as: 'cultivation', required: false },
          { model: Diseases, as: 'diseases', required: false },
          { model: Economics, as: 'economics', required: false },
          { model: Environment, as: 'environment', required: false },
          { model: Fertilization, as: 'fertilization', required: false },
          { model: Irrigation, as: 'irrigation', required: false },
          { model: LocationSuitability, as: 'locationSuitability', required: false },
        ],
        transaction: t,
      });

      return completeCrop;
    });

    res.status(201).json(result);
  } catch (error) {
    if (req.file) {
      deleteImageFile(`/uploads/crop/${req.file.filename}`);
    }
    res.status(400).json({ message: error.message });
  }
};

// Update crop and its related data (fully replacing related records)
const updateCrop = async (req, res) => {
  try {
    const cropId = req.params.id;
    const {
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
      cultivation,
      diseases,
      economics,
      environment,
      fertilization,
      irrigation,
      locationSuitability,
    } = req.body;

    const result = await sequelize.transaction(async (t) => {
      const crop = await Crop.findByPk(cropId, {
        include: [
          { model: Cultivation, as: 'cultivation' },
          { model: Diseases, as: 'diseases' },
          { model: Economics, as: 'economics' },
          { model: Environment, as: 'environment' },
          { model: Fertilization, as: 'fertilization' },
          { model: Irrigation, as: 'irrigation' },
          { model: LocationSuitability, as: 'locationSuitability' },
        ],
        transaction: t,
      });

      if (!crop) throw new Error("Crop not found");

      if (req.file) {
        deleteImageFile(crop.imageUrl);
        crop.imageUrl = `/uploads/crop/${req.file.filename}`;
      }

      const updates = {};

      if (cultivation) {
        if (crop.cultivationId) {
          await Cultivation.destroy({ where: { id: crop.cultivationId }, transaction: t });
        }
        const newCultivation = await Cultivation.create(cultivation, { transaction: t });
        updates.cultivationId = newCultivation.id;
      }

      if (diseases) {
        if (crop.diseasesId) {
          await Diseases.destroy({ where: { id: crop.diseasesId }, transaction: t });
        }
        const newDiseases = await Diseases.create(diseases, { transaction: t });
        updates.diseasesId = newDiseases.id;
      }

      if (economics) {
        if (crop.economicsId) {
          await Economics.destroy({ where: { id: crop.economicsId }, transaction: t });
        }
        const newEconomics = await Economics.create(economics, { transaction: t });
        updates.economicsId = newEconomics.id;
      }

      if (environment) {
        if (crop.environmentId) {
          await Environment.destroy({ where: { id: crop.environmentId }, transaction: t });
        }
        const newEnvironment = await Environment.create(environment, { transaction: t });
        updates.environmentId = newEnvironment.id;
      }

      if (fertilization) {
        if (crop.fertilizationId) {
          await Fertilization.destroy({ where: { id: crop.fertilizationId }, transaction: t });
        }
        const newFertilization = await Fertilization.create(fertilization, { transaction: t });
        updates.fertilizationId = newFertilization.id;
      }

      if (irrigation) {
        if (crop.irrigationId) {
          await Irrigation.destroy({ where: { id: crop.irrigationId }, transaction: t });
        }
        const newIrrigation = await Irrigation.create(irrigation, { transaction: t });
        updates.irrigationId = newIrrigation.id;
      }

      if (locationSuitability) {
        if (crop.locationSuitabilityId) {
          await LocationSuitability.destroy({ where: { id: crop.locationSuitabilityId }, transaction: t });
        }
        const newLocation = await LocationSuitability.create(locationSuitability, { transaction: t });
        updates.locationSuitabilityId = newLocation.id;
      }

      await crop.update({
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
        imageUrl: crop.imageUrl,
        ...updates,
      }, { transaction: t });

      const updatedCrop = await Crop.findByPk(cropId, {
        include: [
          { model: Cultivation, as: 'cultivation', required: false },
          { model: Diseases, as: 'diseases', required: false },
          { model: Economics, as: 'economics', required: false },
          { model: Environment, as: 'environment', required: false },
          { model: Fertilization, as: 'fertilization', required: false },
          { model: Irrigation, as: 'irrigation', required: false },
          { model: LocationSuitability, as: 'locationSuitability', required: false },
        ],
        transaction: t,
      });

      return updatedCrop;
    });

    res.json(result);
  } catch (error) {
    if (req.file) {
      deleteImageFile(`/uploads/crop/${req.file.filename}`);
    }
    res.status(400).json({ message: error.message });
  }
};

// Get Crop by ID
const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findByPk(req.params.id, {
      include: [
        { model: Cultivation, as: 'cultivation', required: false },
        { model: Diseases, as: 'diseases', required: false },
        { model: Economics, as: 'economics', required: false },
        { model: Environment, as: 'environment', required: false },
        { model: Fertilization, as: 'fertilization', required: false },
        { model: Irrigation, as: 'irrigation', required: false },
        { model: LocationSuitability, as: 'locationSuitability', required: false },
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
        { model: Cultivation, as: 'cultivation', required: false },
        { model: Diseases, as: 'diseases', required: false },
        { model: Economics, as: 'economics', required: false },
        { model: Environment, as: 'environment', required: false },
        { model: Fertilization, as: 'fertilization', required: false },
        { model: Irrigation, as: 'irrigation', required: false },
        { model: LocationSuitability, as: 'locationSuitability', required: false },
      ],
    });
    res.json(crops);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Crop
const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findByPk(req.params.id, {
      include: [
        { model: Cultivation, as: 'cultivation' },
        { model: Diseases, as: 'diseases' },
        { model: Economics, as: 'economics' },
        { model: Environment, as: 'environment' },
        { model: Fertilization, as: 'fertilization' },
        { model: Irrigation, as: 'irrigation' },
        { model: LocationSuitability, as: 'locationSuitability' },
      ],
    });

    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    await sequelize.transaction(async (t) => {
      if (crop.cultivationId) await Cultivation.destroy({ where: { id: crop.cultivationId }, transaction: t });
      if (crop.diseasesId) await Diseases.destroy({ where: { id: crop.diseasesId }, transaction: t });
      if (crop.economicsId) await Economics.destroy({ where: { id: crop.economicsId }, transaction: t });
      if (crop.environmentId) await Environment.destroy({ where: { id: crop.environmentId }, transaction: t });
      if (crop.fertilizationId) await Fertilization.destroy({ where: { id: crop.fertilizationId }, transaction: t });
      if (crop.irrigationId) await Irrigation.destroy({ where: { id: crop.irrigationId }, transaction: t });
      if (crop.locationSuitabilityId) await LocationSuitability.destroy({ where: { id: crop.locationSuitabilityId }, transaction: t });

      deleteImageFile(crop.imageUrl);
      await crop.destroy({ transaction: t });
    });

    res.json({ message: "Crop and all related data deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createCrop,
  updateCrop,
  getCropById,
  getAllCrops,
  deleteCrop,
};