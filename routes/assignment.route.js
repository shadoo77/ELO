const express = require("express");
const { accessStudent, accessAll } = require("../middleware/accessThroughRole");
const passport = require("passport");
const router = express.Router();
var ss = require("seededshuffle");
// Models
const { Tag } = require("../models/tag.model");
const { StatsModel } = require("../models/~stats.model");
const {
  Interaction,
  MultipleChoiceInteraction,
  MatchingInteraction,
  FlashcardInteraction
} = require("../models/interaction.model");
const { ProgressOverview, Progress } = require("../models/progress.model");
// Services
const { tagLevels, slideTypes } = require("../services/config");

// @route   Get api/assignment/id/:assignmentId
// @desc    Get assignment with interactions for each slide
// @access  Private
router.get(
  "/id/:assignmentId",
  [accessAll],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  async (req, res) => {
    try {
      const assignment = await Tag.findOne({
        _id: req.params.assignmentId,
        __t: tagLevels.ASSIGNMENT
      })
        .lean()
        .populate("slides")
        .populate("parent")
        .exec();
      // Did we not find any?
      if (!assignment) {
        return res
          .status(404)
          .send(
            `Could not find assignment with parent: ${req.params.assignmentId}`
          );
      }
      let attempt = 0;
      let active = 0;

      // Merge slides and interactions for each slideshow
      for (const slide of assignment.slides) {
        slide.interactions = await Interaction.find({
          user: req.user._id,
          slide: slide._id
        });

        attempt =
          slide.interactions.length - 1 > attempt
            ? slide.interactions.length - 1
            : attempt;
      }

      // If every slide has interactions, increment attempt (so student can submit new interactions)
      const timeToIncrementAttempt = assignment.slides
        .filter(slide => slide.__t !== slideTypes.INFO)
        .every((val, ind, arr) => {
          return (
            val.interactions.length !== 0 &&
            val.interactions.length === arr[0].interactions.length
          );
        });
      console.log("TIME TO INCREMENT?", timeToIncrementAttempt);
      attempt = timeToIncrementAttempt ? ++attempt : attempt; // TODO: Does attempt work for matching slides?

      // Merge slides and interactions for each slideshow
      for (const slide of assignment.slides) {
        if (
          slide.__t !== slideTypes.INFO &&
          slide.__t !== slideTypes.MATCHING &&
          slide.shuffleAnswers
        ) {
          ss.shuffle(
            slide.possibleAnswers,
            attempt * slide._id.toString().replace(/\D+/g, ""),
            false
          );
        }
      }

      // Find first slide in set that has fewer interactions than the previous
      active = !timeToIncrementAttempt
        ? assignment.slides.findIndex(
            slide =>
              slide.__t !== slideTypes.INFO &&
              slide.interactions.length - 1 < attempt
          )
        : 0;

      // Return data
      return res.status(200).json({
        _id: assignment._id,
        assignment,
        attempt: attempt < 0 ? 0 : attempt,
        active: active < 0 ? 0 : active
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  }
);

// // @route  POST api/assignment/interaction/multichoice
// // @desc   Save interaction with a slide using the MultiplechoiceInteraction model
// // @access Private
router.post(
  "/interaction/multiplechoice",
  [accessStudent],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  (req, res) => {
    console.log({
      user: req.user._id,
      slide: req.body.slide,
      answered: req.body.answered,
      isAccepted: req.body.isAccepted
    });
    new MultipleChoiceInteraction({
      user: req.user._id,
      slide: req.body.slide,
      answered: req.body.answered,
      isAccepted: req.body.isAccepted
    }).save(function(error, response) {
      if (error) {
        console.error(error);
        return res.status(400).json(error);
      }
      return res.status(200).json(response);
    });
  }
);

// // @route  POST api/assignment/interaction/multichoice
// // @desc   Save interaction with a slide using the MultiplechoiceInteraction model
// // @access Private
router.post(
  "/interaction/flashcard",
  [accessStudent],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  (req, res) => {
    new FlashcardInteraction({
      user: req.user._id,
      slide: req.body.slide,
      duration: req.body.duration
    }).save(function(error, response) {
      if (error) {
        console.error(error);
        return res.status(400).json(error);
      }
      return res.status(200).json(response);
    });
  }
);

// // @route  POST api/assignment/interaction/multichoice
// // @desc   Save interaction with a slide using the MultiplechoiceInteraction model
// // @access Private
router.post(
  "/interaction/matching",
  [accessStudent],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  (req, res) => {
    console.log({
      user: req.user._id,
      slide: req.body.slide,
      answered: req.body.answered,
      isAccepted: req.body.isAccepted
    });
    new MatchingInteraction({
      user: req.user._id,
      slide: req.body.slide,
      answered: req.body.answered,
      isAccepted: req.body.isAccepted
    }).save(function(error, response) {
      if (error) {
        console.error(error);
        return res.status(400).json(error);
      }
      return res.status(200).json(response);
    });
  }
);

function arrAvg(arr, field) {
  return Math.round(
    arr.reduce((total, next) => total + next[field], 0) / arr.length
  );
}

// // @route  POST api/assignment/progress/update
// // @desc   Update progress after an assignment has been completed
// // @access Private
router.post(
  "/progress/update",
  [accessStudent],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  async (req, res) => {
    try {
      //ignore info slides
      const slides = req.body.slides.filter(
        slide => slide.__t !== slideTypes.INFO
      );

      const arrCorrectWrong = slides.map(
        slide => slide.interactions[slide.interactions.length - 1].isAccepted
      );

      // const perCorrect =
      //   (slides
      //     .map((slide) => {
      //       return slide.interactions.some(
      //         (interaction) => interaction.isAccepted
      //       );
      //     })
      //     .filter((accepted) => accepted === true).length /
      //     slides.length) *
      //   100;

      // Last
      const lastPerCorrect =
        (arrCorrectWrong.filter(b => b).length / arrCorrectWrong.length) * 100;
      const lastPerWrong = 100 - lastPerCorrect;

      // Total
      let nrCorrect = 0;
      let nrWrong = 0;
      let total = 0;
      for (const slide of slides) {
        for (const inter of slide.interactions) {
          if (inter.isAccepted) {
            nrCorrect++;
          } else {
            nrWrong++;
          }
          total++;
        }
      }

      const perCorrect = (nrCorrect / total) * 100;
      const perWrong = (nrWrong / total) * 100;

      console.log(
        "CORRECT:",
        perCorrect,
        "WRONG:",
        perWrong,
        "LASTCORRECT:",
        lastPerCorrect,
        "LASTWRONG:",
        lastPerWrong
      );

      const test = await Progress.findOneAndUpdate(
        {
          user: req.user._id,
          parent: req.body.themeId,
          assignments: {
            $elemMatch: {
              tag: req.body.assignmentId
            }
          }
        },
        {
          $set: {
            "assignments.$.correct": perCorrect,
            "assignments.$.wrong": perWrong,
            "assignments.$.lastCorrect": lastPerCorrect,
            "assignments.$.lastWrong": lastPerWrong
          },
          $inc: {
            "assignments.$.attempts": 1
          }
        },
        { new: true }
      )
        .populate({
          path: "assignments.tag",
          select: "parent",
          model: "tag"
        })
        .lean()
        .exec();

      const currentAssignments = test.assignments.filter(assignment => {
        return (
          assignment.tag.parent.toString() === req.body.paragraphId.toString()
        );
      });

      const pCorrect = arrAvg(currentAssignments, "correct");
      const pWrong = arrAvg(currentAssignments, "wrong");
      const pAttempts = arrAvg(currentAssignments, "attempts");

      const result_detail = await Progress.findOneAndUpdate(
        {
          user: req.user._id,
          parent: req.body.themeId,
          paragraphs: {
            $elemMatch: {
              tag: req.body.paragraphId
            }
          }
        },
        {
          $set: {
            "paragraphs.$.correct": pCorrect,
            "paragraphs.$.wrong": pWrong,
            "paragraphs.$.attempts": pAttempts
          }
        },
        { new: true }
      )
        .populate({
          path: "paragraphs.tag",
          select: "parent",
          model: "tag"
        })
        .lean()
        .exec();

      const tCorrect = arrAvg(result_detail.paragraphs, "correct");
      const tWrong = arrAvg(result_detail.paragraphs, "wrong");
      const tAttempts = arrAvg(result_detail.paragraphs, "attempts");

      const result_overview = await ProgressOverview.findOneAndUpdate(
        {
          user: req.user._id,
          publication: "5ce26f814d65de88b425f250",
          themes: {
            $elemMatch: {
              tag: req.body.themeId
            }
          }
        },
        {
          $set: {
            "themes.$.correct": tCorrect,
            "themes.$.wrong": tWrong,
            "themes.$.attempts": tAttempts
          }
        }
      )
        .lean()
        .exec();

      // Remove interactions?
      // Get url of next assignment

      const findThemeIndex = () =>
        result_overview.themes.findIndex(
          theme => theme.tag.toString() === req.body.themeId.toString()
        );

      const findParIndex = () =>
        result_detail.paragraphs.findIndex(
          paragraph =>
            paragraph.tag._id.toString() === req.body.paragraphId.toString()
        );

      const findAssignIndex = () =>
        currentAssignments.findIndex(
          assignment =>
            assignment.tag._id.toString() === req.body.assignmentId.toString()
        );

      const currentParIndex = findParIndex();
      const currentAssignIndex = findAssignIndex();

      const nextUrl =
        currentAssignIndex < currentAssignments.length - 1
          ? `/student/browse/theme/${result_detail.parent}/paragraph/${
              result_detail.paragraphs[currentParIndex].tag._id
            }/assignment/${currentAssignments[currentAssignIndex + 1].tag._id}`
          : currentParIndex < result_detail.paragraphs.length - 1
          ? `/student/browse/theme/${result_detail.parent}/paragraph/${result_detail.paragraphs[currentParIndex].tag._id}`
          : `/student/browse/theme/${
              result_overview.themes[findThemeIndex() + 1].tag._id
            }`;

      res.status(200).send({ _url: nextUrl, result_overview, result_detail });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  }
);

router.post(
  "/progress/assignment",
  [accessStudent],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  (req, res) => {
    const statsModel = StatsModel.findOne({ user: req.user._id });
    console.log(statsModel);
    // const tree = new TreeModel();
    // const root = tree.parse(statsModel);

    // var assignmentNode = root.first(
    //   (node) => node.model._id === req.body.assignmentId
    // );
    // console.log(assignmentNode.model);
    res.status(200).send(statsModel);
  }
);

module.exports = router;
