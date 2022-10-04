const { getMarketplaces, newMarketplace, updateMarketplace, deleteMarketplace, getSpecificMarketplace } = require("../api/controllers/Marketplace");
const { getSpecificFixtureController, getFixturesController, newFixtureController, updateFixturesController, deleteFixtureController } = require("../api/controllers/Fixture");
const { multerUpload } = require("./MulterConfig");

const APIRouter = require("express").Router();

/**
 * Marketplace API Routers
 */
APIRouter.get("/marketplace", getMarketplaces)
APIRouter.get("/marketplace-specific", getMarketplaces)
.post("/new-marketplace",multerUpload.single("marketplaceCoverImage"), newMarketplace)
.patch("/update-marketplace", updateMarketplace)
.delete("/delete-marketplace", deleteMarketplace)

/**
 * Fixture API Routers
 */
APIRouter.get("/fixture", getFixturesController)
APIRouter.get("/fixture-specific", getSpecificFixtureController)
.post("/new-fixture", newFixtureController)
.patch("/update-fixture", updateFixturesController)
.delete("/delete-fixture", deleteFixtureController)


module.exports = APIRouter;
