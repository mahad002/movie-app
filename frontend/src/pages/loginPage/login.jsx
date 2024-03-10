import  {useState,useContext} from 'react';
import AuthServices from '../../services/AuthServices';
import Message from '../../components/Message';
import { AuthContext } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = ()=>{
    const navigate = useNavigate();
    const [user,setUser] = useState({username: "", password : ""});
    const [message,setMessage] = useState(null);
    const authContext = useContext(AuthContext);

    const onChange = e =>{
        setUser({...user,[e.target.name] : e.target.value});
    } 

    const onSubmit = e =>{
        e.preventDefault();
        AuthServices.login(user).then(data=>{
            console.log(data);
            const { isAuthenticated,user,message} = data;
            if(isAuthenticated){
                authContext.setUser(user);
                authContext.setIsAuthenticated(isAuthenticated);
                navigate('/');
            }
            else
                setMessage(message);
                navigate('/');
        });
    }



    return(
        <div>
            <form onSubmit={onSubmit}>
                <h3>Please sign in</h3>
                <label htmlFor="username" className="sr-only">Username: </label>
                <input type="text" 
                       name="username" 
                       onChange={onChange} 
                       className="form-control" 
                       placeholder="Enter Username"
                       required="true"/>
                <label htmlFor="password" className="sr-only">Password: </label>
                <input type="password" 
                       name="password" 
                       onChange={onChange} 
                       className="form-control" 
                       placeholder="Enter Password"
                       required="true"/>
                <button className="btn btn-lg btn-primary btn-block" 
                        type="submit">Log in </button>
            </form>
            {message ? <Message message={message}/> : null}
        </div>
    )
}

export default Login;