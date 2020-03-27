const validator = require("validator");
const isEmpty = require("./is-empty");

const validateForgotPassword = data => {
  let { email } = data;
  let errors = {};

  email = !isEmpty(email) ? email : "";

  if (!validator.isEmail(email)) {
    errors.email = "Email is ongeldig!";
  }

  if (validator.isEmpty(email)) {
    errors.email = "Email invoer veld is verplicht!";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateForgotPassword;
