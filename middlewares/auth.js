const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema');

// Protect routes
exports.authenticateToken = async (req, res, next) => {
  let token;
  if (req.cookies.access_token) {
    token = req.cookies.access_token;
  }
 
  // Make sure token exists
  if (!token) {
    res.status(400).json({
      status: false,
      message: "No token provided"
    })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if(req.user){
      next()
    }
  } catch (err) {
    res.status(504).json({message: "couldnt authenticate"})
    // return next('Not authorized to access this route');
  }
};

