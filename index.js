//Require
const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");
const { addUser, removeUser, getUser, getUsersRoom } = require("./users");
const router = require("./router");

const PORT = process.env.PORT || 5000;

//Initializing app
const app = express();

//Initializing server
const server = http.createServer(app);
const io = socketio(server);

//To prevent cors policy
app.use(cors());

//middleware
app.use(router);

//getting the emitted new connection from client side
io.on("connect", (socket) => {
    // console.log("We have a new connection!!");

    //receiving name and room from the front end
    socket.on("join", ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });

        if (error) return callback(error);
        socket.join(user.room);

        //a default welcome msg and who is joined beside from the back end to front end
        socket.emit("message", { user: "admin", text: `Hi ${user.name}, Welcome to the room ${user.room}` });
        socket.broadcast.to(user.room).emit("message", { user: "admin", text: ` Your Friend ${user.name} has joined` });

        io.to(user.room).emit("roomData", { room: user.room, users: getUsersRoom(user.room) });

        
         
        callback();
    });

    //getting message from the user 
    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit("message", { user: user.name, text: message });

        callback();
    });

    //getting disconnection from clientside
    socket.on("disconnect", () => {
        console.log("User had left!!");
        const user = removeUser(socket.id);

        if(user) {
          io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
          io.to(user.room).emit('roomData', { room: user.room, users: getUsersRoom(user.room)});
        }
    
    })
});


server.listen(PORT, () => console.log(`server has started on port ${PORT}`));

