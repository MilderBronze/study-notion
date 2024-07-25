// reset Password token: will send the mail jisme link hoga
const bcrypt = require("bcrypt");
const User = require("../models/User");
exports.resetPasswordToken = async (req, res) => {
  try {
    // get email from req body
    const email = req.body.email;
    // check user for this email, validation on email
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        msg: "yr email isn't registered with us",
      });
    }
    // generate token

    const token = crypto.randomUUID();

    // update user by adding token and expiration time

    const updatedDetails = await User.findOneAndUpdate(
      { email },
      { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 }, // expires in 5 minutes.
      { new: true } // isse kya hota hai? isse hamara updated document response me aa jata hai. ye nai daalenge toh purana wala document hamare ko response me milega.
    );

    // create url

    const url = `http"//localhost:3000/update-password/${token}`; // 3000 is the port number of the front end code.

    // send mail containing the url

    await mailSender(
      email,
      "password reset link",
      `password reset link: ${url}`
    );

    // return response
    return res.status(200).json({
      success: true,
      msg: "email sent successfully, please check email and change passwd",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

// reset Password: will update the password in the db.
// toh kahani kuch yu h ki aap ek naye UI pe gaye by clicking on the password reset link present in your mail. Naye UI pe jaake aapne new password likha. wo new password will be provided to the resetPassword function. This function will be responsible for updating the password in the db.

exports.resetPassword = async (req, res) => {
  try {
    // data fetch

    // yaha pe hame 3 cheezein milengi... token, password, confirmPassword
    // here, password is the new password inserted and confirmPassword is the new password entered for the second time.
    const { password, confirmPassword, token } = req.body; // but token toh ham seach params se nikal skte hain. toh ham isko body se kaise fetch rhe hain? Ans: body me token ko frontend ne dala hoga.

    // validation

    if (password !== confirmPassword) {
      return res.json({
        success: false,
        msg: "password not matching",
      });
    }

    // get user details from db using token

    const userDetails = await User.findOne({ token });

    // token ke sath 2 issues ho skte hain.. ya toh invalid hoga somehow... ya toh wo expire ho chuka hoga.

    if (!userDetails) {
      return res.json({
        success: false,
        msg: "token invalid", // kyuki token hii toh invalid tha. tumhe token nai mila toh mtlb token invalid tha.
      });
    }
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        msg: "token expired",
      });
    }

    // new password inserted ko hash kro and then update it in the database.
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      { token },
      { password: hashedPassword },
      { new: true }
    );

    // return res

    return res.status(200).json({
      success: true,
      msg: "password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "sthng went wrong while resetting passwd",
    });
  }
};

// resetpassword token ek link generate krke aapko mail krta hai... wo link pe click krke you can reset your email.
