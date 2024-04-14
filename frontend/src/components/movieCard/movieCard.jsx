import { useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import './movieCard.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Cards = ({movie}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [poster_path, setPoster_path] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    if (movie?.poster_path[0] == '/') {
      console.log("First Char: ",movie.poster_path[0])
      setPoster_path(`https://image.tmdb.org/t/p/original${movie.poster_path}`);
    } else {
      setPoster_path('https://via.placeholder.com/300x450');
    }
  }, []);

  return (
    <>
      {isLoading || !movie? (
        <div className="movieCard">
          <SkeletonTheme color="#202020" highlightColor="#444">
            <Skeleton height={300} duration={2} />
          </SkeletonTheme>
        </div>
      ) : (
        <Link to={`/movie/${movie?.id}`} style={{ textDecoration: 'none', color: 'white' }}>
          <div className="movieCard">
            <img className="movieCard__img" src={`https://image.tmdb.org/t/p/original${poster_path}`} alt={movie?.original_title} />
            <div className="movieCard__overlay">
              <div className="movieCard__title">{movie?.original_title}</div>
              <div className="movieCard__runtime">
                {movie?.release_date}
                <span className="movieCard__rating">
                  {parseFloat(movie?.vote_average.toFixed(1))}
                  <i className="fas fa-star" />
                </span>
              </div>
              <div className="movieCard__description">{movie?.overview?.slice(0, 118) + '...'}</div>
            </div>
          </div>
        </Link>
      )}
    </>
  );
};

export default Cards;
