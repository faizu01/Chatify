// you're using the Socket.io library to establish a WebSocket connection to the same server created in app.js. This connection enables real-time communication between the server and clients.
const socket = io('http://localhost:5000');
//Get DOM element in js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const messageContainer = document.querySelector('.container');

//plays audio if new message
var audio = new Audio("/static/ting.mp3");

//function which will append 
const append = (message, positionClass) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(positionClass);
    messageContainer.appendChild(messageElement);
    if (positionClass === 'left') {
        audio.play();
    }

    
    messageContainer.scrollTop = messageContainer.scrollHeight;


};



const username = prompt("Enter your name");
socket.emit('new-user-joined', username);

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});




//addEventListener if someone send message then do some stuff
form.addEventListener('submit', (e) => {
    e.preventDefault();//prevent page from loading each time afer one user joined
    const message = messageInput.value;//message lelo message me
    append(`You: ${message}`, 'right'); //append ko call krdo aur message pass krdo right boxme
    socket.emit('send', message);//send ko emit krwa do mtlb server ko bhej do yaha se
    messageInput.value = '';//message bhejne k bad box empty hojaye mera

})


//if server sends a messaage recieve it!
socket.on('recieve', data => {
    append(`${data.name}: ${data.message}`, 'left')

});

//if user leave chat then fire this message
socket.on('leaved', name => {
    append(`${name} left the chat`, 'left')
});
