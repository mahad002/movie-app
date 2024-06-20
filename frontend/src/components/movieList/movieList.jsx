/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Cards from '../movieCard/movieCard'; // Adjust the path as per your project structure
import './movieList.css'; // Ensure you have your movieList.css imported
import { useParams } from 'react-router-dom';

const base_url = import.meta.env.VITE_BASE_URL; // Ensure base_url is correctly defined

const MovieList = ({id}) => {
  const { type } = useParams(); // Use `type` to capture the parameter from the URL
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [noMoreMovies, setNoMoreMovies] = useState(false);
  const loadedMovieIds = useRef(new Set());

  const tt = {
    popular: 'Trending',
    top_rated: 'Top Rated',
    upcoming: 'Coming Soon',
    all: 'All Movies'
  };

  useEffect(() => {
    // Reset state on type change
    setPage(1);
    setMovies([]);
    setNoMoreMovies(false);
    loadedMovieIds.current.clear();
    setTitle(tt[type] || '');
    getData(1);
  }, [type]);

  useEffect(() => {
    if (page > 1) {
      getData(page);
    }
  }, [page]);

  const getData = async (pageNumber) => {
    console.log('Type:', type)
    try {
      setLoading(true);
      let response;
      if (id == 'all') {
        console.log('all movies');
        response = await axios.get(`${base_url}/movie/getAllMovies`);
      } else {
        response = await axios.get(`${base_url}/movie/getMovies/${type}?page=${pageNumber}`);
      }

      const data = response.data;

      if (data.error || data.movies.length === 0) {
        setNoMoreMovies(true);
        setLoading(false);
        return;
      }

      let moviesToAdd = id === 'all' ? data.movies.reverse() : data.movies.map(entry => entry.movie);

      // Filter unique movies based on their IDs
      const uniqueMoviesToAdd = moviesToAdd.filter(movie => {
        if (!loadedMovieIds.current.has(movie.id)) {
          loadedMovieIds.current.add(movie.id);
          return true;
        }
        return false;
      });

      setMovies(prevMovies => [...prevMovies, ...uniqueMoviesToAdd]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const loadMoreMovies = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className='movieList'>
      <h2 className='title'>{title}</h2>
      <div className='list'>
        {movies.map((movie) => (
          <Cards key={movie.id} movie={movie} />
        ))}
        {!loading && noMoreMovies && (
          <div className="noMoreMoviesMessage">No more movies available.</div>
        )}
        {!noMoreMovies && (
          <div className="loadMoreCard" onClick={loadMoreMovies}>
            <div className="loadMoreCard__content">
              <div className="loadMoreCard__plus">+</div>
              <div className="loadMoreCard__text">Load More</div>
            </div>
          </div>
        )}
      </div>
      {loading && <div className="loadingMessage">Loading...</div>}
    </div>
  );
};

export default MovieList;
