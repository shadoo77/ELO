const express = require("express");

const router = express.Router();
// Passport
const {
  accessTeacher,
  accessStudent,
  accessAuthor,
  accessAll
} = require("../middleware/accessThroughRole");
const passport = require("passport");
// Models
const { Tag } = require("../models/tag.model");
// Config
const { tagLevels } = require("../services/config");

// @route  Get api/tree/root
// @desc   Get root id
// @access Private
router.get(
  "/root",
  [accessAll],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  async (req, res) => {
    try {
      const alfa = await Tag.findOne({
        __t: tagLevels.PUBLICATION
      });
      if (!alfa) {
        return res.status(400).send(`Can't find alfa tag`);
      }
      return res.status(200).send(alfa.parent);
    } catch (error) {
      console.log(error);
      return res.status(404).send(error);
    }
  }
);

// @route  Get api/tree/alfa
// @desc   Get alfa id
// @access Private
router.get(
  "/alfa",
  [accessAll],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  async (req, res) => {
    try {
      const alfa = await Tag.findOne({
        __t: tagLevels.PUBLICATION
      });
      if (!alfa) {
        return res.status(400).send(`Can't find alfa tag`);
      }
      return res.status(200).send(alfa);
    } catch (error) {
      return res.status(404).send(err);
    }
  }
);

// @route  Get api/tree/id/:id
// @desc   Get tree hierarchy starting by tag with :id
// @access Private
router.get(
  "/id/:id",
  [accessAll],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  async (req, res) => {
    try {
    

      // Destructure
      const { id } = req.params;
      // Find publication root (for now just hardcode Alfa)
      const root = await Tag.findOne({
        _id: id
      })
        .then(results => results)
        .catch(err => {
          res.status(404).send(err);
        });
      if (!root) {
        return res.status(400).send(`Can't find tag with id: ${id}`);
      }
      // Find tree starting at the root we just found
      const tree = await root.getChildrenTree({
        options: {
          lean: true
        }
      });
      if (!tree) {
        return res
          .status(400)
          .send(`Could not find children tags of parent: ${name}`);
      }

      return res.send(tree[0]);
    } catch (error) {
      return res.status(404).send(err);
    }
  }
);

// // @route  Get api/tree/name/:name
// // @desc   Get tree hierarchy starting by tag with :name
// // @access Private
// router.get("/name/:name", [auth], async (req, res) => {
//   // Destructure
//   const { name } = req.params;
//   // Find publication root (for now just hardcode Alfa)
//   const root = await Tag.findOne({
//     value: name
//   });
//   if (!root) {
//     return res.status(400).send(`Can't find tag with value: ${name}`);
//   }
//   // Find tree starting at the root we just found
//   const tree = await root.getChildrenTree({
//     options: {
//       lean: true
//     }
//   });
//   if (!tree) {
//     return res.status(400).send("Could not find children tags of parent: " + name);
//   }
//   return res.send(tree[0]);
// });

// @route  Get api/tree/childrenof/:id
// @desc   Get immediate children of parent tag by id
// @access Private
router.get(
  "/childrenof/:id",
  [accessAll],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  async (req, res) => {
    // Destructure
    const { id } = req.params;
    // Find parent tag by id
    const parent = await Tag.findOne({
      _id: id
    });
    if (!parent) {
      return res.status(400).send(`Can't find tag with id: ${id}`);
    }
    // Find children of parent tag
    const children = await parent.getImmediateChildren();
    if (!children) {
      return res
        .status(400)
        .send(`Could not find children tags of parent: ${parent}`);
    }
    return res.send(children);
  }
);

// @route  Get api/tree/parent-branches/treeId/:treeId/
// @desc   Get tree hierarchy starting by tag with :id
// @access Private
router.get(
  "/parent-branches/treeId/:treeId",
  [accessAll],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  async (req, res) => {
    // Destructure
    const { treeId } = req.params;
    // Find publication root (for now just hardcode Alfa)
    const root = await Tag.findOne({
      _id: treeId
    })
      .then(results => results)
      .catch(err => {
        res.status(404).send(err);
      });
    if (!root) {
      return res.status(400).send(`Can't find tag with id: ${id}`);
    }
    // Find tree starting at the root we just found
    const tree = await root.getChildrenTree({
      options: {
        lean: true
      }
    });
    if (!tree) {
      return res
        .status(400)
        .send(`Could not find children tags of parent: ${name}`);
    }
    return res.send(tree[0]);
  }
);

// @route  Get api/tree/id/:id
// @desc   Get tree hierarchy starting by tag with :id
// @access Private
router.get(
  "/rootTree",
  [accessAll],
  passport.authenticate("jwt", {
    session: false,
    passReqToCallback: true
  }),
  async (req, res) => {
    try {
     
      const alfa = await Tag.findOne({
        __t: tagLevels.PUBLICATION
      });
      if (!alfa) {
        return res.status(400).send(`Can't find alfa tag`);
      }
      // Find publication root (for now just hardcode Alfa)
      const root = await Tag.findOne({
        _id: alfa.parent
      })
        .then(results => results)
        .catch(err => {
          res.status(404).send(err);
        });
      if (!root) {
        return res.status(400).send(`Can't find tag with id: ${id}`);
      }
      // Find tree starting at the root we just found
      const tree = await root.getChildrenTree({
        options: {
          lean: true
        }
      });
      if (!tree) {
        return res
          .status(400)
          .send(`Could not find children tags of parent: ${name}`);
      }

      return res.send(tree[0]);
    } catch (error) {
      return res.status(404).send(err);
    }
  }
);

module.exports = router;
