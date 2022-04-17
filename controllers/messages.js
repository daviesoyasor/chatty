const Message = require('../models/MessageSchema')



//@desc    Get all messages in the room
//@route   GET chatty-api/messages
//@access  Private
const getAllMessages = async (req, res, next)=>{
    try{
        const message = await Message.find({
            roomId: req.params.roomId,
          });
        res.status(200).json(message)
        
        
    }catch(err){
        next(err)
    }
}


const createMessage = async (req, res, next) =>{
    try{
        const currentLoggedInUser = req.user.id
        const newMessage = new Message({
            roomId: req.body.roomId,
            sender: currentLoggedInUser,
            content: req.body.content
        });
        //save user and respond
        const message = await newMessage.save();
        const  { updatedAt, createdAt, ...other } = message._doc
        res.status(200).json(other)    
    }catch(err){
        next(err)
    }
}

module.exports = {
    getAllMessages,
    createMessage
}