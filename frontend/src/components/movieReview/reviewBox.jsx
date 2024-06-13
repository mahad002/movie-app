import './reviewBox.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useCookies } from 'react-cookie';

// eslint-disable-next-line react/prop-types
const ReviewBox = ({ id }) => {
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState(null);
    const [showFullText, setShowFullText] = useState([]);
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState('');
    const [cookies] = useCookies(['userToken']);
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    // State for edit modal
    const [editRating, setEditRating] = useState('');
    const [editComment, setEditComment] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Function to toggle show/hide full text in reviews
    const toggleShowFullText = (index) => {
        const updatedShowFullText = [...showFullText];
        updatedShowFullText[index] = !updatedShowFullText[index];
        setShowFullText(updatedShowFullText);
    };

    // Function to handle "See more" button click
    const handleSeeMore = (index) => {
        toggleShowFullText(index);
    };

    // Function to handle "See less" button click
    const handleSeeLess = (index) => {
        toggleShowFullText(index);
    };

    // Function to fetch reviews from API
    const getData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/review/movie/${id}`);
            const data = response.data;

            // Process reviews data
            const updatedReviews = data.results.map(review => {
                let avatarPath = review?.authorDetails?.avatarPath;
                if (!avatarPath?.startsWith('https')) {
                    avatarPath = `https://image.tmdb.org/t/p/original${avatarPath}`;
                }

                const updatedAuthorDetails = {
                    ...review?.authorDetails,
                    avatar_path: avatarPath,
                };

                return {
                    ...review,
                    authorDetails: updatedAuthorDetails,
                };
            });

            setReviews(updatedReviews);
            setShowFullText(updatedReviews.map(() => false));

            // Check if the current user has already reviewed this movie
            const currentUserReview = data?.results?.find(review => review?.author === cookies?.userInfo?.username);
            setUserReview(currentUserReview);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Function to handle review submission (both add and update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const reviewData = {
                rating: parseInt(rating),
                comment: comment
            };

            let endpoint = `${BASE_URL}/movie/review/${id}`;

            // if (userReview) {
            //     endpoint = `${BASE_URL}/review/${userReview._id}`;
            // }

            const res = await axios.post(
                endpoint,
                reviewData,
                {
                    headers: {
                        Authorization: `Bearer ${cookies.userToken}`
                    }
                }
            );

            setMessage(res.data.message);
            setRating('');
            setComment('');
            getData();
        } catch (error) {
            console.error('Error submitting review:', error);
            setMessage(error.response?.data?.error || 'Something went wrong.');
        }
    };

    // Function to fetch review details for editing
    const fetchReviewDetails = async (reviewId) => {
        try {
            const response = await axios.get(`${BASE_URL}/review/${reviewId}`);
            const reviewToEdit = response.data;
            setEditRating(reviewToEdit.rating.toString());
            setEditComment(reviewToEdit.comment);
            setIsEditModalOpen(true);
        } catch (error) {
            console.error('Error fetching review details:', error);
        }
    };

    // Function to handle edit submission
    const handleSubmitEdit = async (e) => {
        console.log('Submitting edit...');
        e.preventDefault();
        try {
            const reviewData = {
                review: {
                    content: editComment,
                    authDetails: {
                        rating: parseInt(editRating)
                    }
                }
            };
            

            const res = await axios.patch(
                `${BASE_URL}/review/${userReview._id}`,
                reviewData,
                {
                    headers: {
                        Authorization: `Bearer ${cookies.userToken}`
                    }
                }
            );

            setMessage(res.data.message);
            setIsEditModalOpen(false);
            getData();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Error updating review:', error);
            setMessage(error.response?.data?.message || 'Something went wrong.');
        }
    };

    // Function to handle edit button click
    const handleEdit = (reviewId) => {
        if(isEditModalOpen) {
            setIsEditModalOpen(false);
        } else {
            setIsEditModalOpen(true);
        }
        fetchReviewDetails(reviewId);
    };

    // Function to handle delete button click
    const handleDelete = async (reviewId) => {
        try {
            const res = await axios.delete(
                `${BASE_URL}/review/${reviewId}`,
                {
                    body: { reviewId, movieId: id, userId: cookies.userInfo._id },
                    headers: {
                        Authorization: `Bearer ${cookies.userToken}`
                    }
                }
            );

            setMessage(res.data.message);
            getData();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Error deleting review:', error);
            setMessage(error.response?.data?.error || 'Something went wrong.');
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className='reviewBox'>
            {/* Add/Edit Review Section */}
            <div className='addReviewBox'>
                <h3>Add Your Review</h3>
                {message && <p>{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Rating:</label>
                        <input 
                            type="number" 
                            value={rating} 
                            onChange={(e) => setRating(e.target.value)} 
                            min="1" 
                            max="10" 
                            required 
                        />
                    </div>
                    <div>
                        <label>Comment:</label>
                        <textarea 
                            value={comment} 
                            onChange={(e) => setComment(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="button-container">
                        <button type="submit">Submit Review</button>
                    </div>
                </form>
            </div>

            {/* Reviews List Section */}
            <div className='list1'>
                {reviews.map((review, index) => (
                    <div key={review._id} className='comment'>
                        <img
                            src={`${review.authorDetails.avatar_path}`}
                            alt='User Avatar'
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png';
                            }}
                        />
                        <div>
                            <h3>{review?.author}</h3>
                            {showFullText[index] || review?.content?.length <= 1000 ? (
                                <p>{review?.content}</p>
                            ) : (
                                <div>
                                    <p>{review?.content?.substring(0, 1000)}...</p>
                                    <button className='btnML btnM' onClick={() => handleSeeMore(index)}>
                                        See more <FaChevronDown />
                                    </button>
                                </div>
                            )}
                            {showFullText[index] && (
                                <button className='btnML btnL' onClick={() => handleSeeLess(index)}>
                                    See less <FaChevronUp />
                                </button>
                            )}
                            {review.author === cookies.userInfo.username && (
                                <div>
                                    <button className='btnML btnEdit' onClick={() => handleEdit(review._id)}>
                                        Edit
                                    </button>
                                    <button className='btnML btnDelete' onClick={() => handleDelete(review._id)}>
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="addReviewBox">
                    <h3>Edit Your Review</h3>
                    <form onSubmit={handleSubmitEdit}>
                        <div>
                            <label>Rating:</label>
                            <input 
                                type="number" 
                                value={editRating} 
                                onChange={(e) => setEditRating(e.target.value)} 
                                min="1" 
                                max="10" 
                                required 
                                className="rating-input"  // Using the same class as the Add Review section
                            />
                        </div>
                        <div>
                            <label>Comment:</label>
                            <textarea 
                                value={editComment} 
                                onChange={(e) => setEditComment(e.target.value)} 
                                required 
                                className="comment-textarea"  // Using the same class as the Add Review section
                            />
                        </div>
                        <div className="button-container">
                            <button type="submit" className="submit-button">Update Review</button>
                            <button type="button" onClick={() => setIsEditModalOpen(false)} className="cancel-button">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

        </div>
    );
};

export default ReviewBox;
