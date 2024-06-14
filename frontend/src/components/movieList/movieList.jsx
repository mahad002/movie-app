/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// MovieList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cards from '../movieCard/movieCard'; // Adjust the path as per your project structure
import './movieList.css'; // Ensure you have your movieList.css imported
import { useParams } from 'react-router-dom';

const base_url = import.meta.env.VITE_BASE_URL; // Ensure base_url is correctly defined

const MovieList = ({ id }) => {
  const { type } = useParams();
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState('');

  const tt = {
    popular: 'Trending',
    top_rated: 'Top Rated',
    upcoming: 'Coming Soon',
    all: 'All Movies'
  };

  console.log('type', type);
  console.log('id', id);

  // Load more movies when page changes
  useEffect(() => {
    if (page >= 1) {
      getData();
    }
  }, [page]);

  const getData = async () => {
    try {
      if(id == 'all') {
        // console.log('Im here');
        const response = await axios.get(`${base_url}/movie/getAllMovies`);
        const data = response.data;
        // console.log('data', data.movies);
        let moviesToAdd = data.movies;
    
        // Reverse the moviesToAdd array to show newly added movies first
        moviesToAdd = moviesToAdd.reverse();
    
        // console.log('moviesToAdd', moviesToAdd);
        // moviesToAdd.map((movie) => {
        //     console.log(movie);
        // });
    
        // Filter unique movies based on their IDs (assuming movie.id is unique)
        // const uniqueMoviesToAdd = moviesToAdd.filter(movie => !movies.find(existingMovie => existingMovie.id === movie.id));
    
        setMovies(moviesToAdd);
        // setTitle(tt[type]);
        // return;
      } else {
        const response = await axios.get(`${base_url}/movie/getMovies/${type ? type : id}?page=${page}`);
        const data = response.data;
        const moviesToAdd = data.movies.map(entry => entry.movie);

        // Filter unique movies based on their IDs (assuming movie.id is unique)
        const uniqueMoviesToAdd = moviesToAdd.filter(movie => !movies.find(existingMovie => existingMovie.id === movie.id));

        setMovies(prevMovies => [...prevMovies, ...uniqueMoviesToAdd]);
      }
      
      type ? setTitle(tt[type]) : setTitle(tt[id]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const loadMoreMovies = () => {
    setPage(page + 1);
  };

  return (
    <div className='movieList'>
      <h2 className='title'>{title}</h2>
      <div className='list'>
        {movies.map((movie) => (
          <Cards key={movie?.id} movie={movie} />
        ))}
        <div className="loadMoreCard" onClick={loadMoreMovies}>
          <div className="loadMoreCard__content">
            <div className="loadMoreCard__plus">+</div>
            <div className="loadMoreCard__text">Load More</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieList;
