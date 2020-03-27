const { accessTeacher } = require("../middleware/accessThroughRole");
const passport = require("passport");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Group = require("../models/group.model");
const Account = require("../models/account.model");
const Organisation = require("../models/organisation.model");
// Import validation function
const validateGroup = require("./../validations/group");

router.get(
  "/all/:teacher_id",
  [accessTeacher],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  (req, res) => {
    Organisation.find({
      teachers: req.params.teacher_id
    })
      .select("_id")
      .exec()
      .then(results => {
        Group.find({
          organisation: {
            $in: results
          }
        })
          .exec()
          .then(results => {
            res.json(results);
          })
          .catch(ex => {
            res.status(400).json(ex);
          });
      })
      .catch(ex => {
        res.send(ex);
      });
  }
);

async function getGroupById(id) {
  const result = await Group.findOne({
    _id: id
  })
    .populate({
      path: "organisation",
      model: "organisation",
      populate: {
        path: "teachers",
        model: "account",
        select: "-account"
      }
    })
    .populate({
      path: "students",
      model: "account"
    })
    .exec();
  return result;
}

router.get(
  "/",
  [accessTeacher],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  async (req, res) => {
    try {
      const result = await getGroupById(req.query._id);
      return res.json(result);
    } catch (ex) {
      return res.status(400).send(ex);
    }
  }
);

// TODO: Change from find() to findOne()
router.get(
  "/:id",
  [accessTeacher],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  async (req, res) => {
    try {
      const result = await getGroupById(req.params.id);
      return res.json(result);
    } catch (ex) {
      return res.status(400).send(ex);
    }
  }
);

router.get(
  "/taughtby/:teacherID",
  [accessTeacher],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  (req, res) => {
    Group.find({
      teachers: req.params.teacherID
    })
      .populate({
        path: "organisation",
        model: "organisation",
        populate: {
          path: "teachers",
          model: "account",
          select: "-account"
        }
      })
      .populate({
        path: "students",
        model: "account"
      })
      .exec()
      .then(results => {
        res.json(results);
      })
      .catch(ex => {
        res.status(400).json(ex);
      });
  }
);

router.post(
  "/",
  [accessTeacher],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  async (req, res) => {
    // Call validation function
    const { errors, isValid } = validateGroup(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    try {
      const newGroup = {
        _id: req.body.id !== "" ? req.body.id : new mongoose.Types.ObjectId(),
        name: req.body.name,
        organisation: req.body.organisation,
        lessTimes: req.body.lessTimes,
        teachers: req.body.teachers,
        students: req.body.students
      };
      await Group.findOneAndUpdate(
        {
          _id: newGroup._id
        },
        newGroup,
        {
          upsert: true
        }
      ).then((result, error) => {
        if (error) {
          return res
            .status(400)
            .send("Failed to add group, here's a list of reasons why?" + error);
        }
        return res.status(201).json(newGroup);
      });
    } catch (ex) {
      return res.status(400).json(ex);
    }
  }
);

router.post(
  "/student",
  [accessTeacher],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  async (req, res) => {
    try {
      new Account({
        account: req.body.account
      })
        .save()
        .then(student => {
          Group.find({
            _id: req.body.group._id
          }).then(group => {
            group.students.push(student);
            group.save();
            res.json(student);
          });
        });
    } catch (ex) {
      res.status(400).json(ex);
    }
  }
);

router.delete(
  "/:id",
  [accessTeacher],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  async (req, res) => {
    await Group.findById(req.params.id).remove();
    res.send("Deleted!");
  }
);

// @route  PUT api/group/enable-disable/:id
// @desc   Update group status so that becomes active or inactive
// @access Private
router.put(
  "/enable-disable/:id",
  [accessTeacher],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  async (req, res) => {
    const group = await Group.findById(req.params.id);
    group.isActive = !group.isActive;
    group.save(err => {
      if (err) {
        res.status(404).json(err);
      }
    });
    res.send("Updated!");
  }
);

module.exports = router;
