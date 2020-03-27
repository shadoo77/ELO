const Group = require("../../models/group.model");
const db = require("../../services/db");

module.exports = async (accounts, organisations) => {
  try {
    await db.deleteCollection("groups");
    // Data
    const groupA = new Group({
      _id: "5cc1a98b6f1e7a2a943d2d74",
      name: "4A",
      organisation: organisations.technova,
      teachers: [accounts.teachers.hans, accounts.teachers.maarten],
      students: [
        accounts.students.mehmet,
        accounts.students.zafirah,
        accounts.students.aliya
      ]
    });
    const groupB = new Group({
      _id: "5cc1a98b6f1e7a2a943d2d75",
      name: "4B",
      organisation: organisations.technova,
      teachers: [accounts.teachers.hans],
      students: [
        accounts.students.mehmet,
        accounts.students.zafirah,
        accounts.students.aliya,
        accounts.students.achmed,
        accounts.students.pramiti,
        accounts.students.ovelle,
        accounts.students.youssouf,
        accounts.students.lana,
        accounts.students.karam,
        accounts.students.nour
      ]
    });
    const groupC = new Group({
      _id: "5cc1a98b6f1e7a2a943d2d76",
      name: "4C",
      organisation: organisations.technova,
      teachers: [accounts.teachers.maarten]
    });
    const groupD = new Group({
      _id: "5cc1a98b6f1e7a2a943d2d77",
      name: "1D",
      organisation: organisations.astrum,
      teachers: [accounts.teachers.merel, accounts.teachers.ilse]
    });
    const groupE = new Group({
      _id: "5cc1a98b6f1e7a2a943d2d78",
      name: "2E",
      organisation: organisations.technova,
      teachers: [
        accounts.teachers.hans,
        accounts.teachers.maarten,
        accounts.teachers.ilse
      ]
    });
    // Save
    await groupA.save();
    await groupB.save();
    await groupC.save();
    await groupD.save();
    await groupE.save();
    // Return
    return { groupA, groupB, groupC, groupD, groupE };
  } catch (ex) {
    throw new Error(`[Rebuilding groups] Failed with message: ${ex.message}`);
  }
};
