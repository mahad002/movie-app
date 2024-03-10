import './login-register.css';
import React, { useState,useRef,useEffect } from 'react';
import AuthServices from '../../services/AuthServices';
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
  MDBCheckbox,
  MDBIcon
} from 'mdb-react-ui-kit';

function LoginRegister() {
  const [activeTab, setActiveTab] = useState('signup');
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
            <MDBCardBody className='p-5 bg-red'>
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
                        <MDBInput wrapperClass='mb-4' label='First name' id='form1' type='text' />
                      </MDBCol>
                      <MDBCol col='6'>
                        <MDBInput wrapperClass='mb-4' label='Last name' id='form1' type='text' />
                      </MDBCol>
                    </MDBRow>
                    <MDBInput wrapperClass='mb-4' label='Email' id='form1' type='email' />
                    <MDBInput wrapperClass='mb-4' label='Password' id='form1' type='password' />
                    <div className='d-flex justify-content-center mb-4'>
                      <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Subscribe to our newsletter' />
                    </div>
                    <MDBBtn className='w-100 mb-4' size='md'>
                      Sign Up
                    </MDBBtn>
                  </div>
                )}

                {activeTab === 'login' && (
                  <div>
                    <MDBRow className='justify-content-center mt-4'>
                        <MDBCol md='8'>
                        <MDBInput wrapperClass='mb-4' label='Email' id='form1' type='email' className='custom-width-input' />
                        </MDBCol>
                    </MDBRow>
                    <MDBRow className='justify-content-center'>
                        <MDBCol md='8'>
                        <MDBInput wrapperClass='mb-4' label='Password' id='form1' type='password' className='custom-width-input' />
                        </MDBCol>
                    </MDBRow>
                    <MDBBtn className='w-100 mb-4' size='md'>
                        Login
                    </MDBBtn>
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
