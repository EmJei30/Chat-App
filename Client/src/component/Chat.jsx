import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import Active_List from './Active_List';
import ChatRooms from './ChatRooms';
import ScrollToBottom from 'react-scroll-to-bottom';
import welcome from '../assets/images/welcome.png';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001');

const Chat = () => {
    const time = new Date().toLocaleTimeString();
    const [conversations, setConversations] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser] = useState('');
    const [roomSelected, setRoomSelected] = useState('');
    const [roomSelectedName, setRoomSelectedName] = useState('');
    const [rooms, setRooms]= useState([]);
    const [notification, setNotification] = useState('');
    const [avatar, setAvatar] = useState('');
    const [currentRoomUsers, setCurrentRoomUsers] = useState([]);
    
    const navigate = useNavigate();
    useEffect(()=>{
        let name = sessionStorage.getItem('name');
        let id = Math.floor(Math.random() * 5) + 1;
        if(name === "" || name === null){
            navigate('/login');   
        }else{
            setUser(name);
            setAvatar(`/images/${id}.png`);
        };
    },[]);

    useEffect(()=>{
        socket.emit('join',user, avatar );
    }, [user, avatar]);
    
    //use to check if the current room selected is still existing
    useEffect(()=>{
        if(roomSelected && !rooms.some(room => room.id === roomSelected)){
            setRoomSelected('');
            setRoomSelectedName('');
        };
    }, [rooms]);

    //join the room on the component mount and and when the room id is update
    useEffect(()=>{
        if(roomSelected){
            socket.emit('joinRoom', roomSelected, user, avatar);
        };
        
        socket.on('usersInRoom', (currentRoomUsers)=>{
            setCurrentRoomUsers(currentRoomUsers);
        });
        
        //handle the 'userJoin' event 
        socket.on('notification', (userJoined)=>{
            setNotification(userJoined);
            // Clear the notification after 2 seconds
            setTimeout(() => {
                setNotification('');
            }, 2000);
        });

        //when a conversation event is received , update the conversation state
        socket.on('conversation', (updatedConversation, roomId) => {
            setConversations(updatedConversation); 
        });

        setConversations([]);

        //cleans the event listener and leave the room when component mount or selected room change
        return ()=>{
            socket.off('conversation');
            socket.off('notification');
            socket.off('usersInRoom');
            if(roomSelected){
                socket.emit('leaveRoom', roomSelected, user);
            }
        };
    },[roomSelected]);

    //function to send a message
    const sendMessage = (e) =>{
        e.preventDefault();
        socket.emit('message', {roomId: roomSelected, msg: newMessage, user: user, time: time});
        setNewMessage('');
    };

    //funtion that handles log out
    const handleLogOut = () =>{
        sessionStorage.setItem('name',""); 
        socket.emit('leaveRoom', roomSelected, user);
        navigate('/login');
        window.location.reload();   
    };
    //function for leaving room
    const handleLeaveRoom = () =>{
        socket.emit('leaveRoom', roomSelected, user);
        setRoomSelected(null);
    };
    //hanlde data recieved from child component
    const handleData = (data)=>{
            setRoomSelected(data.roomId);
            setRoomSelectedName(data.roomName);
            setRooms(data.chatRooms);
    };

      return (
        <>
            <div className='container'>
                <div className='chat_history'>
                    <ChatRooms sendData = {handleData} roomSelected = {roomSelected} />
                </div>
                <div className='chat'>
                    <div className='chat_header'>
                        <div className="chat_icon">
                            <img src = {avatar} alt =''/>
                        </div>
                        <div className="chat_name">
                            {user}    
                        </div>
                        <div className='option'>
                            <button type="submit" onClick={handleLeaveRoom}>Leave Room</button>
                            <button type="submit" onClick={handleLogOut}>Log out</button>
                        </div>
                    </div>
                    {roomSelected && rooms.length > 0  ?
                        <>
                            <div className='conversation'>
                                <div className='header'>
                                    <h2>Conversation in Room: {roomSelectedName}</h2>
                                </div>
                                <div className='messageContainer'>
                                {notification && <div className='notification'>{notification}</div>}
                                <ScrollToBottom className='scroll'>
                                    {conversations.map((message, index)=>(
                                            <div className={`message ${user === message.user ? 'sender':''}`} key = {index}>
                                                <div className='userContainert'>
                                                    <p className='user'>{message.user}</p>
                                                </div>
                                                <div className='msgContainer'>
                                                    <p className='text'>{message.msg}</p>
                                                </div>
                                                <div className='timeContainer'>
                                                    {message.time}
                                                </div>
                                            </div>
                                ))}
                                </ScrollToBottom>
                                </div>
                            </div>
                            <div className='input_container'>
                                <form onSubmit={sendMessage}>
                                    <input type ="text" value={newMessage} onChange={(e)=>setNewMessage(e.target.value)}/>
                                    <button type="submit">Send</button>
                                </form>
                            </div>
                        </>
                    :
                    <div className='welcome'>
                        <div className='welcome_msg'>
                            <div>
                                <h1>Welcome {user}</h1> 
                                <h3>Join the chat now</h3> 
                                <h3>or you can create your own chat room.</h3> 
                            </div>            
                        </div>
                       <div className='welcome_img'>
                            <img src ={welcome} alt =''/>
                       </div>
                    </div>
                    }
                </div>
                <div className='contact_list'>
                    <Active_List  user = {user} roomSelected = {roomSelected} currentRoomUsers = {currentRoomUsers}/>
                </div>
            </div>
        </>
      );
    }
    
    export default Chat;