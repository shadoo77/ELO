const { accessTeacher, accessAll } = require("../middleware/accessThroughRole");
const passport = require("passport");
const express = require("express");
const router = express.Router();
// Models
const BookCodes = require("../models/bookcode.model");
const Account = require("../models/account.model");
const Group = require("../models/group.model");
const {
  Tag,
  Publication,
  Theme,
  Paragraph,
  Assignment
} = require("../models/tag.model");
const { ProgressOverview, Progress } = require("../models/progress.model");
// Validation
const validateStudentInput = require("../validations/students");
// Services
const { userRoles, tagLevels } = require("./../services/config");
// Tools
const bcrypt = require("bcryptjs");

// @route  Get api/group/account/:acc_id
// @desc   Get account's data (students or teachers)
// @access Private
router.get(
  "/account/:acc_id",
  [accessAll],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  (req, res) => {
    Account.find({ _id: req.params.acc_id })
      .exec()
      .then((results) => {
        if (!results) {
          return res.status(404).json({
            message: "Deze gebruikers bestaat niet!"
          });
        }
        return res.status(200).json(results);
      })
      .catch((ex) => res.status(404).json(ex));
  }
);

// @route  PUT api/group/edit-student
// @desc   Edit student's info
// @access Private
router.put(
  "/edit-student",
  [accessAll],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  (req, res) => {
    const { name, group } = req.body; // The group here is the edit group ID (maybe it's a new group ID)
    const { stud_id, group_id } = req.query; // These are the current group ID and student ID
    const { errors, isValid } = validateStudentInput(req.body, "Update");
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Account.findById(stud_id).then(account => {
    //   if (!account) {
    //     return res.status(404).json({ error: "This account is not found!" });
    //   }

    //   account.name = name;
    //   account
    //     .save()
    //     .then(student => {
    //       if (group === group_id) {
    //         return res.json(student);
    //       }
    //     })
    //     .then(() => {
    //       return Group.findById(group);
    //     })
    //     .then(async newGroup => {
    //       if (newGroup.students.some(ids => ids === stud_id)) {
    //         errors.username = "This user is already in this group ";
    //         return res.status(404).json(errors);
    //       }
    //       newGroup.students.push(stud_id);
    //       await newGroup.save();
    //     })
    //     .then(() => {
    //       Group.findById(group_id).then(currGroup => {
    //         const removeIndex = currGroup.students
    //           .map(std => std)
    //           .indexOf(stud_id);
    //         currGroup.students.splice(removeIndex, 1);
    //         currGroup
    //           .save()
    //           .then(currGrp => res.json(currGrp))
    //           .catch(err => console.log(err));
    //       });
    //     })
    //     .catch(ex => {
    //       console.log("Edit error >>>>> ", ex);
    //       return res.status(400).json(ex);
    //     });
    // });

    Account.findById(stud_id)
      .then((account) => {
        if (!account) {
          return res.status(404).json({ error: "This account is not found!" });
        }
        account.name = name;
        //console.log("username", account.name); Group.findById(group)
        account
          .save()
          .then((student) => {
            // Compare between new group ID which the user selects and the current one
            if (group !== group_id) {
              Group.findById(group) // Here is a new group id
                .then((newGroup) => {
                  const isFound = newGroup.students.some(
                    (ids) => ids === stud_id
                  );
                  if (isFound) {
                    errors.username = "This user is already in this group ";
                    return res.status(404).json(errors);
                  }
                  // Add student to a new group
                  newGroup.students.push(stud_id);
                  newGroup
                    .save()
                    .then((result) => {
                      console.log("Pushed into new group : ", result);
                    })
                    .catch((err) => res.status(404).json(err));
                })
                .catch((err) => res.status(404).json(err));
              // Remove student from current group
              Group.findById(group_id) // Here is the current group id
                .then((currGroup) => {
                  const removeIndex = currGroup.students
                    .map((std) => std.toString())
                    .indexOf(stud_id);
                  currGroup.students.splice(removeIndex, 1);
                  currGroup
                    .save()
                    .then((currGrp) => res.json(currGrp))
                    .catch((err) => console.log(err));
                  res.status(200).json({
                    index: removeIndex,
                    studentID: stud_id
                  });
                })
                .catch((err) => res.status(404).json(err));
            } else return res.status(200).json(student);
          })
          .catch((err) => res.status(404).json(err));
      })
      .catch((err) => res.status(404).json(err));
  }
);

// @route  POST api/group/addNew-student
// @desc   Check if there is a student with these login info
// @access Private
router.post(
  "/addNew-student",
  [accessAll],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  async (req, res) => {
    const { name, username, password, group } = req.body;
    const { errors, isValid } = validateStudentInput(req.body, "Create");
    if (!isValid) {
      return res.status(400).json(errors);
    }
    try {
      const userCode = await BookCodes.findOne({
        "account.username": username
      });
      if (!userCode) {
        errors.username = "User not found!";
        return res.status(404).json(errors);
      }
      const isValidPassword = await bcrypt.compare(
        password,
        userCode.account.password
      );
      if (!isValidPassword) {
        errors.password = "Invalid password!";
        return res.status(404).json(errors);
      }
      if (userCode.inUseBy) {
        errors.username = "This user is in use ";
        return res.status(404).json(errors);
      }
      const newStudent = new Account({
        name,
        account: {
          username,
          password: userCode.account.password
        },
        role: userRoles.STUDENT,
        isActivated: true
      });
      newStudent.save().then((user) => {
        userCode.inUseBy = user._id;
        userCode.activatedBy = req.user._id;
        userCode
          .save()
          .then(() => {
            Group.findById(group)
              .then((currentGroup) => {
                if (!currentGroup) {
                  return res.status(404).json({
                    error: "This group is not found!"
                  });
                }

                const isFound = currentGroup.students.some(
                  (ids) => ids === user._id
                );
                if (isFound) {
                  errors.username = "This user is already in this group ";
                  return res.status(404).json(errors);
                } else {
                  currentGroup.students.push(user._id);
                  currentGroup
                    .save()
                    .then(async (newStudentID) => {
                      await makeEmptyFieldForNewUser(newStudent);
                      return res.json(newStudentID);
                    })
                    .catch((err) => res.status(404).json(err));
                }
              })
              .catch((err) => res.status(404).json(err));
          })
          .catch((err) => res.status(404).json(err));
      });
    } catch (error) {
      console.log(error);
      return res.status(404).json(err);
    }
    //   BookCodes.findOne({ "account.username": username })
    //     .then((codeUser) => {
    //       if (!codeUser) {
    //         errors.username = "User not found!";
    //         return res.status(404).json(errors);
    //       }
    //       bcrypt
    //         .compare(password, codeUser.account.password)
    //         .then((isValidPassword) => {
    //           if (!isValidPassword) {
    //             errors.password = "Invalid password!";
    //             return res.status(404).json(errors);
    //           } else {
    //             if (!codeUser.inUseBy || codeUser.inUseBy.length < 1) {
    //               const newStudent = new Account({
    //                 name,
    //                 account: {
    //                   username,
    //                   password: codeUser.account.password
    //                 },
    //                 role: userRoles.STUDENT,
    //                 isActivated: true
    //               });
    //               newStudent
    //                 .save()
    //                 .then((user) => {
    //                   codeUser.inUseBy = user._id;
    //                   codeUser.activatedBy = req.user._id;
    //                   codeUser
    //                     .save()
    //                     .then(() => {
    //                       Group.findById(group)
    //                         .then((currentGroup) => {
    //                           if (!currentGroup) {
    //                             return res.status(404).json({
    //                               error: "This group is not found!"
    //                             });
    //                           }

    //                           const isFound = currentGroup.students.some((ids) => ids === user._id);
    //                           if (isFound) {
    //                             errors.username = "This user is already in this group ";
    //                             return res.status(404).json(errors);
    //                           } else {
    //                             currentGroup.students.push(user._id);
    //                             currentGroup
    //                               .save()
    //                               .then((newStudentID) => res.json(newStudentID))
    //                               .catch((err) => res.status(404).json(err));
    //                           }
    //                         })
    //                         .catch((err) => res.status(404).json(err));
    //                     })
    //                     .catch((err) => res.status(404).json(err));
    //                 })
    //                 .catch((err) => console.log(err));
    //             } else {
    //               errors.username = "This user is in use ";
    //               return res.status(404).json(errors);
    //             }
    //           }
    //         })
    //         .catch((err) => res.status(404).json(err));
    //     })
    //     .catch((err) => res.status(404).json(err));
  }
);

// @route  PUT api/group/student-activate
// @desc   Change isActivated status of a student
// @access Private
router.put(
  "/student-activate",
  [accessAll],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  (req, res) => {
    const { std_isActivated, std_id } = req.body;
    Account.findById(std_id)
      .then((user) => {
        if (!user) {
          return res.status(404).json("User not found");
        }
        user.isActivated = std_isActivated;
        user
          .save()
          .then((student) => res.json(student))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
);

// @route  DELETE api/group/student-delete/:student_id
// @desc   Delete a student
// @access Private
router.delete(
  "/student-delete/:student_id",
  [accessAll],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  (req, res) => {
    Account.findById(req.params.student_id)
      .then((user) => {
        if (!user) {
          return res.status(404).json("User not found");
        }
        user.deleteOne().then(() => res.status(200).json({ deleted: true }));
      })
      .catch((err) => console.log(err));
  }
);

async function makeEmptyFieldForNewUser(newStudent) {
  try {
    const themas = await Tag.find({ __t: tagLevels.THEME });
    if (!themas.length) {
      console.log("No themas found!");
    }
    let overview = new ProgressOverview({
      user: newStudent._id,
      publication: themas[0].parent,
      themes: themas.map((theme) => ({
        tag: theme,
        correct: 0,
        wrong: 0,
        attempts: 0
      }))
    });
    await overview.save();
    console.log("[Saved empty field overview table : ]", newStudent.name);
    for (let ti = 0; ti < themas.length; ti++) {
      const paragraphs = await Tag.find({
        __t: tagLevels.PARAGRAPH,
        parent: themas[ti]
      });
      const assignments = await Tag.find({
        __t: tagLevels.ASSIGNMENT,
        parent: { $in: paragraphs }
      });
      let progress = new Progress({
        user: newStudent._id,
        parent: themas[ti]._id,
        difficulty: themas[ti].difficulty,
        theme: themas[ti],
        publication: themas[ti].parent,
        paragraphs: paragraphs.map((paragraph) => ({
          tag: paragraph,
          correct: 0,
          wrong: 0,
          attempts: 0
        })),
        assignments: assignments.map((assignment) => ({
          tag: assignment,
          correct: 0,
          wrong: 0,
          attempts: 0
        }))
      });
      await progress.save();
      console.log("[Saved empty field details table : ]", newStudent.name);
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = router;
