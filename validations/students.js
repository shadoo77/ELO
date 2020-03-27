const validator = require("validator");
const isEmpty = require("./is-empty");

const validateStudentInput = (data, method) => {
  let { name, username, group } = data;
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
  const usernameReg = /^CURS[0-9]{4}$/;

  name = !isEmpty(name) ? name : "";
  username = !isEmpty(username) ? username : "";
  group = !isEmpty(group) ? group : "";

  if (validator.isEmpty(name)) {
    errors.name = "Name invoer veld is verplicht!";
  }

  if (!validator.isLength(name, { min: 3, max: 50 })) {
    errors.name = "Name moet tussen 3 en 50 letters zijn!";
  }

  if (validator.isEmpty(username)) {
    errors.username = "Username invoer veld is verplicht!";
  }

  if (!validator.isLength(username, { min: 3, max: 30 })) {
    errors.username = "Username moet tussen 3 en 30 letters zijn!";
  }

  if (!username.match(usernameReg)) {
    errors.username = "Ongeldige username!";
  }

  if (validator.isEmpty(group)) {
    errors.group = "Group select kan niet leeg zijn!";
  }

  if (method === "Create") {
    let { password } = data;
    const passwordReg = /^[a-zA-Z]{5}$/;
    password = !isEmpty(password) ? password : "";
    if (validator.isEmpty(password)) {
      errors.password = "Wachtwoord invoer veld is verplicht!";
    }

    if (!validator.isLength(password, { min: 3, max: 30 })) {
      errors.password = "Wachtwoord moet tussen 3 en 30 letters zijn!";
    }

    if (!password.match(passwordReg)) {
      errors.password = "Ongeldige wachtwoord!";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateStudentInput;
