import React from 'react';
import { useCookies } from 'react-cookie';
import { Link } from "react-router-dom";
import './header.css';

const Header = () => {
    const [cookies, , removeCookie] = useCookies(['userToken']);
    const userToken = cookies.userToken;

    const handleLogout = () => {
        removeCookie('userToken');
        removeCookie('userInfo');
        // Perform additional logout operations if needed, like redirecting to a login page
    };

    return (
        <div className='header'>
            <div className='headerl'>
                <Link to='/'><img className='header-icon' src="https://deal-share.s3.amazonaws.com/1707650165548.png" alt="Logo" /></Link>
                <Link className='h-btn' to='/movies/popular' style={{ textDecoration: 'none', color: 'white' }}><span>Trending</span></Link>
                <Link className='h-btn' to='/movies/top_rated' style={{ textDecoration: 'none', color: 'white' }}><span>Top Rated</span></Link>
                <Link className='h-btn' to='/movies/upcoming' style={{ textDecoration: 'none', color: 'white' }}><span>Coming Soon</span></Link>
            </div>
            <div className='headerr'>
                {userToken ? (
                    <Link className='h-btn' to='/' onClick={handleLogout} style={{ textDecoration: 'none', color: 'white' }}><span>Logout</span></Link>
                ) : (
                    <Link className='h-btn' to='/login-register' style={{ textDecoration: 'none', color: 'white' }}><span>SignUp</span></Link>
                )}
            </div>
        </div>
    );
};

export default Header;
