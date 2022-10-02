const { getMarketplaces, newMarketplace, updateMarketplace, deleteMarketplace } = require("../api/controllers/Marketplace");
const { multerUpload } = require("./MulterConfig");

const APIRouter = require("express").Router();

/**
 * Marketplace API Routers
 */
APIRouter.get("/marketplace", getMarketplaces)
.post("/new-marketplace",multerUpload.single("marketplaceCoverImage"), newMarketplace)
.patch("/update-marketplace", updateMarketplace)
.delete("/delete-marketplace", deleteMarketplace)


module.exports = APIRouter;
