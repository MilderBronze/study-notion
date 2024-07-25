const jwt = require("jsonwebtoken");
require("dotenv").config();

// auth
exports.auth = async (req, res, next) => {
  try {
    // extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header.authorization.replace("Bearer ", "");

    // if token missing, then return response
    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "token is missing",
      });
    }
    // verify the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode; // passing decode into req.user because decode contains account_type and this can help us in authorization in the future.
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        success: false,
        msg: "invalid token",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: "something went wrong while validating the token",
    });
  }
};

// isStudent

exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        msg: "this is a protected route for students only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "user role can't be verified",
    });
  }
};

// isInstructor

exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        msg: "this is a protected route for instructor only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "user role can't be verified",
    });
  }
};

// isAdmin
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        msg: "this is a protected route for Admin only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "user role can't be verified",
    });
  }
};
