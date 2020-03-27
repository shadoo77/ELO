const validator = require("validator");
const isEmpty = require("./is-empty");

const validateStudentInput = data => {
  let { username, password } = data;
  let errors = {};
  /*
validationSchema = {
   username: Joi.string()
     .required()
     .regex(/^CURS[0-9]{4}$/)
     .label("Gebruikersnaam"),
   password: Joi.string()
     .required()
     .regex(/^[a-zA-Z]{5}$/)
     .label("Wachtwoord")
 };
*/
  const usernameReg = /^[a-zA-Z0-9.\-_$@*!]{3,30}$/;
  const passwordReg = /^[a-zA-Z0-9]{5,30}$/;

  username = !isEmpty(username) ? username : "";
  password = !isEmpty(password) ? password : "";

  if (validator.isEmpty(username)) {
    errors.username = "Username invoer veld is verplicht!";
  } else if (!validator.isLength(username, { min: 3, max: 30 })) {
    errors.username = "Username moet tussen 3 en 30 letters zijn!";
  } else if (!username.match(usernameReg)) {
    errors.username = "Ongeldige username!";
  }

  if (validator.isEmpty(password)) {
    errors.password = "Wachtwoord invoer veld is verplicht!";
  } else if (!validator.isLength(password, { min: 3, max: 30 })) {
    errors.password = "Wachtwoord moet tussen 3 en 30 letters zijn!";
  } else if (!password.match(passwordReg)) {
    errors.password = "Ongeldige wachtwoord!";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
module.exports = validateStudentInput;
