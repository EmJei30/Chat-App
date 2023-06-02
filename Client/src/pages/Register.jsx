import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import '../stylesheets/Register.css';

const Register = () =>{
    const [name, setName ]= useState('');
    const [ email, setEmail] = useState('');
    const [ password, setPassword] = useState('');
    const [Notification, setNotification] = useState('');

    const handleNameChange = (e) =>{
        setName(e.target.value);
    }
    const handleEmailChange = (e) =>{
        setEmail(e.target.value);
    }
    const handlePasswordChange = (e) =>{
        setPassword(e.target.value);
    }
    const handleSubmit = (e) =>{
        e.preventDefault();
        const newUser = {
            name: name,
            email: email,
            password: password
        }
        //store the new registered user on the local storage
        const existingUSers = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUsers = [...existingUSers, newUser];

        localStorage.setItem('users', JSON.stringify(updatedUsers));

        setNotification('Registration successful !!');
        setInterval(() => {
            setNotification('');     
        }, 2000);

        // Reset the form
        setName('');
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
                    <div className='name_input'><input type="text" value={name} onChange={handleNameChange}  required/></div>
                </div>
                <div className='email_con'>
                    <div className='label_email'><label>Email:</label></div>
                    <div className='input_email'> <input type="email" value={email} onChange={handleEmailChange} required/></div>
                </div>
                <div className='pass_con'>
                    <div className='label_pass'><label>Password:</label></div>
                    <div className='input_pass'><input type="password" value={password} onChange={handlePasswordChange} required/></div>
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