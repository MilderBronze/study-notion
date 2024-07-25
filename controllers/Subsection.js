const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

// create subsection

exports.createSubSection = async (req, res) => {
  try {
    // fetch data from req body

    const { sectionId, title, timeDuration, description } = req.body; // sectionId kyu? kyuki ham kis section document me push krenge newly created subsection document ko... wo pata chalega sectionId se..

    // par isme toh video bhi hoga.. wo video hame kaha se milegi? file se milegi.
    // toh extract file / video

    const video = req.files.videoFile;

    // validation

    if (!sectionId || !title || !timeDuration || !description || !video) {
      res.status(400).json({
        success: false,
        msg: "all fields are required",
      });
    }

    // jo video file upar hamne extract kiya, usko upload kro cloudinary me.
    // upload hone ke baad response me kya milega? secure_url milega.

    // acha ek baat bata.. hamne imageUploader naam ka ek file banaya tha utils folder me.. toh kya wo sirf image upload krta hoga... nahi.. wo file upload krega.. chahe video file ho chahe image file..

    // toh ham uska code ko use krenge.

    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    // ui ke hisaab se hame sirf 4 data chahiye thhe.. title, description, timeDuration and videoUrl.
    // title, description and timeDuration toh hame req.body se mil gayi.
    // video file ko ham alag se fetch kr lenge
    // toh jab saara data mil gaya.. toh bass. subsection create kr do.

    const subSectionDetails = await SubSection.create({
      title,
      timeDuration,
      description,
      videoUrl: uploadDetails.secure_url,
    });

    // once subsection is created, we will push its object id to section and update section

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: {
          subSection: subSectionDetails._id,
        },
      },
      { new: true }
    );
    // hw: log updated section here after adding populate query.

    // finally return response.

    res.status(200).json({
      success: true,
      msg: "subsection created successfully",
      updatedSection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      err: error.message,
      msg: "internal server error",
    });
  }
};

// hw: create update and delete subsection controllers
