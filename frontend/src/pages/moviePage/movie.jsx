import { useEffect, useState } from "react";
import "./movie.css";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import ReviewBox from '../../components/movieReview/reviewBox';

const base_url = import.meta.env.VITE_BASE_URL;
const aws_image_base_url = import.meta.env.VITE_AWS_IMAGE_BASE_URL;

const getImagePath = (path) => {
    const baseTMDBUrl = 'https://image.tmdb.org/t/p/original';
    const placeholderUrl = 'https://via.placeholder.com/300x450';

    if (path?.[0] === '/') {
        return `${baseTMDBUrl}${path}`;
    } else if (/\.(jpg|jpeg|png)$/.test(path)) {
        return `${aws_image_base_url}${path}`;
    } else {
        return placeholderUrl;
    }
};

const Movie = () => {
    const [currentMovieDetail, setMovie] = useState();
    const { id } = useParams();
    const [trailer, setTrailer] = useState();

    useEffect(() => {
        getData();
        getTrailer();
        window.scrollTo(0, 0);
    }, []);

    const getData = () => {
        axios.get(`${base_url}/movie/${id}`)
            .then(res => {
                const movie = res.data.movie;
                
                console.log(movie);
                setMovie({
                    ...movie,
                    poster_path: getImagePath(movie.poster_path),
                    backdrop_path: getImagePath(movie.backdrop_path),
                    production_companies: movie.production_companies.map(company => ({
                        ...company,
                        logo_path: getImagePath(company.logo_path)
                    }))
                });
                console.log(currentMovieDetail.production_companies[0].logo_path);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const getTrailer = () => {
        axios.get(`${base_url}/movie/trailer/${id}`)
             .then((response) => response.data)
             .then((data) => {
                setTrailer(data);
             });
    };

    return (
        <div className="movie">
            <div className="movie__intro">
                <img className="movie__backdrop" src={currentMovieDetail?.backdrop_path || ""} alt="Backdrop" />
            </div>
            <div className="movie__detail">
                <div className="movie__detailLeft">
                    <div className="movie__posterBox">
                        <img className="movie__poster" src={currentMovieDetail?.poster_path || ""} alt="Poster" />
                    </div>
                </div>
                <div className="movie__detailRight">
                    <div className="movie__detailRightTop">
                        <div className="movie__name">{currentMovieDetail?.original_title || ""}</div>
                        <div className="movie__tagline">{currentMovieDetail?.tagline || ""}</div>
                        <div className="movie__rating">
                            {currentMovieDetail ? parseFloat(currentMovieDetail.vote_average.toFixed(1)) : ""} 
                            <FontAwesomeIcon icon={faStar} />{" "}
                            <span className="movie__voteCount">{currentMovieDetail ? `(${currentMovieDetail.vote_count} votes)` : ""}</span>
                        </div>
                        <div className="movie__runtime">{currentMovieDetail ? `${currentMovieDetail.runtime} mins` : ""}</div>
                        <div className="movie__releaseDate">{currentMovieDetail ? `Release date: ${currentMovieDetail.release_date}` : ""}</div>
                        <div className="movie__genres">
                            {
                                currentMovieDetail?.genres?.map(genre => (
                                    <span key={genre.id} className="movie__genre">{genre.name}</span>
                                )) || ""
                            }
                        </div>
                    </div>
                    <div className="movie__detailRightBottom">
                        <div className="synopsisText_Heading">Overview</div>
                        <div className="synopsisText">{currentMovieDetail?.overview || ""}</div>
                    </div>
                </div>
            </div>
            <div className="movie__links">
                <div className="movie__heading">Trailer &amp; Information</div>
                {
                    trailer && <iframe className="yt_vid" src={`${trailer.yt_trailer_vid}`} title="Trailer" />
                }
                <div className="movie_links">
                    {
                        currentMovieDetail?.homepage && 
                        <a href={currentMovieDetail.homepage} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                            <p><span className="movie__homeButton movie__Button">Watch Now</span></p>
                        </a>
                    }
                    {
                        trailer && currentMovieDetail?.imdb_id && 
                        <a href={`https://www.imdb.com/title/${currentMovieDetail.imdb_id}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                            <p><span className="movie__imdbButton movie__Button">IMDb</span></p>
                        </a>
                    }
                </div>
            </div>
            <div className="movie__heading"> Reviews</div>
            <div className="movie_review_box">
                <ReviewBox id={id} />
            </div>
            <div className="movie__heading">Production companies</div>
            <div className="movie__production">
                {
                    currentMovieDetail?.production_companies?.map(company => (
                        company.logo_path && (
                            <span key={company.id} className="productionCompanyImage">
                                <img className="movie__productionCompany" src={company.logo_path} alt={company.name} />
                                <span className="movie__productionCompanyHeading">{company.name}</span>
                            </span>
                        )
                    )) || ""
                }
            </div>
        </div>
    );
};

export default Movie;
