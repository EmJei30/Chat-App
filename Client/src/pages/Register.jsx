import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import '../stylesheets/Register.css';

const Register = () =>{
    const [username, setUserName ]= useState('');
    const [ email, setEmail] = useState('');
    const [ password, setPassword] = useState('');
    const [Notification, setNotification] = useState('');

    const handleSubmit = (e) =>{
        e.preventDefault();
        const newUser = {
            username: username,
            email: email,
            password: password
        }

        axios.post('http://localhost:3001/', {username, email, password})
        .then(result => console.log(result))
        .catch(err => console.log(err));

        setNotification('Registration successful !!');
        setInterval(() => {
            setNotification('');     
        }, 2000);

        // Reset the form
        setUserName('');
        setEmail('');
        setPassword('');
    }
    return (
        <div className='registerForm'>
            <div className='header'>
                <h2>Register</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className='name_con'>
                    <div className='name_label'><label>Username:</label></div>
                    <div className='name_input'><input type="text" value={username} onChange={(e)=>setUserName(e.target.value)} name = "username"  required/></div>
                </div>
                <div className='email_con'>
                    <div className='label_email'><label>Email:</label></div>
                    <div className='input_email'> <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} name = "email" required/></div>
                </div>
                <div className='pass_con'>
                    <div className='label_pass'><label>Password:</label></div>
                    <div className='input_pass'><input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} name = "password" required/></div>
                </div>
                <div className="signUpBtn" >Already have an account ?
                    <Link to ="/login" className="loginBtn"> Sign In</Link>
                </div>
                <div className='submit_con'>
                    <button type="submit">Register</button>
                </div>
                {Notification &&
                <div className= 'Notification_message success'>
                    <p>{Notification}</p>
            </div>
            }   
               
            </form>
        </div>
    )
}

export default Register;