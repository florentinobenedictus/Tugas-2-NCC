const app = require('express')();
const express = require('express');
const server = require('http').createServer(app);
const port = process.env.PORT || 3000;
const io = require('socket.io')(server);
const path = require('path');

const {
  joinUser,
  removeUser,
  getUsers,
  getUserRoom,
  getAllRooms,
} = require('./public/users.js');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

let thisRoom = '';

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    thisRoom = msg.room;
    io.to(thisRoom).emit('chat message', { msg: msg, id: socket.id });
	console.log(msg.room);
  });
});

io.on('connection', (socket) => {
  socket.on('drawing', (data) => {
	thisRoom = data.room;
    io.to(thisRoom).emit('drawing', data);
	console.log(data.room);
  });
});

io.on('connection', (socket) => {
  socket.on('join room', (data) => {
    let Newuser = joinUser(socket.id, data.username, data.roomname, data.typeroom);
    socket.emit('send data', {
      id: socket.id,
      username: Newuser.username,
      roomname: Newuser.roomname,
      typeroom: Newuser.typeroom,
    });
    let allUsers = getAllRooms();
    io.emit('all rooms', allUsers);

    socket.join(Newuser.roomname);
    let userlist = getUsers(Newuser.roomname);
    io.to(Newuser.roomname).emit('in room', userlist);
  });
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    const room = getUserRoom(socket.id);
    const user = removeUser(socket.id);
    if (user) {
      console.log(user.username + ' has left');
    }
    let userlist = getUsers(room);
    io.to(room).emit('in room', userlist);
    let allusers = getAllRooms();
    io.emit('all rooms', allusers);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});
