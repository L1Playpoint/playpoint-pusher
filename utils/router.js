const { getMarketplaces, newMarketplace } = require("../api/controllers/Marketplace");
const { multerUpload } = require("./MulterConfig");

const APIRouter = require("express").Router();

APIRouter.get("/", (req, res) =>
  res.json({ message: "Welcome to V1 Playpoint API! 👌" })
);

/**
 * Marketplace API Routers
 */
APIRouter.get("/marketplace", getMarketplaces)
.post("/new-marketplace",multerUpload.single("marketplaceCoverImage"), newMarketplace)


module.exports = APIRouter;
