import {useEffect, useState} from "react"
import "./movie.css"
import { useParams } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import ReviewBox from '../../components/movieReview/reviewBox';

// const tmdb_api_key = import.meta.env.VITE_TMDB_API_KEY;  
const base_url = import.meta.env.VITE_BASE_URL;

const Movie = () => {
    const [currentMovieDetail, setMovie] = useState();
    const { id } = useParams();
    const [trailer, setTrailer] = useState();

    useEffect(() => {
        getData();
        console.log(currentMovieDetail)
        getTrailer();
        window.scrollTo(0,0);
    }, [])

    const getData = () => {
        axios.get(`${base_url}/movie/${id}`)
            .then(res => {
                setMovie(res.data.movie);
                // console.log(currentMovieDetail);
            })
            .catch(error => {
                console.message(error);
            });
    }

    const getTrailer = () => {
        axios.get(`${base_url}/movie/trailer/${id}`)
             .then((response) => response.data)
             .then((data) => {
                    setTrailer(data);
                    console.log(data);
                })
    }

    return (
        <div className="movie">
            <div className="movie__intro">
                <img className="movie__backdrop" src={`https://image.tmdb.org/t/p/original${currentMovieDetail ? currentMovieDetail.backdrop_path : ""}`} />
            </div>
            <div className="movie__detail">
                <div className="movie__detailLeft">
                    <div className="movie__posterBox">
                        <img className="movie__poster" src={`https://image.tmdb.org/t/p/original${currentMovieDetail ? currentMovieDetail.poster_path : ""}`} />
                    </div>
                </div>
                <div className="movie__detailRight">
                    <div className="movie__detailRightTop">
                        <div className="movie__name">{currentMovieDetail ? currentMovieDetail.original_title : ""}</div>
                        <div className="movie__tagline">{currentMovieDetail ? currentMovieDetail.tagline : ""}</div>
                        <div className="movie__rating">
                            {currentMovieDetail ? parseFloat(currentMovieDetail.vote_average.toFixed(1)): ""} <FontAwesomeIcon icon={faStar} />{" "}
                            <span className="movie__voteCount">{currentMovieDetail ? "(" + currentMovieDetail.vote_count + ") votes" : ""}</span>
                        </div>  
                        <div className="movie__runtime">{currentMovieDetail ? currentMovieDetail.runtime + " mins" : ""}</div>
                        <div className="movie__releaseDate">{currentMovieDetail ? "Release date: " + currentMovieDetail.release_date : ""}</div>
                        <div className="movie__genres">
                            {
                                currentMovieDetail && currentMovieDetail.genres
                                ? 
                                currentMovieDetail.genres.map(genre => (
                                    <><span className="movie__genre" id={genre.id}>{genre.name}</span></>
                                )) 
                                : 
                                ""
                            }
                        </div>
                    </div>
                    <div className="movie__detailRightBottom">
                        <div className="synopsisText_Heading">Overview</div>
                        <div className="synopsisText">{currentMovieDetail ? currentMovieDetail.overview : ""}</div>
                    </div>
                    
                </div>
            </div>
            <div className="movie__links">
                <div className="movie__heading">Trailer & <br/>Information</div>
                {
                    trailer && <iframe className="yt_vid" src={`${trailer.yt_trailer_vid}`}/>
                }
                {<div className="movie_links">
                    {
                        currentMovieDetail && currentMovieDetail.homepage && <a href={currentMovieDetail.homepage} target="_blank" style={{textDecoration: "none"}}><p>
                        <span className="movie__homeButton movie__Button">
                            Watch Now
                                {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-1 h-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                                </svg> */}
                        </span></p></a>
                    }
                    {
                        trailer && currentMovieDetail && currentMovieDetail.imdb_id && <a href={"https://www.imdb.com/title/" + currentMovieDetail.imdb_id} target="_blank" style={{textDecoration: "none"}}><p><span className="movie__imdbButton movie__Button">IMDb</span></p></a>
                    }
                </div>
                }
            </div>
            <div className="movie__heading"> Reviews</div>
                <div className="movie_review_box">
                    <ReviewBox id={id}></ReviewBox>
                </div>
            <div className="movie__heading">Production companies</div>
            <div className="movie__production">
                {
                    currentMovieDetail && currentMovieDetail.production_companies && currentMovieDetail.production_companies.map(company => (
                        <>
                            {
                                company.logo_path 
                                && 
                                <span className="productionCompanyImage">
                                    <img className="movie__productionCompany" src={"https://image.tmdb.org/t/p/original" + company.logo_path} />
                                    <span className="movie__productionCompanyHeading">{company.name}</span>
                                </span>
                            }
                        </>
                    ))
                }
            </div>
        </div>
    )
}

export default Movie