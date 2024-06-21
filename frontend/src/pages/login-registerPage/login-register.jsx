/* eslint-disable no-unused-vars */
import './login-register.css';
import { useState, useRef, useEffect, useContext } from 'react';
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
} from 'mdb-react-ui-kit';
import axios from 'axios';
import Spinner from '../../components/spinner/spinner';

function LoginRegister() {
  const [activeTab, setActiveTab] = useState('signup');
  const [user1, setUser1] = useState({ username: "", password: "", role: "user", name: "", email: "", profilePicture: "" });
  const [message, setMessage] = useState(null);
  const { user, setUser } = useContext(AuthContext);
  let timerID = useRef(null);
  const navigate = useNavigate();
  const [spinner, setSpinner] = useState(false);
  const [image, setImage] = useState();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    return () => {
      clearTimeout(timerID);
    }
  }, [activeTab]);

  const onChange = e => {
    setUser1({ ...user1, [e.target.name]: e.target.value });
  }

  const resetForm = () => {
    setUser1({ username: "", password: "", role: "user", name: "", email: "", profilePicture: "" });
  }

  const onSubmit = e => {
    e.preventDefault();
    if (user1.profilePicture === "") {
      user1.profilePicture = "https://movie-webapp.s3.ap-south-1.amazonaws.com/1710577341001.jpg";
    }
    AuthServices.register(user1).then(data => {
      const { message } = data;
      setMessage(message);
      resetForm();
      if (!message.msgError) {
        timerID = setTimeout(() => {
          AuthServices.login(user1).then(data => {
            const { isAuthenticated, message, token } = data;
            setUser(user);
            if (isAuthenticated) {
              setMessage(message);
              setTimeout(() => {
                navigate(`/profile/${user.username}`, { replace: true });
              }, 3000)
            } else {
              setMessage(message);
              setTimeout(() => {
                navigate(`/`);
              }, 3000)
            }
          });
        }, 2000)
      }
    });
  }

  const onSubmit1 = e => {
    e.preventDefault();
    AuthServices.login(user1).then(data => {
      const { isAuthenticated, user, message } = data;
      if (isAuthenticated) {
        setUser(user);
        setMessage(message);
        setTimeout(() => {
          navigate('/');
        }, 3000)
      } else {
        setMessage(message);
        setTimeout(() => {
          navigate('/');
        }, 3000)
      }
    });
  }

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const uploadImage = async (ev) => {
    setImage('');
    const file = ev.target?.files[0];
    if (file) {
      setSpinner(true);
      const data = new FormData();
      data.append("file", file);
      try {
        const res = await axios.post(`${BASE_URL}/upload/`, data);
        setImage([res.data.links]);
        user1.profilePicture = String(res.data.links[0]);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setSpinner(false);
      }
    }
  };

  const removeImage = () => {
    setImage('');
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
                  <a className={`nav-link ${activeTab === 'signup' ? 'active' : ''} bg-transparent`} onClick={() => toggleTab('signup')}>
                    Sign Up
                  </a>
                </li>
                <li className="nav-item">
                  <a className={`nav-link ${activeTab === 'login' ? 'active' : ''} bg-transparent`} onClick={() => toggleTab('login')}>
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
                          name='name'
                          value={user1.name}
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
                          value={user1.username}
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
                      value={user1.email}
                      onChange={onChange}
                    />
                    <MDBInput
                      wrapperClass='mb-4'
                      label='Password'
                      id='password'
                      type='password'
                      name='password'
                      value={user1.password}
                      onChange={onChange}
                    />
                    <div className="image-div mb-2">
                      {!!image && (
                        <div className="relative">
                          <div className='image-container'>
                            <button
                              className="remove-button"
                              onClick={() => removeImage(0)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 bg-red-600 rounded-lg p-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg> 
                            </button>
                            <img src={image} className="w-full h-full object-cover" alt="" />
                          </div>
                        </div>
                      )}
                      {spinner && (
                        <div className="spinner-container bg-gray-100 flex items-center rounded-lg">
                          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-gray-900">
                            <Spinner />
                          </div>
                        </div>
                      )}
                      <label className="custom-label relative" htmlFor="upload-input">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                          />
                        </svg>
                        <div className="add-text">Add</div>
                        <input id="upload-input" type="file" onChange={uploadImage} className="custom-file-input" />
                      </label>
                    </div>
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
                          label='Username'
                          id='loginUsername'
                          type='text'
                          name='username'
                          value={user1.username}
                          onChange={onChange}
                        />
                      </MDBCol>
                    </MDBRow>
                    <MDBRow className='justify-content-center'>
                      <MDBCol md='8'>
                        <MDBInput
                          wrapperClass='mb-4'
                          label='Password'
                          id='loginPassword'
                          type='password'
                          name='password'
                          value={user1.password}
                          onChange={onChange}
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
