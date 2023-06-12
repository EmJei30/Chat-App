const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const {Server} = require('socket.io');
const mongoose = require('mongoose');
const server = http.createServer(app);
const UsersModel = require('./models/Users');

//uses cors middleware to resolve issues on http request
app.use(cors());
app.use(express.json());

//connect to mongodb database
mongoose.connect("mongodb://127.0.0.1:27017/chatdb");

//creating route for register
app.post('/', (req, res)=>{
    //insert the record to the database
    UsersModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err));
});

//route for login
app.post('/login', (req, res)=>{
    const {email, password} = req.body;
    UsersModel.findOne({email: email})
    .then(user =>{
        //if user email exist, validate the password
        if(user){
            if(user.password === password){
                res.json(user);
            }else{
                res.json('Password is incorrect');
            }
        }else{
            res.json('No record existed');
        }
    })
    .catch(err => console.log(err));
});

//instantiate the socket.io
const io = new Server(server, {
    //pass the server, solving some cors issues
    cors:{
        //tell the server which server will make the call to our socket.io server 
        origin : "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["Authorization", "Content-Type"],
    },
});

let chatRooms = [];
let currentRoomId = 0;
let conversations = {};
const connectedUsers = {};
const roomUsers = {};
let unReadMessage = 1;

//whenever new user is connected (built in connection detects some new user// disconnect when user left)
io.on('connection', (socket)=>{

     // Handle new user connection
    socket.on('join', (newUser, avatar)=>{
        const data = {
            user: newUser,
            avatar: avatar
        };
        // Add the user to the connected users list
        connectedUsers[socket.id] = data;
    });

    // emit the updated list of connected users to all clients
    io.emit('activeUsers', Object.values(connectedUsers));

    //handle user disconnection 
    socket.on('disconnect', ()=>{
        delete connectedUsers[socket.id];
        
         // emit the updated list of connected users to all clients
         io.emit('activeUsers', Object.values(connectedUsers));
    });

/**-------------------------create room and remonve room------------------- */
    //add a new chat room
    socket.on('createRoom', (data)=>{
        currentRoomId = data.id  + 1;
        newRoom = {
            id: currentRoomId,
            name: data.name,
            date: data.date,
            user: data.user,
            usersId: data.usersId
        };
        chatRooms.push(newRoom);

        //to broadcast the update chatrooms
        io.emit('chatRooms', {room: chatRooms, id: currentRoomId});
    });

    //to emit initial chatrooms to new user
    socket.emit('chatRooms', {room: chatRooms, id: currentRoomId});

   //Remove a chat room
    socket.on('removeRoom', (room) => {

        chatRooms = chatRooms.filter((r) => r.id !== room);
        io.emit('chatRooms', {room: chatRooms, id: currentRoomId}); // Broadcast the updated chat rooms list to all clients
  });

/**----------------------join, leave and emit room conversation history selected room-------------------- */
    //handle the joinRoom event
    socket.on('joinRoom', (roomId, username, avatar)=>{
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('notification',  `${username} joined the room.`);

        const roomData = {
            user: username,
            avatar: avatar
        };
        if(!roomUsers[roomId]){
            roomUsers[roomId]= [];
        };
        roomUsers[roomId].push(roomData);
        
        //broadcast the active user to the room 
        io.to(roomId).emit('usersInRoom', roomUsers[roomId]);
        
        //broadcast the conversation to the joining client
        if(conversations[roomId]){
            socket.emit('conversation', conversations[roomId]);
        };
    });

    //handle the leaveRoom event 
    socket.on('leaveRoom', (roomId,username)=>{
        socket.leave(roomId);
        socket.broadcast.to(roomId).emit('notification',  `${username} leave the room.`);
        if(roomUsers[roomId]){
            roomUsers[roomId] = roomUsers[roomId].filter((user) => user.user !== username);
        };
         //broadcast the active user to the room 
         io.to(roomId).emit('usersInRoom', roomUsers[roomId]);
    });
    
/**---------------------creating messages from client-------------------------- */
  /**when a message is received, add to the conversation 
  for the corresponding room */
    socket.on('message', (data)=>{
        //destructuring the roomId
        const {roomId, msg, user, time} = data;
        const newData = {
            roomId: roomId,
            msg: msg,
            user: user,
            time: time,
            unReadMessage: unReadMessage
        };
        if(!conversations[roomId]){
            conversations[roomId]= [];
        };
            conversations[roomId].push(newData);
           
        //broadcat the updated conversation to all client in the room
        io.to(roomId).emit('conversation', conversations[roomId]);
    });
});

server.listen(3001, () =>{
    console.log("Connected to server");
});