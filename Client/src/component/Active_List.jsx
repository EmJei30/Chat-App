import React, { useState, useEffect } from 'react';
import '../stylesheets/Active_List.css';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001');

const Active_List = ({user, roomSelected, currentRoomUsers}) =>{
    const [newUser, setNewUser] = useState('');
    const [activeUsers, setActiveUsers]= useState([]);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [roomUsers, setRoomUsers] = useState([]);
  
    useEffect(()=>{
        setNewUser(user);
    },[user]);

    useEffect(()=>{
        setSelectedRoom(roomSelected);
        setRoomUsers(currentRoomUsers);
    },[roomSelected, currentRoomUsers]);

    //listen to activeUser from the server
    useEffect(()=>{
        socket.on('activeUsers', (userData)=>{
            setActiveUsers(userData);
        })
        return ()=>{
            socket.off('activeUsers');
        }
    },[activeUsers]);
    
    return(
        <>
        <div className="Active_List_header">
           <div className='header_text'>
            Active Users
           </div>
        </div>
        <div className="Active_List">
            <div className='lobby_list'>
                {activeUsers.map((user, index)=>(
                    <div className='online' key = {index}>
                        <div className="icon">
                            <img src = {user.avatar} alt=''/>
                        </div>
                        <div className="activeName">
                            {newUser === user.user ? <p>{user.user} ( you )</p> : <p>{user.user}</p> }
                        </div>
                    </div>
                ))};
            </div>
            {selectedRoom &&
            <div className='room_list'>
                <div className='room_list_header'>
                    <div className='header_text'>
                        Active Users in room
                    </div>
                </div>
                    <div className='online_list'>
                    {roomUsers.map((roomUser, index)=>(
                        <div className='online_room' key={index}>
                            <div className="icon">
                                <img src = {roomUser.avatar} alt=''/>
                            </div>
                            <div className="roomActiveName">
                                {newUser === roomUser.user ? <p>{roomUser.user} ( you )</p> : <p>{roomUser.user}</p> }
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            } 
            </div>
        </>
    );
}

export default Active_List;