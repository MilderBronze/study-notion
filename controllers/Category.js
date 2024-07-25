const Category = require("../models/Category");

// create tag ka handler function likhna hoga.

exports.createCategory = async (req, res) => {
  try {
    // fetch data
    const { name, description } = req.body;
    // validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        msg: "all fields are required!",
      });
    }
    // create entry in db:

    const categoryDetails = await Category.create({ name, description });
    console.log(categoryDetails);
    return res.status(200).json({
      success: true,
      msg: "tag created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// getAllTags handler function

exports.showAllCategory = async (req, res) => {
  try {
    const allTags = await Category.find({}, { name: true, description: true });
    res.status(200).json({
      success: true,
      msg: "all tags returned successfully",
    });
    console.log(allTags);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
