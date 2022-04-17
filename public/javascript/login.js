const form = document.getElementById('login')
const email = document.getElementById('email')
const password = document.getElementById('password')
const errorText = document.getElementById("error-text")
const successText = document.getElementById("success-text")

form.addEventListener('submit', async (e)=>{
  e.preventDefault()
  const useremail = email.value 
  const pass  = password.value 
  try{
    const result = await axios.post('/chatty-api/auth/login', {
      email: useremail,
      password: pass
    })
    if(result){
      successText.style.display = "block";
      successText.textContent = "Login successful";
      setTimeout(()=>{
        location.href="friends.html";
      }, 3000)
      
    }
  }catch(err) {
    errorText.style.display = "block";
    errorText.textContent = "There was an error";
  }
})

