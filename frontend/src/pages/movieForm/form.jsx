import { useState,useRef,useEffect,useContext } from 'react';
import AuthServices from '../../services/AuthServices';
import { AuthContext } from '../../Context/AuthContext';
import Message from '../../components/Message';
import { useNavigate } from 'react-router-dom';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  // MDBCheckbox,
  // MDBIcon  
} from 'mdb-react-ui-kit';
import axios from 'axios';
import Spinner from '../../components/spinner/spinner';
import './form.css';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_AWS_IMAGE_BASE_URL;

function MovieForm() {
  const [spinner, setSpinner] = useState(false);
  const [movieData, setMovieData] = useState({
    title: '',
    description: '',
    releaseDate: '',
    genre: '',
    backdropPath: '',
    posterPath: '',
    adult: false,
    genreIds: [],
    originalLanguage: '',
    originalTitle: '',
    overview: '',
    popularity: 0,
    video: false,
    voteAverage: 0,
    voteCount: 0,
    belongsToCollection: {},
    budget: 0,
    genres: [],
    homepage: '',
    imdbId: '',
    productionCompanies: [],
    productionCountries: [],
    revenue: 0,
    runtime: 0,
    spokenLanguages: [],
    status: '',
    tagline: '',
    reviews: []
  });

  const uploadImage = async (ev, pathToUpdate) => {
    setSpinner(true);
    const file = ev.target?.files[0];
    if (file) {
      const data = new FormData();
      data.append("file", file);
      try {
        const res = await axios.post(`${BASE_URL}/upload/`, data);
        const imageUrl = res.data.links[0].toString();
        console.log("Image uploaded successfully:", imageUrl);
        const imageName = imageUrl.split('/').pop();
        setMovieData(prevData => ({
          ...prevData,
          [pathToUpdate]: imageName
        }));
        console.log("Image uploaded successfully:", `${IMAGE_BASE_URL}+${imageUrl}`);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setSpinner(false);
      }
    }
  };

  const removeImage = (imageType) => {
    if (imageType === 'backdrop') {
      setMovieData(prevData => ({ ...prevData, backdropPath: '' }));
    } else if (imageType === 'poster') {
      setMovieData(prevData => ({ ...prevData, posterPath: '' }));
    }
  };

  return (
    <div className="image-div mb-2">
  {/* Backdrop Image */}
  {!!movieData.backdropPath && (
    <div className="relative">
      <div className='image-container'>
        <button className="remove-button" onClick={() => removeImage('backdrop')}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 bg-red-600 rounded-lg p-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg> 
        </button>
        <img src={`${IMAGE_BASE_URL}${movieData.backdropPath}`} className="w-full h-full object-cover" alt="" />
      </div>
    </div>
  )}
  {/* Poster Image */}
  {!!movieData.posterPath && (
    <div className="relative">
      <div className='image-container'>
        <button className="remove-button" onClick={() => removeImage('poster')}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 bg-red-600 rounded-lg p-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg> 
        </button>
        <img src={`${IMAGE_BASE_URL}${movieData.posterPath}`} className="w-full h-full object-cover" alt="" />
      </div>
    </div>
  )}
  {/* Spinner */}
  {spinner && (
    <div className="spinner-container bg-gray-100 flex items-center rounded-lg">
      <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-gray-900">
        <Spinner />
      </div>
    </div>
  )}
  {/* Upload Buttons */}
  <label className="custom-label relative" htmlFor="upload-backdrop-input">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
      />
    </svg>
    <div className="add-text">Add Backdrop</div>
    <input id="upload-backdrop-input" type="file" onChange={(ev) => uploadImage(ev, 'backdropPath')} className="custom-file-input" />
  </label>
  <label className="custom-label relative" htmlFor="upload-poster-input">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
      />
    </svg>
    <div className="add-text">Add Poster</div>
    <input id="upload-poster-input" type="file" onChange={(ev) => uploadImage(ev, 'posterPath')} className="custom-file-input" />
  </label>
</div>

  );
}


export default MovieForm;
