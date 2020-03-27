const express = require("express");
const {
  accessStudent,
  accessAuthor,
  accessTeacher
} = require("../middleware/accessThroughRole");
const passport = require("passport");
const router = express.Router();
// Models
const { StatsModel } = require("../models/stats.model");
const Group = require("../models/group.model");

// // @route  Get api/content/slideshows/childrenof/:id
// // @desc   Get slideshows that belong to parent book node
// // @access Private
// router.get(
//   "/slideshows/childrenof/:id",
//   [accessAll],
//   passport.authenticate("jwt", {
//     session: false,
//     passReqToCallback: true
//   }),
//   async (req, res) => {
//     // Destructure
//     const { id } = req.params;
//     // Find slideshows with entrypoint of parent tag._id
//     const slideshows = await Slideshow.find({
//       entrypoint: id
//     })
//       .lean()
//       .populate("slides")
//       .populate("entrypoint")
//       .exec();
//     // Did we not find any?
//     if (!slideshows) {
//       return res.status(404).send(`Could not find slideshows with entrypoint: ${id}`);
//     }
//     // Merge slides and interactions for each slideshow
//     for (const slideshow of slideshows) {
//       for (const slide of slideshow.slides) {
//         slide.interactions = await Interaction.find({
//           user: req.user._id,
//           slide: slide._id
//         });
//       }
//     }

//     // Return data
//     return res.send(slideshows);
//   }
// );

// // @route  Get api/content/statistics/group/:group_id/branch/:branch_id/student/:student_id/depth/:depth
// // @desc   Get slideshows of a group to make a (statistics data)
// // @access Private
// router.get(
//   "/paragraph/",
//   [accessAuthor, accessTeacher],
//   passport.authenticate("jwt", {
//     session: false,
//     passReqToCallback: true
//   }),
//   async (req, res) => {
//     try {
//       const results = await TagInteraction.find({
//         parent: req.query.parentId
//       });

//       console.log(results);
//       return res.json(results);
//     } catch (error) {
//       return res.status(400).send(error);
//     }
//   }
// );

// // @route  Get api/stats/paragraph
// // @desc   Get TagInteractions for a paragraph
// // @access Private
// router.get(
//   "/paragraph/",
//   [accessAuthor, accessTeacher],
//   passport.authenticate("jwt", {
//     session: false,
//     passReqToCallback: true
//   }),
//   async (req, res) => {
//     try {
//       // Find group

//       const group = await Group.findOne({ _id: req.query.groupId });

//       if (!group) {
//         return res.status(400).send(`Could not find group with id: ${req.query.groupId}`);
//       }

//       // TODO: Combine queries?!
//       const paragraphs = await Tag.find({
//         parent: req.query.parentId
//       });

//       const assignments = await Slideshow.find({
//         parent: { $in: paragraphs }
//       });

//       const results = await TagInteraction.find({
//         parent: { $in: assignments },
//         user: { $in: group.students }
//       });

//       console.log(results);

//       return res.json(results);
//     } catch (error) {
//       console.log(error);
//       return res.status(400).send(error);
//     }
//   }
// );

// // @route  Get api/content/statistics/group/:group_id/branch/:branch_id/student/:student_id/depth/:depth
// // @desc   Get slideshows of a group to make a (statistics data)
// // @access Private
// router.get(
//   "/theme/",
//   [accessAuthor, accessTeacher],
//   passport.authenticate("jwt", {
//     session: false,
//     passReqToCallback: true
//   }),
//   async (req, res) => {
//     try {
//       // Find group

//       const group = await Group.findOne({ _id: req.query.groupId });

//       if (!group) {
//         return res.status(400).send(`Could not find group with id: ${req.query.groupId}`);
//       }

//       // TODO: Combine queries?!
//       const themes = await Tag.find({
//         parent: req.query.parentId
//       });

//       const paragraphs = await Tag.find({
//         parent: { $in: themes }
//       });

//       const results = await TagInteraction.find({
//         parent: { $in: paragraphs },
//         user: { $in: group.students }
//       });

//       return res.json(results);
//     } catch (error) {
//       console.log(error);
//       return res.status(400).send(error);
//     }
//   }
// );

// // @route  Get api/content/statistics/group/:group_id/branch/:branch_id/student/:student_id/depth/:depth
// // @desc   Get slideshows of a group to make a (statistics data)
// // @access Private
// router.get(
//   "/statistics/group/:group_id/branch/:branch_id/student/:student_id/depth/:depth",
//   [accessAuthor, accessTeacher],
//   passport.authenticate("jwt", {
//     session: false,
//     passReqToCallback: true
//   }),
//   async (req, res) => {
//     const { group_id, branch_id, student_id, depth } = req.params;
//     let slideshowsArray = [];
//     try {
//       const tags = await Tag.find({
//         path: { $regex: `${branch_id}(?!$)` }
//       });
//       if (!tags) {
//         return res.status(400).send({ tag: "not found!" });
//       }
//       let slideshows;
//       if (depth === "assignment") {
//         slideshows = await Slideshow.find({
//           _id: branch_id
//         })
//           .lean()
//           .populate("slides")
//           .populate("entrypoint")
//           .exec();
//       } else if (depth === "publication" || depth === "thema" || depth === "paragraf") {
//         slideshows = await Slideshow.find({
//           entrypoint: {
//             $in: tags.length ? tags : branch_id
//           }
//         })
//           .lean()
//           .exec();
//       } else {
//         return res.status(400).send(`Moeilijkheidsgraad ${depth} is onbekend!`);
//       }

//       if (!slideshows.length) {
//         return res.status(400).send(`Could not find slideshows with id: ${branch_id}`);
//       }
//       // Find group based on groupId
//       const group = await Group.findOne({ _id: group_id })
//         .populate({
//           path: "students",
//           model: "account",
//           select: "-account"
//         })
//         .exec();

//       if (!group) {
//         return res.status(400).send(`Could not find group with id: ${group_id}`);
//       }

//       let isFound = false;
//       if (student_id !== "undefined") {
//         isFound = group.students.some((el) => el._id.toString() === student_id);
//         if (!isFound) {
//           return res.status(404).send(`Could not find student with id: ${studentId}`);
//         }
//       }

//       const studentsInGroup = isFound ? group.students.filter((el) => el._id.toString() === student_id) : group.students;

//       for (const student of studentsInGroup) {
//         const stdSlideshows = await statisticsData(slideshows, student, depth);
//         const item = {
//           _id: student._id,
//           name: student.name,
//           isActivated: student.isActivated,
//           slideShows: stdSlideshows
//         };
//         slideshowsArray.push(item);
//       }

//       return res.json(slideshowsArray);
//     } catch (error) {
//       return res.status(400).send(error);
//     }
//   }
// );

// async function statisticsData(slideshows, studentId, depth) {
//   let slideshowsArray = [];
//   for (const slideshow of slideshows) {
//     if (depth === "assignment") {
//       const fakeSlideshow = { ...slideshow };
//       let temp = [];
//       fakeSlideshow.slides = temp;
//       for (const slide of slideshow.slides) {
//         const fakeSlide = { ...slide };
//         if (slide.__t !== slideTypes.INFO + "_slide" && slide.__t !== slideTypes.REPORT + "_slide") {
//           fakeSlide.interactions = await Interaction.find({
//             user: studentId,
//             slide: fakeSlide._id
//           });
//           fakeSlideshow.slides.push(fakeSlide);
//         }
//       }
//       slideshowsArray.push(fakeSlideshow);
//     } else {
//       const temp = { ...slideshow };
//       temp.interactions = await SlideshowInteraction.find({
//         user: studentId,
//         parent: slideshow._id
//       });
//       slideshowsArray.push(temp);
//     }
//   }
//   return slideshowsArray;
// }

// // @route  Get api/content/statistics/group/:group_id/branch/:branch_id/student/:student_id
// // @desc   Get slideshows of a group to make a (statistics data)
// // @access Private
// router.get(
//   "/",
//   [accessAuthor, accessTeacher],
//   passport.authenticate("jwt", {
//     session: false,
//     passReqToCallback: true
//   }),
//   async (req, res) => {
//     const { groupId, studentId } = req.query;
//     try {
//       const group = await Group.findOne({ _id: groupId });
//       if (!group) {
//         return res.status(400).send(`Could not find group with id: ${groupId}`);
//       }

//       let studentFound = false;

//       console.log(typeof studentId);
//       if (studentId !== "undefined") {
//         console.log("NO STUDENT FOUND!!!!! UNDEFINED FOUND!!!!!");
//         studentFound = group.students.some((student) => student._id.toString() === studentId);
//         if (!studentFound) {
//           return res.status(404).send(`Could not find student with id: ${studentId}`);
//         }
//       }

//       const studentsInGroup = studentFound ? group.students.filter((student) => student._id.toString() === studentId) : group.students;

//       // const query = { user: { $in: studentsInGroup } };
//       // if (depth === LevelsOfNodeDepth.PARAGRAF && parentId) query.themes = { $in: parentId };

//       const results = await StatsModel.find({ user: { $in: studentsInGroup } });

//       return res.json(results);
//     } catch (error) {
//       console.log(error);
//       return res.status(400).send(error);
//     }
//   }
// );

// @route  Get api/content/statistics/group/:group_id/branch/:branch_id/student/:student_id
// @desc   Get slideshows of a group to make a (statistics data)
// @access Private
router.get(
  "/group/:groupId",
  [accessAuthor, accessTeacher],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  async (req, res) => {
    const { groupId } = req.params;
    try {
      const group = await Group.findOne({ _id: groupId }).populate({
        path: "students",
        model: "account",
        select: "-account"
      });
      if (!group) {
        return res.status(400).send(`Could not find group with id: ${groupId}`);
      }

      // let studentFound = false;
      // console.log(typeof studentId);
      // if (studentId !== "undefined") {
      //   console.log("NO STUDENT FOUND!!!!! UNDEFINED FOUND!!!!!");
      //   studentFound = group.students.some((student) => student._id.toString() === studentId);
      //   if (!studentFound) {
      //     return res.status(404).send(`Could not find student with id: ${studentId}`);
      //   }
      // }
      // const studentsInGroup = studentFound ? group.students.filter((student) => student._id.toString() === studentId) : group.students;

      const results = await StatsModel.find({ user: { $in: group.students } })
        .populate("tag")
        .populate({
          path: "user",
          model: "account",
          select: "-account"
        })
        .populate("children.tag")
        .populate("children.children.tag")
        //.populate("children.children.children.tag")
        .lean()
        .exec();
      return res.json({ _id: groupId, group: group, stats: results });
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
  "/student/:studentId",
  [accessStudent],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  async (req, res) => {
    try {
      if (req.user && req.user._id.toString() !== req.params.studentId) {
        return res
          .status(403)
          .send("You are not authorized to view another student's progress");
      }
      const results = await StatsModel.findOne({ user: req.params.studentId })
        .populate("tag")
        .populate("children.tag")
        .populate("children.children.tag")
        .populate("children.children.children.tag");
      return res.json(results);
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  }
);

module.exports = router;
