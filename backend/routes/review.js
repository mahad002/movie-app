// Assuming you are using Express.js
const express = require('express');
const router = express.Router();
const Review = require('../models/review'); 
const Movie = require('../models/movie'); 
const User = require('../models/user');
const getReviewById = require('../middlewares/GetReviewById'); 
const { parse } = require('dotenv');
const { ObjectId } = require('mongoose').Types;

// Endpoint to get all reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint to get reviews by movie ID
router.get('/movie/:movieId', async (req, res) => {
    try {
        const movieId = req.params.movieId;

        // Find the movie by its ID and populate the 'reviews' field
        const movie = await Movie.findOne({ id: movieId });

        // console.log(movie.reviews);

        let reviews = [];

        for (let i = 0; i < movie.reviews.length; i++) {
            const review = await Review.findById(movie.reviews[i]);
            reviews[i] = review;
        }

        // console.log(reviews);

        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        let movieWithReviews = {
            movie,
            results: reviews
        };

        res.json(movieWithReviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to get a specific review by ID
router.get('/:id', getReviewById, (req, res) => {
    res.json(res.review);
});

// Endpoint to create a new review
router.post('/', async (req, res) => {
    const review = new Review({
        author: req.body.author,
        authorDetails: req.body.authorDetails,
        content: req.body.content,
        url: req.body.url,
    });

    try {
        const newReview = await review.save();
        res.status(201).json(newReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Middleware function to get a review by ID
async function getReview(req, res, next) {
    let review;
    try {
        review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

    res.review = review;
    next();
}

// Endpoint to update a review by ID
router.patch('/:id', getReview, async (req, res) => {
    const { content, authorDetails } = req.body.review;
    console.log('Updating review:', res.review);
    if (content) {
        res.review.content = content;
    }

    if (authorDetails && authorDetails.rating) {
        res.review.authorDetails.rating = authorDetails.rating;
    }

    try {
        const updatedReview = await res.review.save();
        res.json(updatedReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Endpoint to delete a review by ID
router.delete('/:id', async (req, res) => {
    const reviewId = req.params.id;
    let { userId, movieId } = req.query; // Use query instead of body
    // userId = new ObjectId(userId);
    console.log('userId:', userId);
    movieId = Number(movieId);
    console.log('Deleting review:', reviewId);

    try {
        console.log('Im here!');
        // Fetch the user and remove the review from their reviews array
        const user = await User.findById(userId);
        if (user) {
            console.log('user:', user.reviews);
            user.reviews.pull(reviewId);
            await user.save();
            console.log('Updated user:', user.reviews);
        } else {
            console.log('User not found');
        }

        // Fetch the movie and remove the review from their reviews array
        const movie = await Movie.findOne({id: movieId});
        // console.log('movie:', movie);
        if (movie) {
            console.log('movie:', movie.reviews);
            movie.reviews.pull(reviewId);
            await movie.save();
            console.log('Updated movie:', movie.reviews);
        } else {
            console.log('Movie not found');
        }

        // Delete the review
        const review = await Review.findByIdAndDelete(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // console.log('Deleted review:', review);
        res.json({ message: 'Review deleted' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
