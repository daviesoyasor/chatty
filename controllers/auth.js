const User = require("../models/UserSchema")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


// @desc      Register user
// @route     POST /chatty-api/auth/register
// @access    Public
const createUser = async (req, res, next) =>{
    try{

        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create new user
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
        });

        //save user and respond
        const user = await newUser.save();
        //create jwt token
        const token = createSignedJwtToken(user._id)
        //store token in cookie
        storeTokenInCookie(token, 200, res, "user created successfully")    
    }catch(err){
        next(err)
    }
}


//@desc    Login User
//@route   POST /chatty-api/auth/login
//@access  Public
const loginUser = async (req, res, next) => {
    try{
        const user = await User.findOne({ email: req.body.email });
        if(!user){
            res.status(404).json({message: "User not found"})
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if(validPassword) {
            //create jwt token
            const token = createSignedJwtToken(user._id)
            //store token in cookie
            storeTokenInCookie(token, 200, res, "Login successful")
            // const { password, updatedAt, ...otherfields } = user._doc
            // res.status(200).json(otherfields)
        }else{
            res.status(400).json({message: "Wrong Password"})
        }
        
    }catch(err){
        next(err)
    }
}


//@desc    Log user out / clear cookie
//@route   POST /chatty-api/auth/logout
//@access  Private
const logOut = async (req, res, next) => {
    res
    .clearCookie("access_token")
    .status(200)
    .json({ 
        success: true,
        message: "Successfully logged out 😏 🍀" });
  };


// @desc      Get current logged in user
// @route     POST /chatty-api/auth/me
// @access    Private
const getMe = async (req, res, next) => {
    const user = await User.findById(req.user.id);
  
    res.status(200).json({
      success: true,
      user: user
    });
  };


//create token and return the token
const createSignedJwtToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}


//store token in cookie
const storeTokenInCookie = (token, statusCode, res, message) => {
    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };
    
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
    .status(statusCode)
    .cookie('access_token', token, options)
    .json({
        success: true,
        message: message,
        token
    });
}
 


module.exports = {
    createUser,
    loginUser,
    logOut,
    getMe
}  