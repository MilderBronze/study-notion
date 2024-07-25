const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
  },
  courseDescription: {
    type: String,
  },
  instructor: {
    // instructor bhi ek user hii hai app ka.. isliye isko bhi user ke category me daal diye.
    ref: "User",
    type: mongoose.Schema.Types.ObjectId,
  },
  whatYouWillLearn: {
    type: String,
  },
  courseContent: [
    {
      ref: "Section",
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  ratingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
  ],
  price: {
    type: Number,
  },
  thumbnail: {
    type: String, // because this will be an image coming from a cloud link and the link is a string only.
  },
  tag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  studentsEnrolled: [
    {
      requried: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Course", courseSchema);
