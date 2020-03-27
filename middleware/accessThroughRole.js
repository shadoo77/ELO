const { userRoles } = require("../services/config");

const accessTeacher = (req, res, next) => {
  if (!req.accessRole) req.accessRole = [userRoles.TEACHER];
  else req.accessRole.push(userRoles.TEACHER);
  next();
};

const accessStudent = (req, res, next) => {
  if (!req.accessRole) req.accessRole = [userRoles.STUDENT];
  else req.accessRole.push(userRoles.STUDENT);
  next();
};

const accessAuthor = (req, res, next) => {
  if (!req.accessRole) req.accessRole = [userRoles.AUTHOR];
  else req.accessRole.push(userRoles.AUTHOR);
  next();
};

const accessAdmin = (req, res, next) => {
  if (!req.accessRole) req.accessRole = [userRoles.ADMIN];
  else req.accessRole.push(userRoles.ADMIN);
  next();
};

const accessAll = (req, res, next) => {
  req.accessRole = Object.keys(userRoles).map(
    key => userRoles[key]
  );
  next();
};

module.exports = {
  accessTeacher,
  accessStudent,
  accessAuthor,
  accessAdmin,
  accessAll
};
