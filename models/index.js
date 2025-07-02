const Admin = require("./AdminModel");
const Gallery = require("./GalleryModel");
const JobRequest = require("./JobRequestModel");
const Article = require("./ArticleModel");
const Crop = require("./CropModel");
const Cultivation = require("./CultivationModel");
const Diseases = require("./DiseasesModel");
const Economics = require("./EconomicsModel");
const Environment = require("./EnvironmentModel");
const Fertilization = require("./FertilizationModel");
const Irrigation = require("./IrrigationModel");
const LocationSuitability = require("./LocationSuitabilityModel");
const Partner = require("./PartnerModel");
const Media = require("./MediaModel");
const Background = require("./BackgroundModel");

// Crop belongsTo Cultivation (Crop has cultivationId)
Crop.belongsTo(Cultivation, { 
  foreignKey: 'cultivationId',
  as: 'cultivation'
});
Cultivation.hasOne(Crop, {
  foreignKey: 'cultivationId',
  as: 'crop'
});

Crop.belongsTo(Diseases, { 
  foreignKey: 'diseasesId',
  as: 'diseases'
});
Diseases.hasOne(Crop, {
  foreignKey: 'diseasesId',
  as: 'crop'
});

Crop.belongsTo(Economics, { 
  foreignKey: 'economicsId',
  as: 'economics'
});
Economics.hasOne(Crop, {
  foreignKey: 'economicsId',
  as: 'crop'
});

Crop.belongsTo(Environment, { 
  foreignKey: 'environmentId',
  as: 'environment'
});
Environment.hasOne(Crop, {
  foreignKey: 'environmentId',
  as: 'crop'
});

Crop.belongsTo(Fertilization, { 
  foreignKey: 'fertilizationId',
  as: 'fertilization'
});
Fertilization.hasOne(Crop, {
  foreignKey: 'fertilizationId',
  as: 'crop'
});

Crop.belongsTo(Irrigation, { 
  foreignKey: 'irrigationId',
  as: 'irrigation'
});
Irrigation.hasOne(Crop, {
  foreignKey: 'irrigationId',
  as: 'crop'
});

Crop.belongsTo(LocationSuitability, { 
  foreignKey: 'locationSuitabilityId',
  as: 'locationSuitability'
});
LocationSuitability.hasOne(Crop, {
  foreignKey: 'locationSuitabilityId',
  as: 'crop'
});

module.exports = {
  Admin,
  JobRequest,
  Gallery,
  Crop,
  Article,
  Cultivation,
  Irrigation,
  Economics,
  Environment,
  Diseases,
  Fertilization,
  LocationSuitability,
  Partner,
  Media,
  Background, 
};