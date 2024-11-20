const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const ACTIONS = require("./src/Actions");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const userSocketMap = {};

const getAllConnectedClients = (roomId) => {
  //io.sockets.adapter.rooms.get(roomId) it is a map datatype so it is converted into array
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
};

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  //actions request from the frontend that someone has created a room and socket id has been created
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      //to notify the existing user that someone has joined the chat
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });

    // console.log(clients);
  });


  // When some user wants to leave the room and gets disconnected
  socket.on('disconnecting',()=>{
    const rooms = [...socket.rooms];
    rooms.forEach((roomId)=>{
        socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
            socketId:socket.id,
            username:userSocketMap[socket.id],

        });
       delete userSocketMap[socket.id];
       socket.leave();
    })
  })

});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
