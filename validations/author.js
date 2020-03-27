const validator = require("validator");
const isEmpty = require("./is-empty");

const validateNewThema = data => {
  let { value, icon, color } = data;
  let errors = {};

  const colorRegex = /^#([0-9a-f]{3}){1,2}$/;

  value = !isEmpty(value) ? value : "";
  icon = !isEmpty(icon) ? icon : "";
  color = !isEmpty(color) ? color : "";

  if (!validator.isLength(value, { min: 3, max: 30 })) {
    errors.value = "Thema's naam is ongeldig!";
  }

  if (validator.isEmpty(value)) {
    errors.value = "Thema's naam invoer veld is verplicht!";
  }

  if (!validator.isLength(icon, { min: 3, max: 30 })) {
    errors.icon = "Thema's icon is ongeldig!";
  }

  if (validator.isEmpty(icon)) {
    errors.icon = "Icon invoer veld is verplicht!";
  }

  if (!color.match(colorRegex)) {
    errors.color = "Kleur is ongeldig!";
  }

  if (validator.isEmpty(color)) {
    errors.color = "Kleur veld is verplicht!";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = { validateNewThema };
