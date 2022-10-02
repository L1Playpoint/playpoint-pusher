var fs = require("fs");
const expressAsyncHandler = require("express-async-handler");
const Marketplace = require("../models/Marketplace");
const { imageKit } = require("../../utils/ImageKit");

module.exports = {
  /**
   * ****************************************************************
   *               @dev Get Specific Marketplaces
   * ****************************************************************
   */
  getSpecificMarketplace: expressAsyncHandler(async (req, res) => {
    const { marketplaceSlug } = req.body;

    const marketplace = Marketplace.findOne({ marketplaceSlug });
    if (marketplace) {
      res.status(200).json({
        data: marketplace,
      });
    } else {
      res.status(400).json({
        message: `Oops! marketplace not found for ${marketplaceSlug}! Try changing marketplace slug!`,
      });
    }
  }),
  /**
   * ****************************************************************
   *                  @dev Get All Marketplaces
   * ****************************************************************
   */
  getMarketplaces: expressAsyncHandler(async (req, res) => {
    const getMarketplaces = await Marketplace.find();
    res.status(200).json({
      data: getMarketplaces,
    });
  }),
  /**
   * ****************************************************************
   *                     @dev New Marketplaces
   * ----------------------------------------------------------------
   * @dev Algorithm
   * 1. get formData inputs => req.body, req.file(from multer)
   * 2. read uploaded file and upload to ImageKit
   * 3. create new document on marketplace collection,
   * marketplaceCoverImage is from imagekit uploaded result url
   * 4. delete image from local storage of server
   * ****************************************************************
   */
  // deepcode ignore NoRateLimitingForExpensiveWebOperation: Already configured on server.js
  newMarketplace: expressAsyncHandler(async (req, res) => {
    const { marketplaceName, marketplaceSlug } = req.body;
    const { filename } = req.file;

    // deepcode ignore PT: <please specify a reason of ignoring this>
    fs.readFile(__basedir + "/uploads/" + filename, (err, data) => {
      if (err) throw err;

      imageKit.upload(
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
  /**
   * ****************************************************************
   *                     @dev Update Marketplace
   * ----------------------------------------------------------------
   * *@dev marketplace coverimage can't be updated
   * ****************************************************************
   */
  updateMarketplace: expressAsyncHandler(async (req, res) => {
    const { marketplaceName, marketplaceSlug } = req.body;

    const tempMarketplace = await Marketplace.findOne({ marketplaceSlug });
    if (tempMarketplace) {
      await Marketplace.updateOne(
        { marketplaceSlug },
        {
          $set: {
            marketplaceName: marketplaceName || tempMarketplace.marketplaceName,
            marketplaceSlug: marketplaceSlug || tempMarketplace.marketplaceSlug,
            marketplaceCoverImage: tempMarketplace.marketplaceCoverImage,
          },
        }
      );

      res.status(200).json({
        message: `Marketplace ${marketplaceSlug} updated successfully!`,
      });
    } else {
      return res.status(400).json({
        message: "No marketplace, bad request! Try checking marketplace slug.",
      });
    }
  }),
  /**
   * ****************************************************************
   *                     @dev Delete Marketplace
   * ****************************************************************
   */
  deleteMarketplace: expressAsyncHandler(async (req, res) => {
    const { marketplaceSlug } = req.body;
    await Marketplace.deleteOne({ marketplaceSlug });
    res.status(200).json({
      message: `Marketplace ${marketplaceSlug} deleted successfully!`,
    });
  }),
};
