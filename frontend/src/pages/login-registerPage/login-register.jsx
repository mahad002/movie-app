import './login-register.css';
import { useState,useRef,useEffect,useContext } from 'react';
import AuthServices from '../../services/AuthServices';
import { AuthContext } from '../../Context/AuthContext';
import Message from '../../components/Message';
import { useNavigate } from 'react-router-dom';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  // MDBCheckbox,
  // MDBIcon  
} from 'mdb-react-ui-kit';

function LoginRegister() {
  const [activeTab, setActiveTab] = useState('signup');
  const [user,setUser] = useState({username: "", password : "", role : "user", name: "", email: ""});
    const [message, setMessage] = useState(null);
    const authContext = useContext(AuthContext);
    let timerID = useRef(null);
    const navigate = useNavigate();   


    useEffect(()=>{
        return ()=>{
            clearTimeout(timerID);
        }
    },[activeTab]);

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
            console.log("MESSAGE: ",message);
            resetForm();
            if(!message.msgError){
                timerID = setTimeout(()=>{
                    // navigate('/');
                    setActiveTab('login')
                },2000)
            }
        });
    }

    const onSubmit1 = e =>{
      e.preventDefault();
      AuthServices.login(user).then(data=>{
          console.log(data);
          const { isAuthenticated,user,message} = data;
          if(isAuthenticated){
              authContext.setUser(user);
              authContext.setIsAuthenticated(isAuthenticated);
              setMessage(message);
              console.log("MESSAGE: ",message);
              setTimeout(()=>{
                navigate('/');
              },3000)
          }
          else
              setMessage(message);
              console.log("MESSAGE: ",message);
              setTimeout(()=>{
                navigate('/');
              },3000)
      });
    }

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <MDBContainer fluid className='p-4'>
        <h1 className="my-1 display-3 fw-bold ls-tight px-3 align-items-center">
            The best movie 
            <span className="text-primary"> database in the market!</span>
          </h1>
      <MDBRow>
      <MDBCol md='6'>
          <MDBCard className='card1 my-5'>
            <MDBCardBody className='p-4'>
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <a className={`nav-link ${activeTab === 'signup' ? 'active' : ''} bg-transaprent`} onClick={() => toggleTab('signup')}>
                    Sign Up
                  </a>
                </li>
                <li className="nav-item">
                  <a className={`nav-link ${activeTab === 'login' ? 'active' : ''}bg-transaprent`} onClick={() => toggleTab('login')}>
                    Login
                  </a>
                </li>
              </ul>

              <div className='mt-2'>
                {activeTab === 'signup' && (
                  <div>
                    <MDBRow className='mt-4'>
                      <MDBCol col='6'>
                        <MDBInput
                          wrapperClass='mb-4'
                          label='Full name'
                          id='fullName'
                          type='text'
                          name='name' // Add name attribute for identification
                          value={user.name}
                          onChange={onChange}
                        />
                      </MDBCol>
                      <MDBCol col='6'>
                        <MDBInput
                          wrapperClass='mb-4'
                          label='Username'
                          id='username'
                          type='text'
                          name='username'
                          value={user.username}
                          onChange={onChange}
                        />
                      </MDBCol>
                    </MDBRow>
                    <MDBInput
                      wrapperClass='mb-4'
                      label='Email'
                      id='email'
                      type='email'
                      name='email'
                      value={user.email}
                      onChange={onChange}
                    />
                    <MDBInput
                      wrapperClass='mb-4'
                      label='Password'
                      id='password'
                      type='password'
                      name='password'
                      value={user.password}
                      onChange={onChange}
                    />
                    <div className='d-flex justify-content-end'>
                      <MDBBtn className='w-30 mb-4 mt-2' size='md' type='submit' onClick={onSubmit}>
                        Sign Up
                      </MDBBtn>
                    </div>
                  </div>
                )}

                {activeTab === 'login' && (
                  <div>
                    <MDBRow className='justify-content-center mt-4'>
                        <MDBCol md='8'>
                        <MDBInput 
                          wrapperClass='mb-4' 
                          label='username' 
                          id='form1' 
                          type='username' 
                          className='custom-width-input' 
                          value = {user.username}
                          onChange= {onChange}
                        />
                        </MDBCol>
                    </MDBRow>
                    <MDBRow className='justify-content-center'>
                        <MDBCol md='8'>
                        <MDBInput 
                          wrapperClass='mb-4' 
                          label='Password' 
                          id='form1' 
                          type='password' 
                          className='custom-width-input'
                          value = {user.password}
                          onChange= {onChange}
                        />
                        </MDBCol>
                    </MDBRow>
                    <div className='d-flex justify-content-end'>
                      <MDBBtn className='w-30 mb-4 mt-2' size='md' type='submit' onClick={onSubmit1}>
                          Login
                      </MDBBtn>
                    </div>
                </div>
                )}
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>
          
          <p className='px-3' style={{ color: 'hsl(217, 10%, 50.8%)' }}>
            Embark on a cinematic journey with MovieDb, where 
            immersive experiences await at every click. Explore a world 
            of captivating films, discover intriguing plotlines, and 
            dive into the realm of entertainment like never before.
          </p>
        </MDBCol>
      </MDBRow>
      {message ? <Message message={message}/> : null}
    </MDBContainer>
  );
}

export default LoginRegister;
