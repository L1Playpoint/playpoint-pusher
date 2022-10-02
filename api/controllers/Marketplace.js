const expressAsyncHandler = require("express-async-handler");
const Marketplace = require("../models/Marketplace");
var ImageKit = require("imagekit");
var fs = require("fs");

module.exports = {
  getMarketplaces: expressAsyncHandler(async (req, res) => {
    const getMarketplaces = await Marketplace.find();
    res.status(200).json({
      data: getMarketplaces,
    });
  }),
  /**
   * ****************************************************************
   *                     @dev New Marketplaces
   * ****************************************************************
   */
  // deepcode ignore NoRateLimitingForExpensiveWebOperation: Already configured on server.js
  newMarketplace: expressAsyncHandler(async (req, res) => {
    const { marketplaceName, marketplaceSlug } = req.body;
    const { filename } = req.file;

    var imagekit = new ImageKit({
      publicKey: "public_3/B9kNFqtIBgBbGafyW4nAE5AGo=",
      privateKey: process.env.IMAGEKIT_PK,
      urlEndpoint: "https://ik.imagekit.io/domsan",
    });

    // deepcode ignore PT: <please specify a reason of ignoring this>
    fs.readFile(__basedir + "/uploads/" + filename, (err, data) => {
      if (err) throw err;

      imagekit.upload(
        {
          file: data,
          fileName: filename,
        },
        expressAsyncHandler(async (error, result) => {
          if (error) console.error(error);
          else {
            let newMarketplaceItem = new Marketplace({
              marketplaceName,
              marketplaceSlug,
              marketplaceCoverImage: result?.url,
            });

            await newMarketplaceItem.save();

            res.status(200).json({
              sytatus: 200,
              message: "Marketplace created successfully!",
            });

            //   deepcode ignore PT: <please specify a reason of ignoring this>
            fs.unlinkSync(__basedir + "/uploads/" + filename);
          }
        })
      );
    });
  }),
};
