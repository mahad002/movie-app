import { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import './home.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import MovieList from '../../components/movieList/movieList';
import axios from 'axios';
// import Cards from '../../components/movieCard/movieCard';

// const tmdb_api_key = import.meta.env.VITE_TMDB_API_KEY; 
const base_url = import.meta.env.VITE_BASE_URL;

const Home = () => {
    const [popularMovies, setPopularMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getMovies = async () => {
        try {
            const response = await axios.get(`${base_url}/movie/getMovies/popular`);
            const data = response.data;
            console.log(data);
            const movies = data.movies.map(entry => entry.movie);
            setPopularMovies(movies);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }



    useEffect(() => {
         getMovies();
    }, []);

    return (
        <>
            <div className='movie'>
                {isLoading || !popularMovies? (
                    <div className="movieCarousel">
                    <SkeletonTheme color="#202020" highlightColor="#444">
                        <Skeleton width={500} duration={2} />
                    </SkeletonTheme>
                    </div>
                ) : (
                <Carousel
                    showThumbs={false}
                    autoPlay={true}
                    transitionTime={3}
                    infiniteLoop={true}
                    showStatus={false}
                >
                    {popularMovies.map(movie => (
                        <>
                        <Link key={movie.id} style={{ textDecoration: "none", color: "white" }} to={`/movie/${movie.id}`}>
                            <div key={movie.id} className='movie-img'>
                                <img src={`https://image.tmdb.org/t/p/original${movie && movie.backdrop_path}`} alt={movie.title} />
                            </div>
                            <div className='overlay'>
                                <div className='movie-img-title'>
                                    {movie ? movie.original_title : ""}
                                </div>
                                <div className='movie-img-runtime'>
                                    {movie ? movie.release_date : ""}
                                    <span className='movie-img-rating'>
                                        {movie ? parseFloat(movie.vote_average.toFixed(1)) : ""}
                                        <FontAwesomeIcon icon={faStar} />{" "}
                                    </span>
                                </div>
                                <div className='movie-img-description'>
                                    {movie ? movie.overview : ""}
                                </div>
                            </div>
                        </Link>
                    </>                    
                    ))}
                </Carousel>)}
                <div>
                    <div className='home-movies'>
                        <MovieList id={'all'}/>
                        {/* <MovieList id={'top_rated'}/>
                        <MovieList id={'upcoming'}/> */}
                        {/* {popularMovies.map((movie) => (
                                <Cards key={movie.id} movie={movie}/>
                            // <div className='movie' key={movie.id}>
                            //     <div className='movie-img'>
                            //         <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                            //     </div>
                            //     <div className='overlay'>
                            //         <div><h3>{movie.title}</h3></div>
                            //         <div className='movie-info'>
                            //             <span className='movie-rating'>{movie.vote_average}</span>
                            //         </div>
                            //         <div className='movie-overview'>
                            //             <h2>Overview:</h2>
                            //             <p>{movie.overview}</p>
                            //         </div>
                            //     </div>
                            // </div>
                        ))} */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
