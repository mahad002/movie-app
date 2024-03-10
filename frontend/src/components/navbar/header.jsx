import './header.css';
import {Link} from "react-router-dom";

const Header = () => {
    return (
        <div className='header'>
            <div className='headerl'>
                <Link to='/'><img className='header-icon' src="https://deal-share.s3.amazonaws.com/1707650165548.png" alt="Logo"/></Link>
                <Link className='h-btn' to='/movies/popular' style={{textDecoration: 'none', color:'white'}}><span>Trending</span></Link>
                <Link className='h-btn' to='/movies/top_rated' style={{textDecoration: 'none', color:'white'}}><span>Top Rated</span></Link>
                <Link className='h-btn' to='/movies/upcoming' style={{textDecoration: 'none', color:'white'}}><span>Coming Soon</span></Link>
            </div>
            <div className='headerr'>
                {/* <Link className='h-btn' to='/login' style={{textDecoration: 'none', color:'white'}}><span>Login</span></Link> */}
                <Link className='h-btn' to='/login-register' style={{textDecoration: 'none', color:'white'}}><span>SignUp</span></Link>
            </div>
        </div>
    );
}

export default Header;