const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const Account = require("../models/account.model");
const Client = require("../models/client.model");

const opt = {};
opt.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opt.secretOrKey = "SomeSecretKey";
opt.passReqToCallback = true;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opt, (req, res, next) => {
      Account.findById(res._id)
        .then((token) => {
          // Get the access token from database
          Client.findOne({
            client: res._id
          }).then((result) => {
            if (!result) {
              // We weten wie de request plaatst. Er is alleen geen client bekend
              // Wat doen we? Log uit
              console.log("MOFO THERE IS NO CLIENT?!");
              return next(null, false);
            } else {
              const clientSessionStart = new Date(
                result.sessionStart
              ).getTime();
              if (res && clientSessionStart !== res.sessionStart) {
                console.log("USER LOGGED IN TWICE");
                return next(null, false);
              }
            }

            const isFound = req.accessRole.includes(res.role);
            if (token && isFound) {
              console.log("WELCOME!");
              return next(null, token);
            } else if (!isFound) return next(null, false);
          });
        })
        .catch((err) => {
          console.error("passport error: ", err);
          return next(null, false);
        });
    })
  );
};
