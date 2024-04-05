const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_-+={}[]\\|<,>.?/:;'\"";

const charArray = chars.split("");

const fontSize = 14;
const columns = canvas.width / fontSize;

const drops = [];

for (let i = 0; i < columns; i++) {
  drops[i] = 1;
}

function draw() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#0F0";
  ctx.font = `${fontSize}px arial`;

  for (let i = 0; i < drops.length; i++) {
    const text = charArray[Math.floor(Math.random() * charArray.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(draw, 30);

const socket = io('https://dupetheduck.co/chatghost');
const form = document.getElementById('sendContainer');
const messageInput = document.getElementById('messageInput');
const messageContainer = document.querySelector(".container");
var audio1 = new Audio('sfx/sfx1.mp3')
var audio2 = new Audio('sfx/sfx2.mp3')
var audio3 = new Audio('sfx/sfx3.mp3')

const append = (message, position) => {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageElement.classList.add('message');
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  

  messageContainer.scrollTop = messageContainer.scrollHeight;
};

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const message = messageInput.value;
  append(`>>you<<
  ${message}`, 'Right');
  socket.emit('send', message);
  messageInput.value = ''
});

const name = prompt("Enter your name to join");
socket.emit('newUserJoined', name);

socket.on('userJoined', name => {
  append(`>>${name} joined the chatGhost<<`, 'Middle');
  audio2.play();
});

socket.on('receive', data=>{
  append(`>>${data.name}<<
  ${data.message}`,'Left');
  audio1.play();
});

socket.on('out', userName=>{
  append(`>>${userName} left the chatGhost<<`,'Middle');
  audio3.play();
});
