const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const socketio = require('socket.io')
const io = socketio(server)
const cookieParser = require('cookie-parser'); 
//middleware & Routes
const errorHandler = require("./middlewares/errorHandling.js")
const AuthRoute = require('./routes/auth')
const UserRoute = require('./routes/users')
const RoomRoute = require('./routes/room')
const MessageRoute = require('./routes/messages')


dotenv.config()
app.use(express.static('./public'));
app.use(express.json())
// Cookie parser
app.use(cookieParser())
const port  = process.env.PORT || 7000;

 
//Mount Routes
app.use("/chatty-api/auth", AuthRoute)
app.use("/chatty-api/users", UserRoute)
app.use("/chatty-api/room", RoomRoute)
app.use("/chatty-api/messages", MessageRoute)


let users = [];
//socket io  
io.on('connection', (socket)=>{

    socket.on('addUser', (userId)=>{
        const socket_id = socket.id
        // if(!users.some((user)=> user.userId === userId)){  
        //     users.push({ userId, socketId: socket_id })
        // }
        if(!users.includes(userId)){  
            users.push(userId)
        }
        // console.log(users)
        
    }) 
    socket.on("getOnlineUsers", ()=>{ 
        io.to(socket.id).emit("onlineUsers", users)
     })
    socket.on("joinRoom", (data)=>{ socket.join(data.roomId) })
    socket.on("typing", room => socket.to(room).emit("istyping"));
    socket.on("stoptyping", room => socket.to(room).emit("stop_typing"));
    socket.on("sendMessage", (data)=>{
        //send message to the room except the sender
        socket.to(data.roomId).emit("getMessage", {message : data.message})   
    })
    socket.on("logout", (data) =>{
        users = users.filter((user) => user !== data);
    }) 

    // disconnect from server
    socket.on("disconnect", ()=>{
        // console.log(`user with socket id: ${socket.id}  has disconnected`)
        //clear the user from the users array where this socket id exist
        // users = users.filter((user) => user.socketId !== socket.id);
        // console.log(users)
    })
})

//ErrorHandler
app.use(errorHandler)

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    // server.close(() => process.exit(1));
});



// start the server only when the database is connected..
const startServer = async ()=>{
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Database connected")
    server.listen(port, ()=>{
        console.log(`server started on port ${port}`)
    })
   
    
}
startServer()           