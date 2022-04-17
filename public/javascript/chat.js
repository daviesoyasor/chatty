const form = document.querySelector(".typing-area")
const roomName = document.querySelector("#room_name")

inputField = form.querySelector(".input-field");
sendBtn = form.querySelector("button");
chatBox = document.querySelector(".chat-box");


//   =================================================================================================================== //

$(document).ready(function(){
    var socket = io();
    var roomId = localStorage.getItem('roomId');

    socket.emit('joinRoom', {roomId : roomId});
    socket.on("istyping", () => {
        if($(".chat-box").has(".typingDots").length >= 1){
            
        }else{
            $('<div class="chat incoming typingDots"  ><img src="php/images/user.png" alt=""><div class="details"><p><img style="font-size: 12; width: 35px; height: 15px;" src="php/images/dots.gif" alt=""></p></div></div>').appendTo(chatBox);
            scrollToBottom();
        }
    });
    socket.on("stop_typing", () => {
        $(".chat.incoming.typingDots").remove()
    });

    socket.on('getMessage', (data)=>{
        $('<div class="chat incoming"><img src="php/images/user.png" alt=""><div class="details"><p>'+ data.message +'</p></div></div>').appendTo(chatBox);
        scrollToBottom();
    })

    var me;
    form.onsubmit = (e)=>{
        e.preventDefault();
    }

    inputField.focus();
    inputField.onkeyup = ()=>{
        if(inputField.value != ""){
            sendBtn.classList.add("active");
            socket.emit("typing", roomId);
            var lastTypingTime = new Date().getTime();
            var timerLength = 3000;

            setTimeout(() => {
                var timeNow = new Date().getTime();
                var timeDiff = timeNow - lastTypingTime;

                if(timeDiff >= timerLength) {
                    socket.emit("stoptyping", roomId);
                }
            }, timerLength);
        }else{
            sendBtn.classList.remove("active");
        }
    }
    
    
    chatBox.onmouseenter = ()=>{
        chatBox.classList.add("active");
    }
    
    chatBox.onmouseleave = ()=>{
        chatBox.classList.remove("active");
    }

    //send message
    sendBtn.onclick = async ()=>{
        var text = inputField.value;
        $('<div class="chat outgoing"><div class="details"><p>'+ text + '</p></div></div>').appendTo(chatBox);
        inputField.value = "";
        scrollToBottom();
        //send message with socket
        socket.emit('sendMessage', {
            roomId : roomId,
            message: text 
          });
          socket.emit("stoptyping", roomId);
        await axios.post('/chatty-api/messages/', {roomId: roomId, content: text})                   
    }
    // send message
    function scrollToBottom(){
        chatBox.scrollTop = chatBox.scrollHeight;
      }

    const getRoomName = async (roomId)=>{
        const { data } = await axios.get(`/chatty-api/room/room-name/${roomId}`);
        roomName.innerHTML = data
    }
 
      
      // get all messages in the room
    const getMessages = async (roomId) =>{
        const { data }  = await axios.get('/chatty-api/auth/me')
        const myId = data.user._id
         
        const messages = await axios.get(`/chatty-api/messages/${roomId}`)


        if(messages.data.length > 0){
            //if there are messages, clear the DOM first  before appending each message
            // chatBox.innerHTML = "";
            const filterMessage = messages.data
            filterMessage.forEach((element) =>{
              if(element.sender === myId){            
                $('<div class="chat outgoing"><div class="details"><p>'+ element.content + '</p></div></div>').appendTo(chatBox);
              }else{
                $('<div class="chat incoming"><img src="php/images/user.png" alt=""><div class="details"><p>'+ element.content +'</p></div></div>').appendTo(chatBox);
              }
              scrollToBottom()
            })
          }
    }


    getRoomName(roomId)
    getMessages(roomId)
    

})