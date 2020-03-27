const nodemailer = require("nodemailer");
const nodemailerMailgun = require("nodemailer-mailgun-transport");

///// Email setting (Nodemailer mailgun transporter)
const mailAuth = {
  auth: {
    api_key:
      "e1f7b150beb3aff5d4d295892c32b8d5-52b0ea77-47e2eda5",
    domain:
      "sandbox46716b483a004fb2aec9d3befe03cc8b.mailgun.org"
  }
};

const transporter = nodemailer.createTransport(
  nodemailerMailgun(mailAuth)
);

//////////////////// Google source tested ///////////////////////////////
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "kleurrijker.test@gmail.com",
//     pass: "shadi771984"
//   }
// });

// <postmaster@sandbox46716b483a004fb2aec9d3befe03cc8b.mailgun.org>

// html:
//       "Beste " +
//       mail.userName +
//       "<br />" +
//       "Er is via de website een aanvraag gedaan om uw wachtwoord te wijzigen.<br />" +
//       "<a href=" +
//       `http://localhost:3000/wachtwoord-resetten/${mail.token}` +
//       " target='_blank'>Klik hier om uw wachtwoord te wijzigen</a><br />" +
//       "\nHebt u deze aanvraag niet gedaan? Dan kunt u dit mailtje negeren.<br />" +
//       "Uw wachtwoord wordt dan niet gewijzigd.<br />" +
//       "Met vriendelijke groet,<br />" +
//       "Shadi<br />"

const sendEmail = (mail, callBackFunc) => {
  const template = require(mail.template);
  const mailOptions = {
    from: `Kleurrijker mailserver <${mail.from}>`,
    to: mail.to,
    subject: mail.subject,
    html: template({
      name: mail.userName,
      token: mail.token
    })
  };

  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      callBackFunc(err, null);
    } else {
      callBackFunc(null, response);
    }
  });
};

module.exports = sendEmail;
