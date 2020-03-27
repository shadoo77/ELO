const bcrypt = require("bcrypt");
const db = require("../../services/db");
const BookCode = require("../../models/bookcode.model");

module.exports = async salt => {
  const codesObject = {};
  const numberOfUsers = 20;
  try {
    await db.deleteCollection("bookcodes");
    for (let i = 1; i <= numberOfUsers; i++) {
      const code = new BookCode({
        account: {
          username: `CURS00${i}`,
          password: await bcrypt.hash("abcde", salt)
        }
      });
      await code.save();
      codesObject[`code${i}`] = code;
    }
    return codesObject;
  } catch (ex) {
    throw new Error(`[Rebuilding codes] Failed with message: ${ex.message}`);
  }
};
