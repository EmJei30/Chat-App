import React, {useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import '../stylesheets/Login.css';

const Login = (props) =>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [Notification, setNotification] = useState('');
    const [isError, setIsError] = useState(null);
    const [userInfo, setUserInfo] = useState([]);
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };
    
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:3001/login', {email, password})
        .then(result => { 
                if (result.data === "Password is incorrect") {
                    setNotification('Password is incorrect!!');
                    setIsError(false);
                    setInterval(() => {
                        setNotification('');
                    }, 2000);

                }else if (result.data === "No record existed") {
                    setNotification('No record existed!!');
                    setIsError(false);
                    setInterval(() => {
                        setNotification('');
                    }, 2000);

                } else {
                    const data = result.data;
                    setIsError(true);
                    setNotification('Login successfull !!');
                    setInterval(() => {
                        navigate('/chat',{ state: { data } });  
                        setNotification('');     
                    }, 2000);

                    sessionStorage.setItem('username',result.data.username); 
                    
                }
        })
        .catch(err => console.log(err));
    
        // Reset the form
        setEmail('');
        setPassword('');
    };
   
    return (
        <div className="Login">
            <div className="header">
                <h2>Login</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="email_con">
                    <div className="email_label"><label>Email:</label></div>
                    <div className="email_input"><input type="email" value={email} onChange={handleEmailChange} name = "email" required/></div>
                </div>
                <div className="password_input">
                    <div className="pass_label"><label>Password:</label></div>
                    <div className="pass_input"><input type="password" value={password} onChange={handlePasswordChange} name = "password" required/></div>
                </div>
                <div className="signUpBtn" >Doesn't have an account ?
                    <Link to="/" className="signUp"> Sign Up</Link>
                </div>
                <div className="button_con">
                    <button type="submit">Login</button>
                </div>   
            </form>
            {Notification &&
                <div className={`Notification_message_login ${isError ? 'success': 'error'}`}>
                    <p>{Notification}</p>
            </div>
            }   
        </div>
    );
}

export default Login;