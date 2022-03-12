const userlogin = document.getElementById('username');
const roomname = document.getElementById('room');
const typeroom = document.getElementById('typeRoom')
const userlist = document.getElementById('user');
const roomlist = document.getElementById('room-a');
const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');

const { userName, room, typeRoom } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
typeroom.value = typeRoom
userlogin.value = userName
let ID = '';
const socket = io();

roomname.textContent += room;
socket.emit('join room', { username: userName, roomname: room, typeroom: typeRoom});


//import
let canvas = document.getElementsByClassName('whiteboard')[0];
let colors = document.getElementsByClassName('color');
let canvasBack = document.getElementById('canvasBack');
let context = canvas.getContext('2d');
let current = {
    color: 'black'
  };
  let drawing = false;

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
    let w = canvas.width;
    let h = canvas.height;

    socket.emit('drawing', {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color: color,
      room: room,
      typeRoom: typeroom.value
    });
  }

  function onMouseDown (e) {
    drawing = true;
    current.x = e.clientX||e.touches[0].clientX;
    current.y = e.clientY||e.touches[0].clientY;
  };

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
    let previousCall = new Date().getTime();
    return function() {
      let time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }

  function onDrawingEvent(data){
    let w = canvas.width;
    let h = canvas.height;
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
  }

  // make the canvas fill its parent
  function onResize() {
    //original
	//canvas.width = window.innerWidth;
    //canvas.height = window.innerHeight;
	
	//90%
	//canvas.width = 1073;
    //canvas.height = 440;
	
	//use flexratio
    canvas.width = window.innerWidth * 0.771695128;
    canvas.height = canvas.width * 0.605522522;
	//canvas.width = window.innerWidth * 0.584595128;
    //canvas.height = canvas.width * 0.647522522;
  }
//import

// let canvas = document.getElementById("canvas");

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;


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
