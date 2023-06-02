import React, { useEffect, useState } from "react";
import '../stylesheets/Chat_Rooms.css';
import io from 'socket.io-client';
import icon from '../assets/images/trash.png';
const socket = io.connect('http://localhost:3001');

const ChatRooms = (props) =>{
    const date = new Date().toLocaleDateString();
    const [room, setRoom] = useState('');
    const [chatRooms, setChatRooms] = useState([]);
    const [roomID, setRoomID] = useState(0);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [selectedRoomName, setSelectedRoomName] = useState(''); 
    let name = sessionStorage.getItem('name');

    //listen to event and update the chatRooms state 
    useEffect(() => {
        const socket = io('http://localhost:3001');
        socket.on('chatRooms', (rooms) => {
            setChatRooms(rooms.room);
            setRoomID(rooms.id);
        });
    },[]);

    //passing data to parent component // Chat.js when selectedRoom was updated
    useEffect(()=>{
        const data = {roomId: selectedRoom, roomName: selectedRoomName, chatRooms: chatRooms};
        props.sendData(data);
    },[selectedRoom, chatRooms]);

    //set null value to selected room when user leave the room, and remove the className selected
    useEffect(()=>{
        if(props.roomSelected === null){
            setSelectedRoom(props.roomSelected);
        };   
    },[props.roomSelected]);

    //funtion trigger when form submit / creating new room
    const createRoom = (e) =>{
        e.preventDefault();
        //emit create room to the client and passing room name
        socket.emit('createRoom', {id: roomID, name: room, date: date, user:name});
        setRoom('');
    };

    // Function to remove a chat room
    const removeRoom = (roomId) => {
        socket.emit('removeRoom', roomId);
    };

     //set the selected room id and name when called
     const selectRoom = (roomId, roomName)=>{
        setSelectedRoom(roomId);
        setSelectedRoomName(roomName);
    };
    
    return(
        <>
        <div className="Chat_History_header">
            <div>
                Active Rooms
           </div>
        </div>
        <div className="Chat_Room_list">
            {chatRooms.map((room) =>{
                return(
                    <>
                        <div className={`room_info ${selectedRoom === room.id ? 'selected':""}`} key={room.id} >
                            <div className="info"  onClick={()=>selectRoom(room.id, room.name)}>
                                <div className="name"> 
                                    {room.name}
                                </div>
                                <div className="date">
                                    ( {room.user} ) &nbsp;
                                        {room.date}   
                                </div>
                            </div>
                            <div className="delete">
                                <img src = {icon} onClick={()=>removeRoom(room.id)} />
                            </div>
                        </div>
                    </>
                )
            })}       
        </div>
        <div className="create_room">
            <form className="add_room" onSubmit={createRoom}>
                <input type ="text" value={room} onChange={(e)=>setRoom(e.target.value)} required/>
                <button type="submit">Create</button>
            </form>
        </div>
        </>
    );
}

export default ChatRooms;