const express = require("express");
const {
  accessStudent,
  accessAuthor,
  accessTeacher
} = require("../middleware/accessThroughRole");
const passport = require("passport");
const router = express.Router();
// Models
const Group = require("../models/group.model");
const { ProgressOverview, Progress } = require("../models/progress.model");
const { Tag } = require("../models/tag.model");
const { Interaction } = require("../models/interaction.model");

const { tagLevels } = require("../services/config");
const { slideTypes } = require("../services/config");

// @route  Get api/content/statistics/group/:group_id/branch/:branch_id/student/:student_id
// @desc   Get slideshows of a group to make a (statistics data)
// @access Private
router.get(
  "/groupoverview/:groupId",
  [accessAuthor, accessStudent, accessTeacher],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  async (req, res) => {
    const { groupId } = req.params;
    try {
      const group = await Group.findOne({ _id: groupId });
      if (!group) {
        return res.status(400).send(`Could not find group with id: ${groupId}`);
      }
      const results = await ProgressOverview.find({
        user: { $in: group.students }
      })
        .populate("themes.tag")
        .populate({
          path: "user",
          model: "account",
          select: "-account"
        });
      return res.json({
        _id: groupId,
        group: group,
        stats: results,
        depthLevel: tagLevels.THEME
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  }
);

// @route  Get api/content/statistics/group/:group_id/branch/:branch_id/student/:student_id
// @desc   Get slideshows of a group to make a (statistics data)
// @access Private
router.get(
  "/groupdetail/group/:groupId/parent/:parentId",
  [accessAuthor, accessStudent, accessTeacher],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  async (req, res) => {
    const { groupId, parentId } = req.params;
    try {
      const group = await Group.findOne({ _id: groupId });
      if (!group) {
        return res.status(400).send(`Could not find group with id: ${groupId}`);
      }
      // const query = !parentId
      //   ? { user: { $in: group.students } }
      //   : { user: { $in: group.students }, parent: { $in: parentId } };

      const query2 = {
        $or: [
          {
            user: { $in: group.students },
            parent: { $in: parentId }
          },
          {
            user: { $in: group.students },
            "paragraphs.tag": { $in: parentId }
          },
          {
            user: { $in: group.students },
            "assignments.tag": { $in: parentId }
          }
        ]
      };

      const results = await Progress.find(query2)
        .populate({
          path: "parent",
          model: "tag"
        })
        .populate("paragraphs.tag")
        .populate("assignments.tag")
        .populate({
          path: "user",
          model: "account",
          select: "-account"
        });

      return res.status(200).json({
        _id: groupId,
        group: group,
        stats: results,
        depthLevel: tagLevels.PARAGRAPH
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  }
);

// @route  Get api/stats/progress
// @desc
// @access Private
router.get(
  "/studentoverview/depth/:depthLevel",
  [accessStudent],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  async (req, res) => {
    try {
      const result = await ProgressOverview.findOne({
        user: req.user._id
      })
        .populate("publication")
        .populate("themes.tag")
        .populate({
          path: "user",
          model: "account",
          select: "-account"
        });
      return res.json({
        // _id: `${req.params.depthLevel.toUpperCase()}_${req.user._id}`,
        data: result,
        userId: req.user._id,
        depthLevel: req.params.depthLevel.toUpperCase()
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  }
);

// @route  Get api/stats/progress
// @desc
// @access Private
router.get(
  "/studentdetail/parent/:parentId/depth/:depthLevel",
  [accessStudent],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  async (req, res) => {
    try {
      const result = await Progress.findOne({
        user: req.user._id,
        parent: req.params.parentId
      })
        .populate("publication")
        .populate("parent")
        .populate("paragraphs.tag")
        .populate("assignments.tag")
        .populate({
          path: "user",
          model: "account",
          select: "-account"
        });
      return res.json({
        data: result,
        userId: req.user._id,
        depthLevel: req.params.depthLevel.toUpperCase()
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  }
);

// @route  Get api/stats/progress
// @desc
// @access Private
router.get(
  "/interactions/assignment/:assignmentId/student/:studentId",
  [accessStudent, accessTeacher],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  async (req, res) => {
    const { assignmentId, studentId } = req.params;
    try {
      const assignment = await Tag.findOne({ _id: assignmentId })
        .lean()
        .populate("slides")
        .populate("entrypoint")
        .exec();

      if (!assignment) {
        return res
          .status(404)
          .send(`Could not find assignment with id: ${assignmentId}`);
      }

      for (const slide of assignment.slides) {
        if (
          slide.__t !== slideTypes.INFO + "_slide" &&
          slide.__t !== slideTypes.REPORT + "_slide"
        ) {
          slide.interactions = await Interaction.find({
            user: studentId,
            slide: slide._id
          });
        }
      }
      return res.json(assignment);
    } catch (error) {
      console.log("error ~~~~~~~~~~~~~~ ::: ", error);
      return res.status(400).send(error);
    }
  }
);

module.exports = router;
