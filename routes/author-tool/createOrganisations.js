const Organisation = require("../../models/organisation.model");
const db = require("../../services/db");

module.exports = async accounts => {
  try {
    await db.deleteCollection("organisations");
    // Data
    const technova = await Organisation({
      _id: "5cc1a98b6f1e7a2a943d2d72",
      name: "Technova",
      teachers: [
        accounts.teachers.maarten,
        accounts.teachers.hans,
        accounts.teachers.ilse
      ]
    });
    const astrum = await Organisation({
      _id: "5cc1a98b6f1e7a2a943d2d73",
      name: "Astrum College",
      teachers: [accounts.teachers.merel, accounts.teachers.ilse]
    });
    // Save
    await technova.save();
    await astrum.save();
    // Return
    return { technova, astrum };
  } catch (ex) {
    throw new Error(
      `[Rebuilding organisations] Failed with message: ${ex.message}`
    );
  }
};
