const Course = require("../models/Course");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");

// iss file me ham 3 cheezein krenge... pehla... create, dusra... update, teesra... delete

exports.createSection = async (req, res) => {
  try {
    // data fetch from req body
    const { sectionName, courseId } = req.body;

    // sectionName isliye kyuki db me issi ke naam se ek entry create krenge.. and courseId isliye kyuki Course ko courseId se identify krke section ko push krenge inside of the specific course with the courseId passed into the request body.

    // data validation
    if (!sectionName || !courseId) {
      res.status(400).json({
        success: false,
        msg: "missing properties",
      });
    }
    // create section
    const newSection = await Section.create({ sectionName });
    // update course with section objectID
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      // populate in a way ki ham section and subsection ko ek baar me hii populate krwa paaye.
      .populate("sectionName")
      .populate("title")
      .exec();
    // return response

    res.status(200).json({
      success: true,
      msg: "section created successfully",
      updatedCourseDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      err: error.message,
      msg: "unable to create section, plz try again later",
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    // sbse pehle as usual data input lete hain

    const { sectionName, sectionId } = req.body; // sectionId aaya hai kyuki we need to execute findByIdAndUpdate to update the specific document in the section collection.

    // and ham agar data input lete hain toh we make sure that ham data validate krte hain.

    if (!sectionName || !sectionId) {
      res.status(400).json({
        success: false,
        msg: "missing properties",
      });
    }

    // and ek dafaa jab hamne data validation kr li... toh jaha par bhi data pada hai.. waha pe data update kr do... Toh agar hamne ek baar section me jaake data ko update kr diya toh kya hame dobara course me jaake data update krne ki koi need hai? ni. Kyu? kyuki course me section ka data thodi pada h.. course me toh section ki id padi hai.. id toh same hi rhegi..

    const section = await Section.findByIdAndUpdate(
      sectionId,
      {
        sectionName,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      msg: "section updated successfully",
      section,
    });

    // return response
  } catch (error) {
    res.status(500).json({
      success: false,
      err: error.message,
      msg: "unable to update section, plz try again later",
    });
  }
};

// and ye rha teesra controller:
exports.deleteSection = async (req, res) => {
  try {
    // get ID: assuming that we are sending ID in parameters.

    const { sectionId } = req.params;

    // validation:

    if (!sectionId) {
      res.status(400).json({
        success: false,
        msg: "missing properties",
      });
    }
    // use findByIdAndDelete

    await Section.findByIdAndDelete(sectionId);

    //todo while testing: do we need to delete the object id of section from the course schema?
    // babbar said that iska answer hame testing ke time pe pata chalega...

    // return response
    res.status(200).json({
      success: true,
      msg: "section deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      err: error.message,
      msg: "unable to delete section, plz try again later",
    });
  }
};
