const express = require('express');
const router = express.Router();
const axios = require('axios');
require("dotenv").config();

const tmdb_api_key = process.env.TMDB_API_KEY;

router.get('/:id', async (req, res) => {
    try {
        const movieId = req.params.id;
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${tmdb_api_key}&language=en-US`);
        const movie = response.data;

        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        res.status(200).json({ movie });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/type/:type', async (req, res) => {
    try {
        const page = req.query.page || 3;
        

        const response = await axios.get(`https://api.themoviedb.org/3/movie/${req.params.type}?api_key=${tmdb_api_key}&language=en-US&page=${page}&include_adult=true`);
        const movies = response.data.results;

        if (!movies || movies.length === 0) {
            return res.status(404).json({ error: 'No movies found for the specified type' });
        }

        res.status(200).json({ movies });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/trailer/:id', async (req, res) => {
    try {
        const movieId = req.params.id;
        const response = await axios.get(`https://api.kinocheck.de/movies?tmdb_id=${movieId}&language=de&categories=Trailer,-Clip`);
        const trailers = response.data;
        if (!trailers) {
            return res.status(404).json({ error: 'Trailer not found' });
        }
        const trailer = trailers.trailer.youtube_video_id;
        if (!trailer) {
            return res.status(404).json({ error: 'Trailer not found' });
        }
        const yt_trailer_vid = `https://www.youtube.com/embed/${trailer}`;
        res.status(200).json({ yt_trailer_vid });
    } catch(error) {
        // console.error(error);
        res.status(404).json({ error: 'No Trailer!' });
    }
});

module.exports = router;