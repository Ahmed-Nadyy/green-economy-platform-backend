const Admin = require("./AdminModel");
const Galary = require("./GalaryModel");
const JobRequest = require("./JobRequestModel");
const Article = require("./ArticleModel");
const Crop = require("./CropModel");
const Cultivation = require("./CultivationModel");
const Diseases = require("./DiseasesModel");
const Economics = require("./EconomicsModel");
const Fertilization = require("./FertilizationModel");
const Irrigation = require("./IrrigationModel");
const LocationSuitability = require("./LocationSuitabilityModel");


Crop.hasOne(Cultivation);
Cultivation.belongsTo(Crop);
Crop.hasOne(Diseases);
Diseases.belongsTo(Crop);
Crop.hasOne(Economics);
Economics.belongsTo(Crop);
Crop.hasOne(Fertilization);
Fertilization.belongsTo(Crop);
Crop.hasOne(Irrigation);
Irrigation.belongsTo(Crop);
Crop.hasOne(LocationSuitability);
LocationSuitability.belongsTo(Crop);


module.exports = {
    Admin,
    JobRequest,
    Galary,
    Crop,
    Article,
    Cultivation,
    Irrigation,
    Economics,
    Diseases,
    Fertilization,
    LocationSuitability
}