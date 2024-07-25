require("dotenv").config();
const nodemailer = require("nodemailer");
const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    const options = {
      from: "studynotion || codehelp - by babbar",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    };
    let info = await transporter.sendMail(options);
    console.log(info);
    return info;
  } catch (error) {
    console.error(error);
  }
};

module.exports = mailSender;
