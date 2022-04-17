const searchBar = document.querySelector(".search input"),
searchIcon = document.querySelector(".search button"),
usersList = document.querySelector(".users-list");

searchIcon.onclick = ()=>{
  searchBar.classList.toggle("show");
  searchIcon.classList.toggle("active");
  searchBar.focus();
  if(searchBar.classList.contains("active")){
    searchBar.value = "";
    searchBar.classList.remove("active");
  }
}

searchBar.onkeyup = ()=>{
  let searchTerm = searchBar.value;
  if(searchTerm != ""){
    searchBar.classList.add("active");
  }else{
    searchBar.classList.remove("active");
  }
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "php/search.php", true);
  xhr.onload = ()=>{
    if(xhr.readyState === XMLHttpRequest.DONE){
        if(xhr.status === 200){
          let data = xhr.response;
          usersList.innerHTML = data;
        }
    }
  }
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send("searchTerm=" + searchTerm);
}


$(document).ready(function(){
  var socket = io();
  
  const getMyId = async()=>{
    try{
      const { data }  = await axios.get('/chatty-api/auth/me')
      socket.emit('addUser', data.user._id)
    }catch(err){
      console.log(err)
    }
  }
  getMyId()
 

  
  
  const friendsDOM = document.querySelector('.users-list')
  //logout the current user
   $(".logout").on('click', async (e) => {
     e.preventDefault()
      try{
        const { data }  = await axios.get('/chatty-api/auth/me')
        socket.emit('logout', data.user._id )
        
        const result = await axios.get('/chatty-api/auth/logout');
        if(result.data.success){
          location.href="index.html"
        }
      }catch(err){
        location.href="index.html"
      }
   })    

  const getMe = async()=>{
    try{
      const { data }  = await axios.get('/chatty-api/auth/me')
      $("#user_name").text(data.user.firstName + " " + data.user.lastName);
    }catch(err){
      location.href = "index.html"
    }
  }


 

  
  const getOtherUsers = async()=>{
    
    try{
      const { data } = await axios.get('/chatty-api/users/')
      const friend = data.forEach((user)=>{
      var anchorTag = document.createElement("a")
      anchorTag.setAttribute("data-id", user._id);
      anchorTag.href = "chat.html"
      anchorTag.onclick = startConversation;

      var divTagOne = document.createElement('div')
      divTagOne.className = "content";

      var imgTag = document.createElement('img')
      imgTag.src = "php/images/user.png"

      var divTagTwo = document.createElement('div')
      divTagTwo.className = "details";

      var spanTag = document.createElement('span')
      spanTag.innerText = user.firstName + " " + user.lastName

      // var pTag = document.createElement("p")
      // pTag.innerText = "You: What's Up"
      var divTagThree = document.createElement('div')
      socket.emit('getOnlineUsers');
      socket.on("onlineUsers", (data) => {
        // console.log(data)
        // data.forEach((e)=>{
        //   // if(e.userId == user._id){
        //   //   divTagThree.className = "status-dot"
        //   // }else{
        //   //   divTagThree.className = "status-dot offline"
        //   // }

        // })
        if(data.includes(user._id)){
          divTagThree.className = "status-dot"
        }else{
          divTagThree.className = "status-dot offline"
        }
    });
      

      var iconTag = document.createElement('i')
      iconTag.className = 'fas fa-circle'


      divTagThree.appendChild(iconTag);

      divTagTwo.appendChild(spanTag)
      // divTagTwo.appendChild(pTag)

      divTagOne.appendChild(imgTag)
      divTagOne.appendChild(divTagTwo)

      anchorTag.appendChild(divTagOne)
      anchorTag.appendChild(divTagThree)


     // append the list tag to the parent tag (<ul>)
     friendsDOM.append(anchorTag) 
      })
      
    }catch(err){

    }
  }


    
  // get current logged in user
  getMe()
  
  //get all users
  getOtherUsers()
  

  async function startConversation(e){
    e.preventDefault()
    const id = $(this).data("id")
    try{
      //first check if this user is already in a room, if they are not then put them in a room
      const {data} = await axios.post("/chatty-api/room", {
        friend_id: id
      })
      const { other } = data
      //store the room id in local Storage
      localStorage.setItem('roomId', other._id)
      location.href="chat.html";
    }catch(err){
      console.log(err)
    } 
  }
  }) 