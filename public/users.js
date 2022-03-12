let users = [];
function joinUser(socketId, userName, roomName, typeRoom, adminOf) {
  const user = {
    socketID: socketId,
    username: userName,
    roomname: roomName,
    typeroom: typeRoom,
	adminof	: adminOf
  };
  users.push(user);
  return user;
}

function removeUser(id) {
  const getID = (users) => users.socketID === id;
  const index = users.findIndex(getID);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getUsers(room) {
  let newUsers = [];
  for (let i = 0; i < users.length; i++)
    if (users[i].roomname == room) newUsers.push(users[i]);
  return newUsers;
}

function getUsersFirst(room) {
  let newUsers = [];
  for (let i = 0; i < users.length; i++)
    if (users[i].roomname == room) newUsers.push(users[i]);
  return newUsers[0];
}

function getAdmin(name, room) {
  for (let i = 0; i < users.length; i++)
    if ((users[i].username == name) && (users[i].adminof == room)) return true;
  return false;
}

function changeAdmin(room, name) {
  for (let i = 0; i < users.length; i++)
	if(users[i].adminof == room) users[i].adminof = 0;
  for (let i = 0; i < users.length; i++)
	if(users[i].username == name) {users[i].adminof = room;}
}

function getUserRoom(id) {
  const getID = (users) => users.socketID === id;
  const index = users.findIndex(getID);
  if (index !== -1) return users[index].roomname;
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function getAllRooms() {
  let rooms = [];

  for (let i = 0; i < users.length; i++) {
    rooms.push(users[i].roomname+" - "+users[i].typeroom);
  }

  return rooms.filter(onlyUnique);
}
module.exports = { joinUser, removeUser, getUsers, getUsersFirst, getAdmin, changeAdmin, getUserRoom, getAllRooms };
