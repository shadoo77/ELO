const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const db = require("../../services/db");
const Account = require("../../models/account.model");
// Services
const { userRoles } = require("../../services/config");

module.exports = async (salt, codes) => {
  try {
    await db.deleteCollection("accounts");
    /* Author Data */
    const wieke = Account({
      _id: "5cdbc4dfca29c04bc81bd8f8",
      name: "Meester, Wieke",
      account: {
        username: "wieke",
        email: "wieke@kleurrijker.nl",
        password: await bcrypt.hash("abcde", salt)
      },
      role: userRoles.AUTHOR
    });
    const janneke = Account({
      _id: "5cdbc4dfca29c04bc81bd8f1",
      name: "Blom, Janneke",
      account: {
        username: "janneke",
        email: "janneke@kleurrijker.nl",
        password: await bcrypt.hash("abcde", salt)
      },
      role: userRoles.AUTHOR
    });
    /* Teachers */
    const hans = new Account({
      _id: "5cc1a98b6f1e7a2a943d2d6e",
      name: "Jaspers, Hans",
      account: {
        username: "hans",
        email: "hans@kleurrijker.nl",
        password: await bcrypt.hash("abcde", salt)
      },
      role: userRoles.TEACHER
    });
    const maarten = new Account({
      _id: "5cc1a98b6f1e7a2a943d2d6f",
      name: "Griffioen, Maarten",
      account: {
        username: "maarten",
        email: "maarten@kleurrijker.nl",
        password: await bcrypt.hash("abcde", salt)
      },
      role: userRoles.TEACHER
    });
    const merel = new Account({
      _id: "5cc1a98b6f1e7a2a943d2d70",
      name: "Brugman, Merel",
      account: {
        username: "merel",
        email: "merel@kleurrijker.nl",
        password: await bcrypt.hash("abcde", salt)
      },
      role: userRoles.TEACHER
    });
    const ilse = new Account({
      _id: "5cc1a98b6f1e7a2a943d2d71",
      name: "Schik, Ilse",
      account: {
        username: "ilse",
        email: "ilse@kleurrijker.nl",
        password: await bcrypt.hash("abcde", salt)
      },
      role: userRoles.TEACHER
    });
    /* Students */
    const achmed = new Account({
      _id: "5cdbc6f74163a52be02bb977",
      name: "Achmed",
      account: codes.code1.account,
      role: userRoles.STUDENT
    });
    const mehmet = new Account({
      _id: "5cdbc6f74163a52be02bb976",
      name: "Mehmet",
      account: codes.code2.account,
      role: userRoles.STUDENT
    });
    const youssouf = new Account({
      _id: "5cdbc6f74163a52be02bb975",
      name: "Youssouf",
      account: codes.code3.account,
      role: userRoles.STUDENT
    });
    const aliya = new Account({
      _id: "5cdbc6f74163a52be02bb974",
      name: "Aliya",
      account: codes.code4.account,
      role: userRoles.STUDENT
    });
    const pramiti = new Account({
      _id: "5cdbc6f74163a52be02bb973",
      name: "Pramiti",
      account: codes.code5.account,
      role: userRoles.STUDENT
    });
    const ovelle = new Account({
      _id: "5cdbc6f74163a52be02bb972",
      name: "Ovelle",
      account: codes.code6.account,
      role: userRoles.STUDENT
    });
    const zafirah = new Account({
      _id: "5cdbc6f74163a52be02bb971",
      name: "Zafirah",
      account: codes.code7.account,
      role: userRoles.STUDENT
    });
    const karam = new Account({
      _id: mongoose.Types.ObjectId(),
      name: "Karam",
      account: codes.code8.account,
      role: userRoles.STUDENT
    });
    const lana = new Account({
      _id: mongoose.Types.ObjectId(),
      name: "Lana",
      account: codes.code9.account,
      role: userRoles.STUDENT
    });
    const nour = new Account({
      _id: mongoose.Types.ObjectId(),
      name: "Nour",
      account: codes.code10.account,
      role: userRoles.STUDENT
    });
    // Save
    await wieke.save();
    wieke.isActivated = true;
    await wieke.save();

    await janneke.save();
    janneke.isActivated = true;
    await janneke.save();

    await hans.save();
    hans.isActivated = true;
    await hans.save();

    await maarten.save();
    maarten.isActivated = true;
    await maarten.save();

    await merel.save();
    merel.isActivated = true;
    await merel.save();

    await ilse.save();
    ilse.isActivated = true;
    await ilse.save();

    await achmed.save();
    await mehmet.save();
    await youssouf.save();
    await aliya.save();
    await pramiti.save();
    await ovelle.save();
    await zafirah.save();
    await lana.save();
    await karam.save();
    await nour.save();
    // Update codes
    // Group B:
    codes.code2.inUseBy = mehmet;
    codes.code2.activatedBy = hans;
    await codes.code2.save();
    mehmet.isActivated = true;
    await mehmet.save();

    codes.code7.inUseBy = zafirah;
    codes.code7.activatedBy = hans;
    await codes.code7.save();
    zafirah.isActivated = true;
    await zafirah.save();

    codes.code4.inUseBy = aliya;
    codes.code4.activatedBy = hans;
    await codes.code4.save();
    aliya.isActivated = true;
    await aliya.save();

    codes.code1.inUseBy = achmed;
    codes.code1.activatedBy = hans;
    await codes.code1.save();
    achmed.isActivated = true;
    await achmed.save();

    codes.code5.inUseBy = pramiti;
    codes.code5.activatedBy = hans;
    await codes.code5.save();
    pramiti.isActivated = true;
    await pramiti.save();

    codes.code6.inUseBy = ovelle;
    codes.code6.activatedBy = hans;
    await codes.code6.save();
    ovelle.isActivated = true;
    await ovelle.save();

    codes.code9.inUseBy = lana;
    codes.code9.activatedBy = hans;
    await codes.code9.save();
    lana.isActivated = true;
    await lana.save();

    codes.code8.inUseBy = karam;
    codes.code8.activatedBy = hans;
    await codes.code8.save();
    karam.isActivated = true;
    await karam.save();

    codes.code10.inUseBy = nour;
    codes.code10.activatedBy = hans;
    await codes.code10.save();
    ovelle.isActivated = true;
    await ovelle.save();

    codes.code3.inUseBy = youssouf;
    codes.code3.activatedBy = hans;
    await codes.code3.save();
    youssouf.isActivated = true;
    await youssouf.save();

    codes.code2.inUseBy = mehmet;
    codes.code2.activatedBy = hans;
    await codes.code2.save();
    mehmet.isActivated = true;
    await mehmet.save();

    // Return
    return {
      authors: { wieke, janneke },
      teachers: { hans, maarten, merel, ilse },
      students: {
        achmed,
        mehmet,
        youssouf,
        aliya,
        pramiti,
        ovelle,
        zafirah,
        lana,
        karam,
        nour
      }
    };
  } catch (ex) {
    throw new Error(`[Rebuilding accounts] Failed with message: ${ex.message}`);
  }
};
