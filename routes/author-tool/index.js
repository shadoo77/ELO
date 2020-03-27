const express = require("express");
const bcrypt = require("bcrypt");

//const { accessAuthor } = require("../../middleware/accessThroughRole");
//const passport = require("passport");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
// Utils and generating
const { appendErrorsToTextFile, readXlxsFile } = require("./utils");
const generateTags = require("./generateTags");
const createCodes = require("./createCodes");
const createAccounts = require("./createAccounts");
const createOrganisations = require("./createOrganisations");
const createGroups = require("./createGroups");
const generateProgress = require("./generateProgress");
const generateAlfaContent = require("./audio-fragmenten/index");

// ////// Create folder for save csv files
// // add json file handling
if (!fs.existsSync("./uploaded-files")) {
  fs.mkdirSync("./uploaded-files");
}
const uniqueFileName = crypto.randomBytes(20).toString("hex");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploaded-files");
  },
  filename: (req, file, cb) => {
    const newFilename = `${uniqueFileName}${path.extname(file.originalname)}`;
    cb(null, newFilename);
  }
});
// create the multer instance that will be used to upload/save the file
const upload = multer({ storage });

// @route  POST api/author/db-fill
// @desc   Save data from CSV file into database
// @access Private
router.post(
  "/db-fill",
  //   [accessAll],
  //   passport.authenticate("jwt", { session: false, passReqToCallback: true }),
  upload.single("selectedFile"),
  async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      console.log("[ ======= ] salt code generated! ");
      const codes = await createCodes(salt);
      console.log("[ ======= ] Book Codes generated! ");
      const accounts = await createAccounts(salt, codes);
      console.log("[ ======= ] Accounts generated! ");
      const organisations = await createOrganisations(accounts);
      console.log("[ ======= ] Organisations generated! ");
      const groups = await createGroups(accounts, organisations);
      console.log("[ ======= ] Groups generated! ");
      // Reading from Xlsx file
      const filePath = req.file.path;
      const xlsxFile = "./" + filePath;
      const fileContent = await readXlxsFile(xlsxFile);
      await generateTags(fileContent);
      console.log("[ ============= ] Tags generated! ");
      await generateProgress(accounts);
      console.log("[ ============= ] Progress generated! ");

      // Create alfa content ( audio fragmenten )
      await generateAlfaContent(fileContent);
      console.log("[ ============= ] Alfa content generated! ");
      res.send("Database is successful rebuild!");
    } catch (err) {
      //console.log(err);
      appendErrorsToTextFile(err);
      return res.status(404).json(err);
    }
  }
);

module.exports = router;
