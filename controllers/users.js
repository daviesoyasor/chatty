const User = require('../models/UserSchema')


//@desc    Get all registered Users
//@route   GET api/v1/users/
//@access  Public
const getAllUsers = async (req, res, next)=>{
    try{
        const currentLoggedInUser = req.user.id
        //get all users except the current logged in user
        const users = await User.find({ _id: {$ne: currentLoggedInUser}})
        res.status(200).json(users)
    }catch(err){
        next(err)
    }
}

//@desc    Get single user
//@route   GET api/v1/users/:id
//@access  Private
const getSingleUser = async (req, res, next) => {
    try{
        const user = await User.findById(req.params.id)
        
        //instead of returning all the fields to the frontend exclude the password and updateAt field
        //the ._doc contains the data like email , username , password which we specified in the UserSchema
        //and we are using the rest operator to select the remaining fields and put them into a singe object
        const {password, updatedAt, ...otherfields} = user._doc
        res.status(200).json(otherfields)
    }catch(err){
        next(err)
    } 
}

module.exports = { 
    getAllUsers,
    getSingleUser
}