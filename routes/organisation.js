const express = require("express");
const { accessAll, accessStudent, accessTeacher, accessAdmin, accessAuthor } = require("../middleware/accessThroughRole");
const passport = require("passport");
// Models
const Organisation = require("./../models/organisation.model");
const Account = require("./../models/account.model");
const router = express.Router();
/*
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({ extended: true }));
router.use(
  cors({
    origin: "http://localhost:3000"
  })
);
*/

router.get(
  "/test",
  [accessAll],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  (req, res) => {
    res.send({ success: "heeey" });
  }
);
// Get all organisations
router.get(
  "/",
  [accessTeacher, accessAuthor, accessAdmin],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  (req, res) => {
    Organisation.find({})
      .exec()
      .then((results) => {
        res.json(results);
      })
      .catch((ex) => {
        res.send(ex);
      });
  }
);

// Which organisations employ this teacher?
router.get(
  "/employ/:teacherId",
  [accessAll],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  (req, res) => {
    Organisation.find({
      teachers: req.params.teacherId
    })
      .populate({
        path: "teachers",
        select: "-account",
        model: Account
      })
      .exec()
      .then((results) => {
        res.json(results);
      })
      .catch((ex) => {
        res.send(ex);
      });
  }
);

// Which teachers are employed by this organisation?
router.get(
  "/:organisationId/employees",
  [accessTeacher, accessAuthor, accessAdmin],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  (req, res) => {
    Organisation.find({
      teachers: req.body.organisationId
    })
      .select("-account")
      .exec()
      .then((results) => {
        res.json(results);
      })
      .catch((ex) => {
        res.send(ex);
      });
  }
);

// TODO: IMPLEMENT
router.post(
  "/teachers/",
  [accessTeacher, accessAuthor, accessAdmin],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  async (req, res) => {
    const newOrganisation = new Organisation({
      name: req.body.name,
      organisations: [req.body.organisation]
    });
    await newOrganisation.save().then((error, result) => {
      if (error) {
        res.end("Failed with error: " + error);
      }
      res.end("Saved Organisation!");
    });
  }
);

module.exports = router;
