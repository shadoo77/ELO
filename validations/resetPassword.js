const validator = require("validator");
const isEmpty = require("./is-empty");

const validateResetPassword = data => {
  let { newPassword, confirmNewPassword } = data;
  let errors = {};

  const meduimPasswordRegex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])))(?=.{5,})/;

  newPassword = !isEmpty(newPassword) ? newPassword : "";
  confirmNewPassword = !isEmpty(confirmNewPassword) ? confirmNewPassword : "";

  if (!newPassword.match(meduimPasswordRegex)) {
    errors.newPassword =
      "Ongeldige wachtwoord, voer tenminste 1 letter of 1 nummer in";
  }

  if (validator.isEmpty(newPassword)) {
    errors.newPassword = "Wachtwoord invoer veld is verplicht!";
  }

  if (!validator.equals(newPassword, confirmNewPassword)) {
    errors.confirmNewPassword =
      "Wachtwoord bevestiging moet hetzelfde als wachtwoord!";
  }

  if (validator.isEmpty(confirmNewPassword)) {
    errors.confirmNewPassword = "Wachtwoord bevestigen veld is verplicht!";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateResetPassword;
