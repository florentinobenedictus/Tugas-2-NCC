let userName = prompt('Masukkan nama');
let room = prompt('Masukkan nama room');
let ID = '';
var socket = io();
var roomname = document.getElementById('room');
var userlist = document.getElementById('user');
var roomlist = document.getElementById('room-a');
roomname.textContent += room;
socket.emit('join room', { username: userName, roomName: room });
var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');


//import
var canvas = document.getElementsByClassName('whiteboard')[0];
var colors = document.getElementsByClassName('color');
var context = canvas.getContext('2d');

 var current = {
    color: 'black'
  };
  var drawing = false;

  canvas.addEventListener('mousedown', onMouseDown, false);
  canvas.addEventListener('mouseup', onMouseUp, false);
  canvas.addEventListener('mouseout', onMouseUp, false);
  canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);
  
  //Touch support for mobile devices
  canvas.addEventListener('touchstart', onMouseDown, false);
  canvas.addEventListener('touchend', onMouseUp, false);
  canvas.addEventListener('touchcancel', onMouseUp, false);
  canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);

for (var i = 0; i < colors.length; i++){
    colors[i].addEventListener('click', onColorUpdate, false);
  }

  socket.on('drawing', onDrawingEvent);

  window.addEventListener('resize', onResize, false);
  onResize();


  function drawLine(x0, y0, x1, y1, color, emit){
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();
    context.closePath();

    if (!emit) { return; }
    var w = canvas.width;
    var h = canvas.height;

    socket.emit('drawing', {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color: color
    });
  }

  function onMouseDown(e){
    drawing = true;
    current.x = e.clientX||e.touches[0].clientX;
    current.y = e.clientY||e.touches[0].clientY;
  }

  function onMouseUp(e){
    if (!drawing) { return; }
    drawing = false;
    drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true);
  }

  function onMouseMove(e){
    if (!drawing) { return; }
    drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true);
    current.x = e.clientX||e.touches[0].clientX;
    current.y = e.clientY||e.touches[0].clientY;
  }

  function onColorUpdate(e){
    current.color = e.target.className.split(' ')[1];
  }

  // limit the number of events per second
  function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function() {
      var time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }

  function onDrawingEvent(data){
    var w = canvas.width;
    var h = canvas.height;
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
  }

  // make the canvas fill its parent
  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
//import

socket.on('send data', (data) => {
  ID = data.id;
});

socket.on('all rooms', (data) => {
  while (roomlist.firstChild) {
    roomlist.removeChild(roomlist.lastChild);
  }
  for (let i = 0; i < data.length; i++) {
    var item = document.createElement('li');
    item.textContent = data[i];
    roomlist.appendChild(item);
  }
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('in room', (data) => {
  while (userlist.firstChild) {
    userlist.removeChild(userlist.lastChild);
  }
  for (let i = 0; i < data.length; i++) {
    var item = document.createElement('li');
    item.textContent = data[i].username;
    userlist.appendChild(item);
  }
  window.scrollTo(0, document.body.scrollHeight);
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', {
      value: input.value,
      user: userName,
      room: room,
    });
    input.value = '';
  }
});

socket.on('chat message', function (msg) {
  var item = document.createElement('li');
  item.innerHTML =
    '<strong>' + msg.msg.user + '</strong>' + ' : ' + msg.msg.value;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});



