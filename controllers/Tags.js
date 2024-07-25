const Tags = require("../models/Tags");

// create tag ka handler function
exports.createTag = async (req, res) => {
  try {
    // fetching data
    const { name, description } = req.body;

    // validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }

    // create entry in db
    const tagDetails = await Tags.create({
      name,
      description,
    });
    console.log(tagDetails);

    // return response
    return res.status(200).json({
      success: true,
      message: "tag created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// getall tags ka handler function:

exports.showAllTags = async (req, res) => {
  try {
    const allTags = await Tags.find({}, { name: true, description: true });
    return res.status(200).json({
      success: true,
      message: "all tags fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
