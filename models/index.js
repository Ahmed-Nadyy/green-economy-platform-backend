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

Crop.hasOne(Cultivation);
Cultivation.belongsTo(Crop);
Crop.hasOne(Diseases);
Diseases.belongsTo(Crop);
Crop.hasOne(Economics);
Economics.belongsTo(Crop);
Crop.hasOne(Environment);
Environment.belongsTo(Crop);
Crop.hasOne(Fertilization);
Fertilization.belongsTo(Crop);
Crop.hasOne(Irrigation);
Irrigation.belongsTo(Crop);
Crop.hasOne(LocationSuitability);
LocationSuitability.belongsTo(Crop);

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
};
