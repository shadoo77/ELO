const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   const token = req.header("Authorization"); //   x-auth-token
//   req.token = token;
//   //next();
//   if (!token) {
//     return res.status(401).send("Acces denied, no token provided!");
//   }
//   try {
//     // TODO: Use environment var as secret key
//     req.token = jwt.verify(token, "SomeSecretKey");
//     next();
//   } catch (ex) {
//     res.status(400).send("Acces denied, invalid token provided!");
//   }
// };
