const express = require('express');
const router = express.Router();
const axios = require('axios');
require("dotenv").config();
const User = require('../models/user');
const Movie = require('../models/movie');
const UserAuth = require('../middlewares/UserAuth');

const tmdb_api_key = process.env.TMDB_API_KEY;
const base_url = process.env.BASE_URL;

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
            return res.status(200).json({ message: 'Trailer not found' });
        }
        const trailer = trailers.trailer.youtube_video_id;
        if (!trailer) {
            return res.status(200).json({ message: 'Trailer not found' });
        }
        const yt_trailer_vid = `https://www.youtube.com/embed/${trailer}`;
        res.status(200).json({ yt_trailer_vid });
    } catch(error) {
        // console.error(error);
        res.status(404).json({ error: 'No Trailer!' });
    }
});

router.post('/postMovies/:type', async (req, res) => {
    try {
        let page = 1;
        let movies = [];
        const type = req.params.type;
        while (page <= 3) {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${type}?api_key=${tmdb_api_key}&language=en-US&page=${page}&include_adult=true`);
            movies = movies.concat(response.data.results);
            page++;
        }

        if (!movies || movies.length === 0) {
            return res.status(404).json({ error: 'No movies found for the specified type' });
        }

        // Collect all movieIds in an array
        const movieIds = movies.map(movieData => movieData.id);

        console.table(movieIds);

        // Use axios.all to make multiple requests concurrently
        const requests = movieIds.map(movieId =>
            axios.patch(`${base_url}/movie/updateMovies/${movieId}`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        );

        // Make all patch requests concurrently
        await axios.all(requests);

        // Now store all movieIds with the specified 'type'
        await axios.post(`${base_url}/type/add`, {  
            movieIds: movieIds, 
            type: type, 
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        res.status(200).json({ success: true, message: 'Movies saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.patch('/updateMovies/:id', async (req, res) => {
    try {
        const movieId = req.params.id;

        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${tmdb_api_key}&language=en-US`);
        const movieData = response.data;

        if (!movieData) {
            return res.status(404).json({ error: 'Movie not found in the API' });
        }

        const updatedMovie = await Movie.findOneAndUpdate(
            { id: movieId },
            { $set: movieData },
            { new: true, upsert: true },
        );

        res.status(200).json({ success: true, message: 'Movie updated successfully', movie: updatedMovie });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get("/get/:id", async (req, res) => {
    try {
        const movieId = req.params.id;
        const movie = await Movie.findOne({ id: movieId });
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
            }
            res.status(200).json({ movie });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    
    }
});

router.get('/getMovies/:type', async (req, res) => {
    try {
        const type = req.params.type;

        const typeResponse = await axios.get(`${base_url}/type/${type}`);
        const movieIds = typeResponse.data.movieIds;

        if (!movieIds || movieIds.length === 0) {
            return res.status(404).json({ error: 'No movies found for the specified type' });
        }

        const movies = [];

        for (const movieId of movieIds) {
            const movieResponse = await axios.get(`${base_url}/movie/get/${movieId}`);
            movies.push(movieResponse.data);
        }

        res.status(200).json({
            success: true,
            type: type,
            movies: movies,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;


router.post('/review/:movieId', UserAuth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        const existingReview = user.reviews.find(review => review.movieId.toString() === req.params.movieId);

        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this movie.' });
        }

        const newReview = {
            movieId: req.params.movieId,
            rating: req.body.rating,
            comment: req.body.comment,
        };

        user.reviews.push(newReview);
        await user.save();
        res.status(201).json({ message: 'Review added successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;