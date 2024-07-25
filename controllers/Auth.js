const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// sendOTP
// sbse pehle otp.. kyuki jab tk otp verify ni ho jata.. tb tk signup ni kr skte.

exports.sendOTP = async (req, res) => {
  try {
    // fetch email from request ki body
    const { email } = req.body;

    // check if user already exist
    const checkUserPresent = await User.findOne({ email });

    // if user exists: then return a response:

    if (checkUserPresent) {
      return res
        .status(401)
        .json({ success: false, msg: "user already registered!" });
    }

    // generate otp
    const options = {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    };
    let otp = otpGenerator.generate(6, options); // 6 is the length of the otp.
    console.log("otp generated: ", otp);
    // otp generate ho gya hai. now we need to make sure that the otp that has been generated is unique.

    // to do this:

    let result = await OTP.findOne({ otp });

    // ye bahut ganda code hai.. aisa kabhi nahi hota hai ki aap db ke upar loop chala ke rkho.
    while (result) {
      otp = otpGenerator(6, options);
      result = await OTP.findOne({ otp });
    }

    // ab control yaha pe tabhi aa skta hai jab unique otp banke aya hoga. jaise unique otp aaya we will save it in database.

    // const otpPayload = { email, otp };

    // const otpBody = await OTP.create(otpPayload);
    const otpBody = await OTP.create({
      email,
      otp,
    });
    console.log(otpBody);

    // return response successful:
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

// signUp

exports.signup = async (req, res) => {
  try {
    // data fetch from request ki body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // validate krlo

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
      // these are those entities which are inserted by the user in the signup form. and all those entities which are important / required fields in the form need to be written inside of the if block above.
    ) {
      return res.status(403).json({
        success: false,
        message: "all fields are required",
      });
    }

    // match both passwords

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "password and confirm password do not match",
      });
    }

    // check if user already exists

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(403).json({
        success: false,
        message: "user already registered!",
      });
    }

    // find most recent otp for the user

    // let recentOtp = await OTP.findOne({ email });  ho skta hai mujhe iss email ke corresponding multiple entires mil jaaye in the db.. mujhe ek dam latest wali chahiye and latest wali ekdam last me hogi.

    // toh we will do this instead of findOne({email});

    // jo otp hamne pre hook se save kiya tha OTP model ke andar.. wo yaha pe fetch hoga...
    let recentOtp = await OTP.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    /**
   * The code provided is a common approach used in industry-standard Node.js applications, particularly those that utilize MongoDB with Mongoose ODM (Object Data Modeling). Let's break down the key components:

1. **findOne({ email }):** This part of the query retrieves OTP entries from the database where the `email` field matches the provided value. It's a standard way to filter results based on a specific criteria, in this case, the email address.

2. **.sort({ createdAt: -1 }):** Sorting the results by the `createdAt` field in descending order (`-1` indicates descending order) ensures that the most recent OTP entry is returned first. This is a common practice when you want to retrieve the latest data from the database.

3. **.limit(1):** Adding `.limit(1)` ensures that only one OTP entry is returned, even if there are multiple entries corresponding to the email. This is useful when you only need one result and want to optimize performance.

Overall, this approach is widely used and considered a best practice when working with MongoDB and Mongoose. It ensures efficient querying and retrieval of data, especially when dealing with large datasets or when performance optimization is a concern. It's not only taught in educational settings but also commonly found in professional Node.js applications across various industries.

   */
    console.log(recentOtp);
    // validate otp

    if (recentOtp.length == 0) {
      // mtlb otp ya toh invalid hai ya ni mila
      return res.status(400).json({
        success: false,
        message: "otp invalid",
      });
    } // next, compare both the OTPs...
    else if (recentOtp !== otp) {
      // recentOtp is the one fetched from the model and otp is the one fetched from the frontend.
      return res.status(400).json({
        success: false,
        message: "otp mismatched!",
      });
    }

    // hash password

    const hashedPassword = await bcrypt.hash(password, 10);

    // entry created in db
    const Profile = require("../models/Profile");

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      // agar koi kisi ka ref use krta hai toh db me entry create krte waqt uski id use krte hain.
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/8.x/initials/svg?seed=${firstName} ${lastName}`,
    }).populate("additionalDetails");

    // return res

    return res.status(200).json({
      success: true,
      msg: "user is reg successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

// Login

exports.login = async (req, res) => {
  try {
    // get data from req body
    const { email, password } = req.body;
    // validation of data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        msg: "all fields are required",
      });
    }
    // user check if exist
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "user not found and is not registered. plz signup first",
      });
    }
    // password match

    if (bcrypt.compare(password, user.password)) {
      let payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };

      // generate jwt

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      // converting the user document entry to an object
      user.toObject();
      user.token = token;
      user.password = undefined;

      // create cookie
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 3600 * 1000),
        httpOnly: true,
        secure: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        msg: "login successful",
      });
    } else {
      return res.status(401).json({
        success: false,
        msg: "incorrect password",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "login failure",
    });
  }
};

// ChangePassword

/** todo hw:
 * algo:
 *
 * get data from req body
 *
 * get oldPassword, newPassword, confirmNewPassword
 *
 * validation
 *
 * update password in db
 *
 * sendmail - password updated
 *
 * return response
 */

const mailSender = require("../utils/mailSender");

exports.changePassword = async (req, res) => {
  try {
    const { email, password, newPassword, confirmNewPassword } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "User not found!",
      });
    }

    // Check if the provided current password is correct
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        msg: "Invalid current password!",
      });
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        msg: "New passwords do not match!",
      });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword);

    // Update the password
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { password: hashedNewPassword },
      { new: true }
    );

    // Send email notification
    const emailTitle = "Password Updated Successfully";
    const emailBody = "<p>Your password has been successfully updated.</p>";
    await mailSender(email, emailTitle, emailBody);

    return res.status(200).json({
      success: true,
      msg: "Password updated successfully",
      response: updatedUser,
    });
  } catch (error) {
    console.error("Error while updating password", error);
    return res.status(500).json({
      msg: "Server error",
    });
  }
};
