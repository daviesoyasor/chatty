const form = document.getElementById('register')
const fname = document.getElementById('fname')
const lname = document.getElementById('lname')
const email = document.getElementById('email')
const password = document.getElementById('password')
const errorText = document.getElementById("error-text")
const successText = document.getElementById("success-text")

form.addEventListener('submit', async (e)=>{
  e.preventDefault()
  const firstname = fname.value
  const lastname = lname.value
  const useremail = email.value 
  const pass  = password.value 
  try{
    const result = await axios.post('/chatty-api/auth/register', {
      firstName: firstname,
      lastName: lastname,
      email: useremail,
      password: pass
    })
    if(result){
      successText.style.display = "block";
      successText.textContent = "Registration successful";
      setTimeout(()=>{
        location.href="index.html";
      }, 3000)
      
    }
  }catch(err) {
    errorText.style.display = "block";
    errorText.textContent = "There was an error";
  }
})

