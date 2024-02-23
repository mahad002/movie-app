import {useState,useRef,useEffect} from 'react';
import AuthServices from '../../services/AuthServices';
import Message from '../../components/Message';
import { useNavigate } from 'react-router-dom';
import './signup.css';

const Register = ()=>{
    const [user,setUser] = useState({username: "", password : "", role : "", name: "", email: ""});
    const [message,setMessage] = useState(null);
    let timerID = useRef(null);
    const navigate = useNavigate();

    useEffect(()=>{
        return ()=>{
            clearTimeout(timerID);
        }
    },[]);

    const onChange = e =>{
        setUser({...user,[e.target.name] : e.target.value});
    }

    const resetForm = ()=>{
        setUser({username : "", password : "",role : "", name: "", email: ""});
    }

    const onSubmit = e =>{
        e.preventDefault();
        AuthServices.register(user).then(data=>{
            const { message } = data;
            setMessage(message);
            resetForm();
            if(!message.msgError){
                timerID = setTimeout(()=>{
                    navigate('/login');
                },2000)
            }
        });
    }



    return(
        <div className='register-form'>
            <form className='register-form' onSubmit={onSubmit}>
                <h3 className='register-heading'>Please Register</h3>
                <div className='register-div'>
                    <label htmlFor="username" className="register-labels">Username: </label>
                    <input type="text" 
                        name="username" 
                        value={user.username}
                        onChange={onChange} 
                        className="register-inputs form-control" 
                        placeholder="Enter Username"
                        required="true"/>
                </div>
                <div className='register-div'>
                    <label htmlFor="password" className="register-labels">Password: </label>
                    <input type="password" 
                        name="password"
                        value={user.password} 
                        onChange={onChange} 
                        className="register-inputs form-control" 
                        placeholder="Enter Password"
                        required="true"/>
                </div>
                <div className='register-div'>
                    <label htmlFor="role" className="register-labels">Role: </label>
                    <input type="text" 
                        name="role"
                        value={user.role}  
                        onChange={onChange} 
                        className="register-inputs form-control" 
                        placeholder="Enter role (admin/user)"
                        required="true"/>
                </div>
                <div className='register-div'>
                    <label htmlFor="name" className="register-labels">Name: </label>
                    <input type="text" 
                        name="name"
                        value={user.name}  
                        onChange={onChange} 
                        className="register-inputs form-control" 
                        placeholder="Enter Name"
                        required="true"/>
                </div>
                <div className='register-div'>
                    <label htmlFor="email" className="register-labels">Email: </label>
                    <input type="text" 
                        name="email"
                        value={user.email}  
                        onChange={onChange} 
                        className="register-inputs form-control" 
                        placeholder="Enter Email"
                        required="true"/>
                </div>
                <button className="register-btn" 
                        type="submit">Register</button>
            </form>
            {message ? <Message message={message}/> : null}
        </div>
    )
}

export default Register;