import React, { useEffect, useState } from "react";
import '../stylesheets/Chat_Rooms.css';
import io from 'socket.io-client';
import icon from '../assets/images/trash.png';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
const socket = io.connect('http://localhost:3001');

const ChatRooms = (props) =>{
    const date = new Date().toLocaleDateString();
    const [room, setRoom] = useState('');
    const [chatRooms, setChatRooms] = useState([]);
    const [currentUser, setCurrentUser] = useState('');
    const [currentUserID, setCurrentUserId] = useState('');
    const [roomID, setRoomID] = useState(0);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [selectedRoomName, setSelectedRoomName] = useState(''); 
    const [isAdmin, setIsAdmin] = useState(true);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);   

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

    useEffect(()=>{
        if(props.user && props.userId){
            setCurrentUser(props.user);
            setCurrentUserId(props.userId);
        };   
    },[props.user, props.userId]);

    //funtion trigger when form submit / creating new room
    const createRoom = (e) =>{
        e.preventDefault();
        //emit create room to the client and passing room name
        socket.emit('createRoom', {id: roomID, name: room, date: date, user:currentUser, usersId: currentUserID});
        setRoom('');
    };

    // Function to remove a chat room
    const removeRoom = (roomId, roomUsersId) => {
        if(selectedRoom === roomId && currentUserID === roomUsersId){
            setDeleteConfirmation(true);
        }else{
            setIsAdmin(false);
        }
        setInterval(() => {
            setIsAdmin(true);
        }, 2000);
    };

    //function handle delete confirmation
    const delete_yes= (roomId) =>{
         socket.emit('removeRoom', roomId);
         setDeleteConfirmation(false);
    }
    const delete_no= () =>{
        setDeleteConfirmation(false);
    }

     //set the selected room id and name when called
     const selectRoom = (roomId, roomName)=>{
        setSelectedRoom(roomId);
        setSelectedRoomName(roomName);
    };
console.log(chatRooms);
    return(
        <>
        <div className="Chat_History_header">
            <div>
                Active Rooms
           </div>
        </div>
        <div className="Chat_Room_list">
            {!isAdmin &&
                <div className = "delete_notification">
                    <div className="delete_notification_icon_con">
                        <ErrorOutlineIcon className="delete_notification_icon"/>
                    </div>
                    <div className="delete_notification_message">
                        <h4>Error</h4>
                        <h6>Only the creator can delete the room.</h6>
                    </div>
                </div>
            }
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
                            <div className={`delete ${selectedRoom === room.id ? 'show':'hide'}`}>
                                {!deleteConfirmation &&
                                    <img src = {icon} onClick={()=>removeRoom(room.id, room.usersId)} />  
                                }
                                {deleteConfirmation &&
                                    <div className="confimation_con">
                                        <DoneOutlinedIcon onClick = {()=>delete_yes(room.id)}/>
                                        <CloseOutlinedIcon onClick = {()=>delete_no()}/>
                                    </div>
                                }
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