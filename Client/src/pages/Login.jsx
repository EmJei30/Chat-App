import React, {useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import '../stylesheets/Login.css';

const Login = () =>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [Notification, setNotification] = useState('');
    const [isError, setIsError] = useState(null);
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };
    
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Perform login logic using email and password
        const users = JSON.parse(localStorage.getItem('users'));
        const user = users.find((user) => user.email === email && user.password === password);
    
        if (user) {
            setIsError(true);
            setNotification('Login successfull !!');
            setInterval(() => {
                navigate('/chat');  
                setNotification('');     
            }, 2000);
        
        sessionStorage.setItem('name',user.name); 
        } else {
            setNotification('Invalid credentials !!');
            setIsError(false);
            setInterval(() => {
                setNotification('');
            }, 2000);
          
        }
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
                    <div className="email_input"><input type="email" value={email} onChange={handleEmailChange} required/></div>
                </div>
                <div className="password_input">
                    <div className="pass_label"><label>Password:</label></div>
                    <div className="pass_input"><input type="password" value={password} onChange={handlePasswordChange} required/></div>
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