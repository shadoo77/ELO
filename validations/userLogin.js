const validator = require("validator");
const isEmpty = require("./is-empty");

const validateUserInput = (data, method) => {
  let { name, username, email, password, confirmPassword, role } = data;
  let errors = {};

  const usernameRegex = /^[a-zA-Z0-9.\-_$@*!]{3,30}$/;
  //const meduimPasswordRegex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{5,})/;
  const meduimPasswordRegex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])))(?=.{5,})/;

  name = !isEmpty(name) ? name : "";
  username = !isEmpty(username) ? username : "";
  email = !isEmpty(email) ? email : "";
  password = !isEmpty(password) ? password : "";
  confirmPassword = !isEmpty(confirmPassword) ? confirmPassword : "";
  role = !isEmpty(role) ? role : "";

  if (!validator.isEmail(email)) {
    errors.email = "Email is ongeldig!";
  }

  if (validator.isEmpty(email)) {
    errors.email = "Email invoer veld is verplicht!";
  }

  if (!password.match(meduimPasswordRegex)) {
    errors.password = "Wachtwoord is ongeldig!";
  }

  if (validator.isEmpty(password)) {
    errors.password = "Wachtwoord veld is verplicht!";
  }

  if (method === "Register") {
    if (!validator.isLength(name, { min: 3, max: 50 })) {
      errors.name = "Name moet tussen 3 en 50 letters zijn!";
    }

    if (validator.isEmpty(name)) {
      errors.name = "Name invoer veld is verplicht!";
    }

    if (!validator.isLength(username, { min: 3, max: 30 })) {
      errors.username = "Username moet tussen 3 en 30 letters zijn!";
    }

    if (!username.match(usernameRegex)) {
      errors.username = "Ongeldige username!";
    }

    if (validator.isEmpty(username)) {
      errors.username = "Username invoer veld is verplicht!";
    }

    if (!password.match(meduimPasswordRegex)) {
      errors.password =
        "Ongeldige wachtwoord, voer tenminste 1 letter of 1 nummer in";
    }

    if (validator.isEmpty(password)) {
      errors.password = "Wachtwoord invoer veld is verplicht!";
    }

    if (!validator.equals(password, confirmPassword)) {
      errors.confirmPassword =
        "Wachtwoord bevestiging moet hetzelfde als wachtwoord!";
    }

    if (validator.isEmpty(confirmPassword)) {
      errors.confirmPassword = "Wachtwoord bevestigen veld is verplicht!";
    }

    if (!validator.isNumeric(role)) {
      errors.role = "Role should be number";
    }

    if (validator.isEmpty(role)) {
      errors.role = "Role is required";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateUserInput;
