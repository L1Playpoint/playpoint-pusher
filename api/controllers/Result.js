const expressAsyncHandler = require("express-async-handler");
const Result = require("../models/Result");
const { sanitizeQueryInput } = require("../utils/QuerySanitizer");

module.exports = {
  /**
   * ****************************************************************
   *                  @dev Get All Results
   * ****************************************************************
   */
  getResultController: (req, res) => {
    Result.find()
      .then((response) => res.status(200).json({ response: response }))
      .catch((err) => console.error(err));
  },
  /**
   * ****************************************************************
   *                  @dev New Results
   * ****************************************************************
   */
  newResultController: (req, res) => {
    const { questionaireId, results } = req.body;

    Result.create({
      questionaireId,
      results,
    })
      .then(() => {
        res.status(200).json({ message: "Results Created Successfully!" });
      })
      .catch((err) => console.error(err));
  },
  /**
   * ****************************************************************
   *                  @dev Update Results
   * ****************************************************************
   */
  updateResultController: expressAsyncHandler(async (req, res) => {
    const { _id, questionaireId, results } = req.body;
    const tempData = await Result.findOne({ _id: sanitizeQueryInput(_id) });

    await Result.updateOne(
      { _id: sanitizeQueryInput(_id) },
      {
        $set: {
          questionaireId: questionaireId || tempData.questionaireId,
          results: results || tempData.results,
        },
      }
    );
    res.status(200).json({ message: "Result updated successfully!" });
  }),
  /**
   * ****************************************************************
   *                  @dev Delete Result
   * ****************************************************************
   */
  deleteResultController: (req, res) => {
    const { _id } = req.body;

    Result.deleteOne({ _id: sanitizeQueryInput(_id) })
      .then(() =>
        res.status(200).json({ message: "Result deleted successfully!" })
      )
      .catch((error) => console.error(error));
  },
};
