const socket = io('http://localhost:8000');
const container = document.getElementById('container');
const messageInput = document.getElementById('input-message');
const sendBtn = document.getElementById('sendBtn');
container.scrollTop = container.scrollHeight;


messageInput.addEventListener("keyup", (e) => {
    // Number 13 is the "Enter" key on the keyboard
    if (e.keyCode === 13) {
        // Cancel the default action, if needed
        e.preventDefault();
        // Trigger the button element with a click
        sendBtn.click();
    }
});

// Function which will append event info to the contaner
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    container.append(messageElement);
}


// Ask the new user for their name, and add it to the users object in the backend!
const name = prompt('Enter your name');
if (name != '' && name != null && name != undefined) {
    socket.emit('new-user-joined', name);
} else {
    alert('Name cannot be empty!');
    location.reload();
}

// Whenever a new user joins, recieve the response from the backend and display it to other users!
socket.on('user-joined', (name) => {
    append(`${name} joined the chat`, 'right');
});


// If server sends a message, receive it
socket.on('receive', (data) => {
    append(`${data.name}: ${data.message}`, 'left')
});

// If a user leaves the chat, append the info to the container
socket.on('left', (name) => {
    append(`${name} left the chat`, 'right')
})


// If the button gets clicked, send server the message
sendBtn.addEventListener('click', (e) => {
    e.preventDefault();
    container.scrollTop = container.scrollHeight;
    const message = messageInput.value;
    if (message != '') {
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = ''
    }
})