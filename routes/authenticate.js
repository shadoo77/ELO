const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Call mail service
const sendEmail = require("../services/emailService");
// Models
const Account = require("./../models/account.model");
const ResetPassword = require("./../models/resetPassword.model");
const Client = require("../models/client.model");

// Import validation function
const validateStudentInput = require("./../validations/login");
const validateUserInput = require("./../validations/userLogin");
const validateEmail = require("./../validations/forgotPassword");
const validateResetPassword = require("./../validations/resetPassword");

// Import user roles
const { userRoles, mailTemplates } = require("../services/config");

const router = express.Router();

// Student login form
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  // Call validation function
  const { errors, isValid } = validateStudentInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  try {
    Account.findOne({
      "account.username": username
    })
      .exec()
      .then(async result => {
        if (!result) {
          // Could not find username
          errors.username = "Gebruikersnaam bestaat niet!";
          return res.status(404).json(errors);
        } else {
          const validated = await bcrypt.compare(
            password,
            result.account.password
          );
          if (!validated) {
            // Invalid password
            errors.password = "Wachtwoord is onjuist!";
            return res.status(400).json(errors);
          } else {
            if (!result.isActivated) {
              // Check if the account is not activated
              errors.username = "Deze student is niet geactiveerd!";
              return res.status(403).json(errors);
            }
            if (result.role === userRoles.STUDENT) {
              console.log("LOGIN ACCEPTED!");
              return res.send(
                result.generateAuthToken(
                  req.connection.remoteAddress,
                  Date.now()
                )
              );
            }
          }
        }
      })
      .catch(error => {
        return res.send(error);
      });
  } catch (error) {
    return res.status(404).send(err);
  }
});

// User login form (Teachers, Authors and Admin)
// Student login form
router.post("/user-login", (req, res) => {
  const { email, password } = req.body;
  // Call validation function
  const { errors, isValid } = validateUserInput(req.body, "Login");
  if (!isValid) {
    return res.status(401).json(errors);
  }

  Account.findOne({
    "account.email": email
  })
    .exec()
    .then(async result => {
      if (!result) {
        // Could not find email, but always give
        // ambiguous feedback when authenticating"
        errors.email = "Deze account bestaat niet!";
        return res.status(404).json(errors);
      } else {
        const validated = await bcrypt.compare(
          password,
          result.account.password
        );
        if (!validated) {
          // Invalid password, but always give ambiguous
          // feedback when authenticating
          errors.password = "Wachtwoord is onjuist!";
          return res.status(400).json(errors);
        } else {
          if (!result.isActivated) {
            // ambiguous feedback when authenticating /
            errors.notActivated =
              "Deze account is nog niet geactiveerd!, U moet wachten totdat de beheer uw account laat activeren";
            return res.status(403).json(errors);
          }
          if (result.role !== userRoles.STUDENT) {
            return res.send(
              result.generateAuthToken(req.connection.remoteAddress, Date.now())
            );
          } else {
            errors.email = "Deze email bestaat niet!";
            return res.status(404).json(errors);
          }
        }
      }
    })
    .catch(error => {
      return res.send(error);
    });
});

// @route  GET api/auth/user-register
// @desc   Register user
// @access Public
router.post("/user-register", (req, res) => {
  const { errors, isValid } = validateUserInput(req.body, "Register");
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { name, username, email, password, role } = req.body;
  Account.findOne({ "account.email": email })
    .then(user => {
      if (user) {
        return res.status(400).json({
          email: "Email is al bestaan, voer andere email in!"
        });
      } else {
        const newUser = new Account({
          name,
          account: { username, email, password },
          isActivated: true,
          role
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            newUser.account.password = hash;
            newUser
              .save()
              .then(user => res.status(200).json(user))
              .catch(err => console.log(err));
          });
        });
      }
    })
    .catch(err => res.status(404).json(err));
});

// @route  POST api/auth/forgot-password
// @desc   Forgot password
// @access Public
router.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  // Call validation function
  const { errors, isValid } = validateEmail(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Account.findOne({
    "account.email": email
  })
    .exec()
    .then(async user => {
      if (!user) {
        // Could not find email, but always give
        // ambiguous feedback when authenticating"
        errors.notFound =
          "Wij hebben jouw email niet gevonden, weet u zeker dat u een account hebt met deze email?";
        return res.status(400).json(errors);
      }
      const token = crypto.randomBytes(20).toString("hex");
      const expires = Date.now() + 3600000;

      ///// Go to rest password document and looking for this user
      ResetPassword.findOne({ user: user._id })
        .then(person => {
          if (person) {
            // Update
            ResetPassword.findOneAndUpdate(
              { user: user.id },
              { $set: { token, expires } },
              { new: true },
              (err, doc) => {
                //console.log("findAndUpdate query : ", err ? err : doc);
                if (err) return res.status(404).json(err);
              }
            );
          } else {
            // Create
            new ResetPassword({
              user: user._id,
              token,
              expires
            }).save(err => {
              if (err) return res.status(404).json(err);
            });
          }
        })
        .catch(err => res.status(404).json(err));
      ////////////////////////////////////////////////////////////
      const resetMail = {
        from: "kleurrijker.test@gmail.com",
        to: user.account.email,
        subject: "Wachtwoord vergeten",
        userName: user.name,
        token,
        template: mailTemplates.PASSWOR_RESET
      };
      sendEmail(resetMail, (err, response) => {
        if (err) {
          console.error("there was an error: ", err);
          errors.notFound =
            "Er is een storing in mail server , probeer maar eens later A.U.B";
          return res.status(404).json(errors);
        } else {
          console.error("successful response : ", response);
          const success = `Wij hebben zo juist een bericht gestuurd naar ${user.account.email}, daarop staat de instructies waarmee u uw wachtwoord opnieuw kunt instellen .`;
          return res.status(200).json({ success });
        }
      });
    })
    .catch(err => {
      return res.status(404).json(err);
    });
});

// @route  GET api/auth/reset-password
// @desc   Reset password
// @access Public
router.get("/reset-password", (req, res) => {
  let errors = {};
  ResetPassword.findOne({
    token: req.query.resetPasswordToken
  })
    .populate({
      path: "user",
      model: "account"
    })
    .exec()
    .then(field => {
      if (!field) {
        errors.invalid = "Password reset link is invalid or has expired!";
        return res.status(403).json(errors);
      }
      if (field.expires <= Date.now()) {
        errors.invalid = "Password reset link is invalid or has expired!";
        return res.status(403).json(errors);
      }
      res.status(200).json({
        userID: field.user._id,
        name: field.user.name
      });
    })
    .catch(err => {
      return res.status(404).json(err);
    });
});

// @route  POST api/auth/reset-password
// @desc   Reset password
// @access Public
router.post("/reset-password", (req, res) => {
  const { id, newPassword } = req.body;
  // Call validation function
  const { errors, isValid } = validateResetPassword(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  Account.findById(id)
    .then(user => {
      if (!user) {
        errors.notFound = "Helaas wij hebben uw account niet gevonden!";
        return res.status(404).json(errors);
      }

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newPassword, salt, (err, hash) => {
          if (err) throw err;
          user.account.password = hash;
          user
            .save()
            .then(() =>
              res.status(200).json({
                success:
                  "Super! Uw wachtwoord is gewijzigd , u kunt nu inloggen met uw nieuwe wachtwoord"
              })
            )
            .catch(err => res.status(404).json(err));
        });
      });
    })
    .catch(err => {
      return res.status(404).json(err);
    });
});

// @route  DELETE api/auth/logout
// @desc   Logout user
// @access Public
router.delete("/logout/:userID", (req, res) => {
  Client.findOne({ client: req.params.userID })
    .then(client => {
      if (!client) {
        return res.status(400).json({ notFound: "already loged out" });
      }
      client.remove().then(() => res.status(200).json({ deleted: true }));
    })
    .catch(err => res.status(404).json(err));
});

module.exports = router;
