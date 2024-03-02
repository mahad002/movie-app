import './movieList.css';
import {useEffect, useState} from 'react';
import Cards from '../movieCard/movieCard';
import {useParams} from "react-router-dom";

const MovieList = ({id}) => {
    const tmdb_api_key = import.meta.env.VITE_TMDB_API_KEY;  // Use VITE_ prefix
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
    //         https://api.themoviedb.org/3/movie/popular?api_key=${tmdb_api_key}&language=en-US&page=${1}&include_adult=false
    const getData = () => {
        fetch(`https://api.themoviedb.org/3/movie/${type ? type: id}?api_key=${tmdb_api_key}&language=en-US&page=${page}&include_adult=false`)
            .then(res => res.json())
            .then(data => {setMovies(data.results); type ? setTitle(tt[type]): setTitle(tt[id])})
            .catch(error => console.error('Error fetching data:', error));
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