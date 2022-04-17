const Room = require('../models/RoomSchema')



//@desc    Get Name of a room
//@route   GET chatty-api/room/
//@access  Private
const getNameOfRoom = async (req, res, next)=>{
    const currentLoggedInUser = req.user.id
    let room_details
    try{
        const room = await Room.findOne({_id: req.params.RoomId}).populate("members");
        if(room){
            if(room.isGroupChat === false){
                room.members.forEach((e) =>{
                    if(e._id !== currentLoggedInUser){
                         room_details = e.firstName + " " + e.lastName
                    }
                })
            }else{
                room_details = room.groupName
            }
           
        //  const  { updatedAt, createdAt, ...other } = room._doc
            res.status(200).json(room_details)
        }
        
    }catch(err){
        next(err)
    }
}


//@desc    Get all Members of a room
//@route   GET chatty-api/room/
//@access  Private
const getAllMembersOfRoom = async (req, res, next)=>{
    const currentLoggedInUser = req.user.id
    let room_details
    try{
        const room = await Room.findOne({_id: req.params.RoomId}).populate("members");
        if(room){
            if(room.isGroupChat === false){
                room.members.forEach((e) =>{
                    if(e._id !== currentLoggedInUser){
                         room_details = e.firstName + " " + e.lastName
                    }
                })
            }else{
                room_details = room.groupName
            }
           
        //   const  { updatedAt, createdAt, ...other } = room._doc
            res.status(200).json(room_details)
        }
        
    }catch(err){
        next(err)
    }
}


//@desc    Create a room if it doesn't exist already
//@route   POST chatty-api/room/
//@access  Private
const createRoom = async (req, res, next) =>{
    const currentLoggedInUser = req.user.id
    try{
        //check if there is a room with these two users
        const room = await Room.findOne({
            members: { 
                $size: 2,
                $all: [currentLoggedInUser, req.body.friend_id] 
            },
            isGroupChat: false
        });

        if(room){
            const  { updatedAt, createdAt, ...other } = room._doc
            res.status(200).json({message:"Conversation already exist with this user", other})
            
        }else{
            const newRoom = new Room({
                members: [currentLoggedInUser, req.body.friend_id],
              });
              const saveRoom = await newRoom.save();
              const  { updatedAt, ...other } = saveRoom._doc
              res.status(200).json({message:"Conversation created successfully with this user", other});    
        }
        
    }catch(err){
        next(err)
    }
}

module.exports = {
    getAllMembersOfRoom,
    getNameOfRoom,
    createRoom
}