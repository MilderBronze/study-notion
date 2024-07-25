const Course = require("../models/Course");

const Tag = require("../models/Tags");

const Category = require("../models/Category");

const User = require("../models/User");

require("dotenv").config();

const uploadImageToCloudinary = require("../utils/imageUploader");

// create course handler function:

exports.createCourse = async (req, res) => {
  try {
    // fetch data
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      category,
      tag,
    } = req.body; // course ke model me jaake dekho.. category ki id pass ho rhi h. toh ye category jo body me aayi hai.. wo id hai.

    // get thumbnail

    const thumbnail = req.files.thumbnailImage;

    // validation

    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !tag ||
      !price ||
      !category ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }

    // check for instructor
    const userId = req.user.id;

    const instructorDetails = await User.findById(userId);
    console.log("instructorDetails: ", instructorDetails);

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        msg: "Instructor details not found",
      });
    }

    // check given tag is valid or not
    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "tag details not found",
      });
    }

    const categoryDetails = await Category.findById(category);

    if (!categoryDetails) {
      return res.status(404).json({
        success: true,
        message: "category Details not found",
      });
    }

    // upload image to cloudinary:

    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // create entry for new course

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      tag: tagDetails._id,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    // add the new course to user schema of instructor
    await User.findByIdAndUpdate(
      {
        _id: instructorDetails._id,
      },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      {
        new: true,
      }
    );

    // update the tag schema
    // todo: hw
    await Tag.findByIdAndUpdate(
      { _id: tag },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      msg: "course created successfully",
      data: newCourse,
    });

    // mai iss user ke andar course wali field jo ki ek array hai.. usme ek naya record/entry add krna chahta hu.
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      msg: "failed to create course",
    });
  }
};

exports.showAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      } // mtlb sirf wo data laake do jisme ye saare values present ho.
    )
      .populate("instructor")
      .exec();
    return res.status(200).json({
      success: true,
      msg: "all data fetched",
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      msg: "failed to FETCH course data",
    });
  }
};
