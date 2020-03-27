const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = data => {
  let { name, organisation, lessTimes, teachers } = data;
  let errors = {};

  const nameRgex = /^[a-zA-Z0-9.\-_$@*!]{3,30}$/;

  name = !isEmpty(name) ? name : "";
  organisation = !isEmpty(organisation) ? organisation : "";

  if (!validator.isLength(name, { min: 3, max: 30 })) {
    errors.name = "Naam moet tussen 3 en 30 letters zijn!";
  }

  if (!name.match(nameRgex)) {
    errors.name = "Naam moet tussen 3 en 30 letters zijn!!";
  }

  if (validator.isEmpty(name)) {
    errors.name = "Naam invoer veld is verplicht!";
  }

  if (validator.isEmpty(organisation)) {
    errors.organisation = "Organisatie invoer veld is verplicht!";
  }

  if (!Array.isArray(lessTimes) || isEmpty(lessTimes)) {
    errors.lessTimes = "Voeg lestijden toe!";
  }

  if (!Array.isArray(teachers) || isEmpty(teachers)) {
    errors.teachers = "Voeg tenminste één docent toe!";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
