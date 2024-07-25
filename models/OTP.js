const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 5 * 60,
    default: Date.now(),
  },
});

// model export and schema ke bich me pre likhte hue:

async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "verification mail from StudyNotion",
      otp
    );
    console.log("email sent successfully: ", mailResponse);
  } catch (error) {
    console.log("error occured while sending mails ", mailResponse);
    throw error;
  }
}

OTPSchema.pre("save", async function (next) {
  
  // upar arrow function ni likh skte. because niche this.email me document me stored attribute email ko refer kr rha hai.. arrow function use krne ke kaaran this ka mtlb puri tarah se change ho jaega as inside of the arrow functions, this is lexical scoped.

  // we aren't providing any name to the async fdnction above because it is common to use anonymous functions when used as callback functions.

  // why pre is used and not post:
  // reason:

  // The pre hook runs before the document is saved in the database. By sending the verification email in the pre hook, you ensure that the email is sent before the document is actually saved.

  // This is useful if you want to confirm that the email sending operation is successful before committing the document to the database. If the email fails to send, you can prevent the document from being saved by throwing an error.

  await sendVerificationEmail(this.email, this.otp);
  next();
});

module.exports = mongoose.model("OTP", OTPSchema);
