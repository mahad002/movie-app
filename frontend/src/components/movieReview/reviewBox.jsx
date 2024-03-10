import './reviewBox.css';
import {useEffect, useState} from 'react';
// import {useParams} from "react-router-dom";
import axios from 'axios';

const ReviewBox = ({id}) => {
    const [reviews, setReviews] = useState([]);
    const tmdb_api_key = import.meta.env.VITE_TMDB_API_KEY; 
    const [page, setPage] = useState(1);

    const getData = async () => {
        try {
            console.log(id);
            console.log(page);
            console.log(tmdb_api_key);     
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${tmdb_api_key}&language=en-US&page=${page}&include_adult=false`);
            // const response = await axios.get(`https://api.themoviedb.org/3/movie/609681/reviews?api_key=efc256c9adceef829bd13d736d429b8c&language=en-US`);
            const data = response.data;
            console.log(data);
            setReviews(data.results);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };    

    useEffect(() => {
        getData();
        setPage(1);
    },[]);

    return (
        <div className='reviewBox'>
            {/* <h2 className='title'>Reviews</h2> */}
            <div className='list1'>
                {reviews.map((review) => (
                    <div key={review.id} className='review'>
                        <div className='review_userBox'>
                            <img
                                className='review_avatar'
                                src={`https://image.tmdb.org/t/p/original${review.author_details.avatar_path}`}
                                alt='User Avatar'
                                onError={(e) => {
                                    e.target.onerror = null; // Avoid infinite loop in case the alternative image also fails to load
                                    e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png';
                                }}
                            />
                            <div className='review_author'>{review.author}</div>
                        </div>
                        <div className='review_content'>{review.content}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ReviewBox;