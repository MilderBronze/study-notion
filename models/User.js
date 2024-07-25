const mongoose = require("mongoose");
const { resetPasswordToken } = require("../controllers/ResetPassword");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: true,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["Admin", "Student", "Instructor"],
    required: true,
  },
  additionalDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  image: {
    type: String, // kyuki the dp of the person will be a URL which is basically a string.
    required: true,
  },
  courseProgress: [
    // this will be an array of all the course progresses of all the courses..
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseProgress",
    },
  ],
  // ye dono attributes hamne kaam anusar baad me dala.. shuru me sab figure out ek baar me hii krna mushqil hai and zaruri bhi nai hai.
  // swaad anusar code likhenge apan.
  token: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
});

module.exports = mongoose.model("User", userSchema);
