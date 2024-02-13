import { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import './home.css';

const tmdb_api_key = import.meta.env.VITE_TMDB_API_KEY;  // Use VITE_ prefix

const Home = () => {
    // console.log(tmdb_api_key);
    const [popularMovies, setPopularMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const search = async (e) => {
        if (e.key === 'Enter') {
            const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${tmdb_api_key}&language=en-US&query=${searchTerm}&page=1&include_adult=false`);
            const data = await res.json();
            setPopularMovies(data.results);
            setSearchTerm('');
        }
    }
    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdb_api_key}&language=en-US&page=${1}`)
            .then(res => res.json())
            .then(data => setPopularMovies(data.results))
            .catch(error => console.error('Error fetching data:', error));
    }
    , [tmdb_api_key]);
    return (
        // <div className='home'>
        //     <div className='home-search'>
        //         <input type='text' className='search-bar' placeholder='Search...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={search} />
        //     </div>
        //     <div className='home-movies'>
        //         {popularMovies.map((movie) => (
        //             <div className='movie' key={movie.id}>
        //                 <div className='movie-img'>
        //                     <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
        //                 </div>
        //                 <div className='overlay'>
        //                     <div><h3>{movie.title}</h3></div>
        //                     <div className='movie-info'>
                                
        //                         <span className='movie-rating'>{movie.vote_average}</span>
        //                     </div>
        //                     <div className='movie-overview'>
        //                         <h2>Overview:</h2>
        //                         <p>{movie.overview}</p>
        //                     </div>
        //                 </div>
                        
        //             </div>
        //         ))}
        //     </div>
        // </div>
        <>
            <div className='movie'>
                <Carousel
                    showThumbs={false}
                    autoPlay={true}
                    transitionTime={3}
                    infiniteLoop={true}
                    showStatus={false}
                >
                    {popularMovies.map((movie) => (
                        <div key={movie.id}>
                            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                            <p className='legend'>{movie.title}</p>
                        </div>
                    ))}
                </Carousel>
            </div>
        </>
    );

    // useEffect(() => {
    //     fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdb_api_key}&language=en-US&page=${1}`)
    //         .then(res => res.json())
    //         .then(data => console.log(data.results))
    //         .catch(error => console.error('Error fetching data:', error));
    // }, [tmdb_api_key]); 

    // return (
    //     <>
    //         Home Page
    //     </>
    // );
};

export default Home;
