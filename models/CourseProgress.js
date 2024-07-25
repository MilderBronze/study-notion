const mongoose = require("mongoose");

const CourseProgressSchema = new mongoose.Schema({
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Course,
  },
  completedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subsection", // subsection mtlb videos. subsection will be a separate model which is an array of subsections in all the courses.
    },
  ],
});

module.exports = mongoose.model("CourseProgress", CourseProgressSchema);
