import bot from './assets/bot.svg';
import user from './assets/user.svg';
//access html elements using document.querySelector
const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() =>{
    element.textContent += '.';

    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300)
}
//typing functionality
function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if(index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20)
}
// unique id for every single msg to be able to map over them, we generate unique id by date time 
function generateUniqueId(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  
  return `id-${timestamp}-${hexadecimalString}`;
}
//each msg has icon and chat for that we use below code
function chatStripe (isAi, value, uniqueId){
  return (
    `
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
         <div class="profile">
            <img
              src="${isAi ? bot : user}"
              alt="${isAi ? 'bot' : 'user'}"
            />
          </div>
          <dic class="message" id=${uniqueId}>${value}</div>
        </div>
      </div>
    `
  )
}
// below fun os to trigeer ai generated response
const handleSubmit = async (e) => {
  e.preventDefault();
  //take data from form
  const data = new FormData(form);
  // flase here represent user input means nothing gets written by ai only by user
  // user 's charstripe 
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset(); //reset user i/p

  // bot's chatstripe
  const uniqueId = generateUniqueId(); // for every single message
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId); //true means for each output/line ai can generate uinque id
  //output might be big so for scrolling scrollTop method is use
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv); //load it in form

  // fetch data from server -> bot's response
  
  const response = await fetch('http://localhost:5000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if(response.ok) {
      const data = await response.json();
      const parsedData = data.bot.trim();

      typeText(messageDiv, parsedData);
  } else{
    const err = await response.text();

    messageDiv.innerHTML = "Something Went Wrong";

    alert(err);
  }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e)=>{ //to enable enter key to run
  if(e.keyCode === 13){
    handleSubmit(e);
  }
})