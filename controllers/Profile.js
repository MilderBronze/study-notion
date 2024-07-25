const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    // get data

    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

    // get user id from req which was added while getting the decoded data from jwt and we stored it in req.body. toh waha se userid aa jaega.

    const userId = req.user.id; // decode se decoded object aa gya.. and wo decoded object is nothing but the payload which contains id as its key... jiski value is _id... toh hamne waha se userId nikal liya..

    // validation
    
    if (!contactNumber || !gender || !userId) {
      res.status(400).json({
        success: false,
        msg: "missing properties",
      });
    }

    // finally find profile using profile id
    const userDetails = await User.findById(userId);
    const profileId = userDetails.additionalDetails;
    // find profile
    const profileDetails = await Profile.findById(profileId);

    // update profile

    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();

    // ya toh upar wala kro wrna niche wala kro:

    // await Profile.findByIdAndUpdate(
    //   profileId,
    //   {
    //     dateOfBirth,
    //     about,
    //     gender,
    //     contactNumber,
    //   },
    //   { new: true }
    // );

    // return response

    res.status(200).json({
      success: true,
      msg: "Profile updated successfully",
      profileDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      err: error.message,
      msg: "internal server error",
    });
  }
};

// delete account

exports.deleteAccount = async (req, res) => {
  try {
    // get id

    const id = req.user.id;

    // validation

    const userDetails = await User.findById(id);
    if (!userDetails) {
      res.status(400).json({
        success: false,
        msg: "user not found",
      });
    }

    // delete profile

    await Profile.findByIdAndDelete({
      _id: userDetails.additionalDetails,
    });
    // todo hw: unenroll user from all enrolled courses

    // unenroll krne ke baad delete user
    // delete user

    await User.findByIdAndDelete({ _id: id });

    // return response
    res.status(200).json({
      success: true,
      msg: "user deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      err: error.message,
      msg: "internal server error",
    });
  }
};


