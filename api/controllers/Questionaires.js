import expressAsyncHandler from "express-async-handler";
import { sanitizeQueryInput } from "../../utils/QuerySanitizer";
import Questionaire from "../models/Questionaire";

module.exports = {
  /**
   * ****************************************************************
   *                  @dev Get All Questionaires
   * ****************************************************************
   */
  getQuestionaireController: (req, res) => {
    Questionaire.find()
      .populate("fixtureId")
      .then((response) => {
        res.status(200).json({ data: response });
      })
      .catch((error) => console.error(error));
  },
  /**
   * ****************************************************************
   *                     @dev New Questionaires
   * ****************************************************************
   */
  newQuestionaireController: expressAsyncHandler(async (req, res) => {
    const {
      fixtureId,
      questionaireType,
      questionairePrice,
      questionaires,
      poolType,
    } = req.body;

    const newQuestionaire = new Questionaire({
      fixtureId,
      questionaireType,
      questionairePrice,
      questionaires,
      poolType,
    });

    await newQuestionaire.save();

    res.status(200).json({ message: "New Questionaire created successfully!" });
  }),
  /**
   * ****************************************************************
   *                     @dev Update Questionaire
   * ****************************************************************
   */
  updateQuestionaireController: (req, res) => {
    const { _id } = req.body;

    const {
      fixtureId,
      questionaireType,
      questionairePrice,
      questionaires,
      poolType,
    } = req.body;

    const tempQuestionaire = Questionaire.findOne({
      _id: sanitizeQueryInput(_id),
    });

    Questionaire.updateOne(
      { _id: sanitizeQueryInput(_id) },
      {
        $set: {
          fixtureId: fixtureId || tempQuestionaire.fixtureId,
          questionaireType:
            questionaireType || tempQuestionaire.questionaireType,
          questionairePrice:
            questionairePrice || tempQuestionaire.questionairePrice,
          questionaires: questionaires || tempQuestionaire.questionaires,
          poolType: poolType || tempQuestionaire.poolType,
        },
      }
    )
      .then(() =>
        res.status(200).json({ message: "Questionaire updated successfully!" })
      )
      .catch((err) => console.error(err));
  },
  /**
   * ****************************************************************
   *                     @dev Delete Questionaire
   * ****************************************************************
   */
  deleteQuestionaireController: (req, res) => {
    const { _id } = req.body;

    Questionaire.deleteOne({ _id: sanitizeQueryInput(_id) })
      .then(() =>
        res.status(200).json({ message: "Questionaire deleted successfully!" })
      )
      .catch((err) => console.error(err));
  },
};
