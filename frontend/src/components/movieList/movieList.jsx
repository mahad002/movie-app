import './movieList.css';
import {useEffect, useState} from 'react';
import Cards from '../movieCard/movieCard';
import {useParams} from "react-router-dom";
import axios from 'axios';

const base_url = import.meta.env.VITE_BASE_URL;
const tmdb_api_key = import.meta.env.VITE_TMDB_API_KEY;  // Use VITE_ prefix

const MovieList = ({id}) => {
    const {type} = useParams();
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [title, setTitle] = useState('');

    const tt = {
        popular: 'Trending',
        top_rated: 'Top Rated',
        upcoming: 'Coming Soon'
    }

    useEffect(() => {
        getData();
    },[type])

    useEffect(() => {
        // getData()
        setPage(1);
    },[])
    // can improvise something by fetching data from here   https://api.themoviedb.org/3/movie/popular?api_key=${tmdb_api_key}&language=en-US&page=${1}&include_adult=false

    const getData = async () => {
            try {
                const response = await axios.get(`${base_url}/movie/getMovies/${type ? type: id}`);
                const data = response.data;
                console.log(data);
                const movies = data.movies.map(entry => entry.movie);
                setMovies(movies);
                type ? setTitle(tt[type]): setTitle(tt[id]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
    }


    return (
        <div className='movieList'>
            <h2 className='title'>{(title)} </h2>
            <div className='list'>
                {movies.map((movie) => (
                    <Cards key={movie.id} movie={movie} />
                ))}
                <Cards/>
            </div>
        </div>
    );

}
export default MovieList;