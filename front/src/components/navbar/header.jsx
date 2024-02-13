import './header.css';
import {Link} from "react-router-dom";

const Header = () => {
    return (
        <div className='header'>
            <div className='headerl'>
                <Link to='/'><img className='header-icon' src="https://deal-share.s3.amazonaws.com/1707650165548.png" alt="Logo"/></Link>
                <Link to='/movies/trending' style={{textDecoration: 'none', color:'white'}}><span>Trending</span></Link>
                <Link to='/movies/top_rated' style={{textDecoration: 'none', color:'white'}}><span>Top Rated</span></Link>
                <Link to='/movies/upcoming' style={{textDecoration: 'none', color:'white'}}><span>Coming Soon</span></Link>
            </div>
        </div>
    );
}

export default Header;