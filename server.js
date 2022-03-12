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
  getUsersFirst,
  getAdmin,
  changeAdmin,
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
	if(msg.value == 'Admin plz')changeAdmin(thisRoom, msg.user);
  });
});

io.on('connection', (socket) => {
  socket.on('drawing', (data) => {
	thisRoom = data.room;
	//console.log(data.typeRoom)
    if(data.typeRoom != 'Unshared Whiteboard')io.to(thisRoom).emit('drawing', data);
	else {
		//console.log(data.user);
		//console.log(getUsersFirst(thisRoom));
		// host unshared whiteboard menggunakan ID yang pertama dibuat:
		//if(data.user == getUsersFirst(thisRoom).username)io.to(thisRoom).emit('drawing', data);
		// host unshared whiteboard menggunakan Admin name (dapatkan admin dengan chat "Admin plz")
		if(getAdmin(data.user, thisRoom))io.to(thisRoom).emit('drawing', data);
	}
  });
});


io.on('connection', (socket) => {
  socket.on('join room', (data) => {
    let Newuser = joinUser(socket.id, data.username, data.roomname, data.typeroom, data.adminof);
    socket.emit('send data', {
      id: socket.id,
      username: Newuser.username,
      roomname: Newuser.roomname,
      typeroom: Newuser.typeroom,
	  adminof : Newuser.adminof
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
