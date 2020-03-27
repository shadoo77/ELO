const express = require("express");
const {
  accessStudent,
  accessTeacher,
  accessAuthor,
  accessAll
} = require("../middleware/accessThroughRole");
const passport = require("passport");
const router = express.Router();
// Models
//const { Tag } = require("../models/tag.model");
const {
  InfoSlide,
  TaalbeatSlide,
  InputLiedjeSlide
} = require("../models/slide.model");
const { ThemeContent, AudioFragment } = require("../models/alfaContent.model");
// Slide types
//const { slideTypes, tagLevels } = require("../services/config");

// @route  Get api/content/alfaContent
// @desc   Get all videos and taalbeats slides inside all paragraphs
// @access Private
router.get(
  "/alfaContent",
  [accessAll],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  async (req, res) => {
    try {
      const videosSlides = await InfoSlide.find({});
      const taalbeatSlides = await TaalbeatSlide.find({});
      const liedjesSlides = await InputLiedjeSlide.find({});
      const obj = { videosSlides, taalbeatSlides, liedjesSlides };
      return res.send({ _id: "ALFACONTENTS", ...obj });
    } catch (error) {
      console.log(error);
      return res.status(404).send(error);
    }
  }
);

// @route  Get api/content/alfa-content
// @desc   Get all videos and taalbeats slides inside all paragraphs
// @access Private
router.get(
  "/alfa-content",
  [accessAll],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  async (req, res) => {
    try {
      const themes = await ThemeContent.find({}).populate({
        path: "children.children.content.items",
        model: "audiofragmenten"
      });
      const audioFragment = await AudioFragment.find({});
      const obj = { themes, audioFragment };
      return res.send({ _id: "ALFA_CONTENTS", ...obj });
    } catch (error) {
      console.log(error);
      return res.status(404).send(error);
    }
  }
);

// // @route  Get api/content/slideshowsof/parent/:parent_id/student/:student_id
// // @desc   Get slideshows for an id (get subtree items for the last level)
// // @desc   or get one slideshow
// // @access Private
// router.get(
//   "/slideshowsof/parent/:parent_id/student/:student_id",
//   [accessAuthor, accessTeacher],
//   passport.authenticate("jwt", {
//     session: false,
//     passReqToCallback: true
//   }),
//   async (req, res) => {
//     const { student_id, parent_id } = req.params;
//     let slideshowsArray = [];
//     Tag.find({ path: { $regex: `${parent_id}(?!$)` } })
//       .then((tags) => {
//         Slideshow.find({
//           $or: [
//             {
//               entrypoint: {
//                 $in: tags.length ? tags : parent_id
//               }
//             },
//             { _id: { $in: parent_id } }
//           ]
//         })
//           .lean()
//           .populate("slides")
//           .populate("entrypoint")
//           .exec()
//           .then(async (slideshows) => {
//             if (!slideshows.length) {
//               return res.status(404).send(`Could not find slideshows with id: ${parent_id}`);
//             }

//             for (const slideshow of slideshows) {
//               for (const slide of slideshow.slides) {
//                 if (slide.__t !== slideTypes.INFO + "_slide" && slide.__t !== slideTypes.REPORT + "_slide") {
//                   slide.interactions = await Interaction.find({
//                     user: student_id,
//                     slide: slide._id
//                   });
//                 }
//               }
//               slideshowsArray.push(slideshow);
//             }
//             return res.json(slideshowsArray);
//           });
//       })
//       .catch((err) => res.status(400).send(err));
//   }
// );

// async function slideshowsWithInteractions(slideshows, studentId) {
//   let slideshowsArray = [];
//   for (const slideshow of slideshows) {
//     const fakeSlideshow = { ...slideshow };
//     let temp = [];
//     fakeSlideshow.slides = temp;
//     for (const slide of slideshow.slides) {
//       const fakeSlide = { ...slide };
//       if (slide.__t !== slideTypes.INFO + "_slide" && slide.__t !== slideTypes.REPORT + "_slide") {
//         fakeSlide.interactions = await Interaction.find({
//           user: studentId,
//           slide: fakeSlide._id
//         });
//         fakeSlideshow.slides.push(fakeSlide);
//       }
//     }
//     slideshowsArray.push(fakeSlideshow);
//   }
//   return slideshowsArray;
// }

// // @route  Get api/content/slideshowsof/group/:group_id/branch/:branch_id/student/:student_id
// // @desc   Get slideshows of a group (get subtree items for the last level)
// // @desc   or get one slideshow
// // @access Private
// router.get(
//   "/slideshowsof/group/:group_id/branch/:branch_id/student/:student_id",
//   [accessAuthor, accessTeacher],
//   passport.authenticate("jwt", {
//     session: false,
//     passReqToCallback: true
//   }),
//   async (req, res) => {
//     const { group_id, branch_id, student_id } = req.params;
//     let slideshowsArray = [];
//     try {
//       const tags = await Tag.find({
//         path: { $regex: `${branch_id}(?!$)` }
//       });
//       if (!tags) {
//         return res.status(400).send({ tag: "not found!" });
//       }
//       const slideshows = await Slideshow.find({
//         $or: [
//           {
//             entrypoint: {
//               $in: tags.length ? tags : branch_id
//             }
//           },
//           { _id: { $in: branch_id } }
//         ]
//       })
//         .lean()
//         .populate("slides")
//         .populate("entrypoint")
//         .exec();
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
//           return res.status(404).send(`Student with id ${student_id} is not found`);
//         }
//       }

//       const studentsInGroup = isFound ? group.students.filter((el) => el._id.toString() === student_id) : group.students;

//       for (const student of studentsInGroup) {
//         const stdSlideshows = await slideshowsWithInteractions(slideshows, student);
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

// /* Get single slideshow by id */
// // @route  Get api/content/slideshow/:id
// // @desc   Get slideshow that matches :id
// // @access Private
// router.get(
//   "/slideshow/:id",
//   [accessAll],
//   passport.authenticate("jwt", {
//     session: false,
//     passReqToCallback: true
//   }),
//   (req, res) => {
//     // Destructure
//     const { id } = req.params;
//     Slideshow.findOne({ _id: id })
//       .lean()
//       .populate("slides")
//       .populate("entrypoint")
//       .exec()
//       .then(async (result) => {
//         if (!result) {
//           return res.status(404).send(`Could not find slideshow with id: ${id}`);
//         }

//         for (const slide of result.slides) {
//           slide.interactions = await Interaction.find({
//             user: req.user._id,
//             slide: slide._id
//           });
//         }

//         res.json(result);
//       })
//       .catch((ex) => {
//         return res.status(400).send(ex);
//       });
//   }
// );

// // @route  Get api/content/slideshows/treeitems
// // @desc   Get all slideshows counts and kinds for treeview and statistieken
// // @access Private
// router.get(
//   "/slideshows/treeitems",
//   [accessAuthor, accessTeacher],
//   passport.authenticate("jwt", {
//     session: false,
//     passReqToCallback: true
//   }),
//   async (req, res) => {
//     // Find slideshows with entrypoint of parent tag._id
//     const slideshows = await Slideshow.find()
//       .lean()
//       //.populate("slides")
//       .select("-slides")
//       .populate("entrypoint")
//       .exec();
//     // Did we not find any?
//     if (!slideshows) {
//       return res.status(400).send(`Could not find slideshows with entrypoint: ${id}`);
//     }
//     // Return data
//     return res.send(slideshows);
//   }
// );

// // @route  Get api/content/slideshows/childrenof/:id
// // @desc   Get slideshows that belong to parent book node
// // @access Private
// router.get(
//   "/slideshows/childrenof",
//   [accessAll],
//   passport.authenticate("jwt", {
//     session: false,
//     passReqToCallback: true
//   }),
//   async (req, res) => {
//     // Destructure
//     const { _id } = req.query;
//     console.log("!!!", _id);
//     // Find slideshows with entrypoint of parent tag._id
//     const slideshows = await Slideshow.find({
//       entrypoint: _id
//     })
//       .lean()
//       .populate("slides")
//       .populate("entrypoint")
//       .exec();
//     // Did we not find any?
//     if (!slideshows) {
//       return res.status(404).send(`Could not find slideshows with entrypoint: ${_id}`);
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

// // @route  Get api/slideshow/:id/interactions
// // @desc   Get all interactions with slideshow
// // @access Private
// router.get(
//   "/slideshow/:id/interactions",
//   [accessAll],
//   passport.authenticate("jwt", {
//     session: false,
//     passReqToCallback: true
//   }),
//   async (req, res) => {
//     // Destructure
//     const { id } = req.params;
//     // Find slideshow
//     const slideshow = await Slideshow.findOne({
//       _id: id
//     })
//       .lean()
//       .populate("slides")
//       .populate("entrypoint")
//       .exec();
//     if (!slideshow) {
//       return res.status(404).send(`Could not find slideshow with id: ${id}`);
//     }
//     // Find interactions with slideshow
//     const interactions = await Interaction.find({
//       user: req.user._id,
//       slide: { $in: slideshow.slides }
//     })
//       .populate("slide")
//       .exec();
//     // Return data
//     return res.send(interactions);
//   }
// );

// // @route  Get api/slideshows/tagged/:tags
// // @desc   Get slideshows that contain slides tagged with :tags
// // @access Private
// router.get(
//   "/slideshows/tagged/:tags",
//   [accessAll],
//   passport.authenticate("jwt", {
//     session: false,
//     passReqToCallback: true
//   }),
//   async (req, res) => {
//     // What tags do we want to find?
//     const tagArr = req.params.tags.split(",");
//     // Find tags, but exclude book tags
//     const tags = await Tag.find({
//       url: {
//         $in: tagArr
//       }
//     });
//     // Did we not find any?
//     if (!tags || tags.length <= 0) {
//       return res.status(404).send("Could not find any content tagged: " + tagArr.join(", "));
//     }
//     // Find slides containing those tags
//     const slides = await Slide.find({
//       tagged: {
//         $in: tags
//       }
//     });
//     // Did we not find any?
//     if (!slides || slides.length <= 0) {
//       return res.status(404).send("Could not find any slides tagged: " + tags.join(", "));
//     }
//     // Find slides containing those tags
//     const slideshows = await Slideshow.find({
//       slides: {
//         $in: slides
//       }
//     });
//     // Did we not find any?
//     if (!slideshows) {
//       return res.status(404).send("Could not find any slideshows containing slides: " + slides.join(", "));
//     }
//     // Return data
//     return res.json(slideshows);
//   }
// );

// // // @route  POST api/content/interaction/multichoice
// // // @desc   Save interaction with a slide using the MultiplechoiceInteraction model
// // // @access Private
// // router.post(
// //   "/interaction/multichoice",
// //   [accessStudent],
// //   passport.authenticate("jwt", {
// //     session: false,
// //     passReqToCallback: true
// //   }),
// //   (req, res) => {
// //     new MultiplechoiceInteraction({
// //       user: req.user._id,
// //       slide: req.body.slideId,
// //       answered: req.body.answerIds,
// //       isAccepted: req.body.isCorrect
// //     }).save(function(error, response) {
// //       if (error) {
// //         console.error(error);
// //         return res.status(400).json(error);
// //       }
// //       return res.status(200).json(response);
// //     });
// //   }
// // );

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
//       const tags = await Tag.find({ path: { $regex: `${branch_id}(?!$)` } });
//       if (!tags) {
//         return res.status(400).send({ tag: "not found!" });
//       }
//       let slideshows;
//       if (depth === "assignment") {
//         slideshows = await Slideshow.find({ _id: branch_id })
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
//         return res.status(400).send(`Moeilijksheidgraad ${depth} is onbekend!`);
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
//           return res.status(404).send(`Student with id ${student_id} is not found`);
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

module.exports = router;
