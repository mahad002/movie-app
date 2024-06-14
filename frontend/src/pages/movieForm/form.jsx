import { useState,useEffect } from 'react';
// import AuthServices from '../../services/AuthServices';
// import { AuthContext } from '../../Context/AuthContext';
import Message from '../../components/Message';
// import { useNavigate } from 'react-router-dom';
// import DatePicker from 'react-datepicker';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
  // MDBIcon  
} from 'mdb-react-ui-kit';
import axios from 'axios';
import Spinner from '../../components/spinner/spinner';
import './form.css';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_AWS_IMAGE_BASE_URL;

function MovieForm() {
  const [backdropSpinner, setBackdropSpinner] = useState(false);
  const [posterSpinner, setPosterSpinner] = useState(false);
  const [productionSpinner, setProductionSpinner] = useState(false);
  const [movieData, setMovieData] = useState({
    id: null,
    title: '',
    description: '',
    release_date: '',
    backdrop_path: '',
    poster_path: '',
    adult: false,
    genreIds: [],
    original_language: '',
    original_title: '',
    overview: '',
    popularity: null,
    video: false, //I checked the Tmbd Database and every movie has video as false so I'm considering it as false
    vote_average: null,
    vote_count: null,
    belongsToCollection: {}, //
    budget: null,
    genres: [],
    homepage: '',
    imdb_id: '',
    production_companies: [], 
    production_countries: [], //
    revenue: null,
    runtime: null,
    spokenLanguages: [], //
    status: '',
    tagline: '',
    reviews: [] //
  });
  const [genreData, setGenreData] = useState({
    id: '',
    name: ''
  });
  const [production_countriesData, setproduction_countriesData] = useState({
    name: ''
  });
  const [genre_message, setGenreMessage] = useState(null);
  const [company_message, setCompanyMessage] = useState(null);
  const [country_message, setCountryMessage] = useState(null);
  const [newProductionCompany, setNewProductionCompany] = useState({
    id: '',
    name: '',
    logo_path: '',
    origin_country: '',
  });
  const [tempLogo, setTempLogo] = useState('');

  const getImagePath = (path) => {
    const baseTMDBUrl = 'https://image.tmdb.org/t/p/original';
    const placeholderUrl = 'https://via.placeholder.com/300x450';

    if (path?.[0] === '/') {
        // console.log('Path:', `${baseTMDBUrl}${path}`);
        setTempLogo(`${baseTMDBUrl}${path}`);
        return `${baseTMDBUrl}${path}`;
    } else if (/\.(jpg|jpeg|png)$/.test(path)) {
        setTempLogo(`${IMAGE_BASE_URL}${path}`);
        return `${IMAGE_BASE_URL}${path}`;
    } 
    // else {
    //     setTempLogo(placeholderUrl);
    //     return placeholderUrl;
    // }
};
  

  useEffect(()=>{
    // console.log(movieData)
  
  },[movieData])

  const uploadImage = async (ev, pathToUpdate) => {
    
    console.log('Uploading image...');
    if (pathToUpdate === 'backdrop_path') {
      setBackdropSpinner(true);
    } else if (pathToUpdate === 'poster_path') {
      setPosterSpinner(true);
    } else if (pathToUpdate === 'logo_path') {
      setProductionSpinner(true);
    }
    console.log('Uploading image...');
    const file = ev.target?.files[0];
    if (file) {
      const data = new FormData();
      data.append("file", file);
      try {
        const res = await axios.post(`${BASE_URL}/upload/`, data);
        const imageUrl = res.data.links[0].toString();
        // console.log("Image uploaded successfully:", imageUrl);
        const imageName = imageUrl.split('/').pop();
        if(pathToUpdate === 'logo_path'){
          // console.log('Logo uploaded successfully:', imageName)
          setNewProductionCompany(prevData => ({ ...prevData, logo_path: `${imageName}`,})); //${IMAGE_BASE_URL}+${imageUrl}
          getImagePath(imageName);
          // console.log('Temp Logo:', tempLogo);
        } else {
          setMovieData(prevData => ({
            ...prevData,
            [pathToUpdate]: imageName
          }));
        }
        console.log("Image uploaded successfully:", `${IMAGE_BASE_URL}${imageName}`);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        if (pathToUpdate === 'backdrop_path') {
          setBackdropSpinner(false);
        } else if (pathToUpdate === 'poster_path') {
          setPosterSpinner(false);
        } else if (pathToUpdate === 'logo_path') {
          setProductionSpinner(false);
        }
      }
    }
  };

  const removeImage = (imageType) => {
    if (imageType === 'backdrop') {
      setMovieData(prevData => ({ ...prevData, backdrop_path: '' }));
    } else if (imageType === 'poster') {
      setMovieData(prevData => ({ ...prevData, poster_path: '' }));
    } else if (imageType == 'logo_path') {
      setNewProductionCompany(prevData => ({ ...prevData, logo_path: '' }));
      setTempLogo('');
      // console.log('Temp Logo:', tempLogo);
      console.log('Logo removed');
    }
  };

  const handleRemoveGenre = (index) => {
    const updatedGenres = movieData.genres.filter((genre, i) => i !== index);
    setMovieData(prevData => ({
      ...prevData,
      genres: updatedGenres
    }));
  };


  const handleAddGenre = () => {
    if (genreData.id && genreData.name) {
      // Check if ID or name already exists in genres array
      const exists = movieData.genres.some(genre => genre.id === genreData.id || genre.name === genreData.name);
      if (!exists) {
        setMovieData(prevData => ({
          ...prevData,
          genres: [...prevData.genres, { id: genreData.id, name: genreData.name }]
        }));
        setMovieData(prevData => ({
          ...prevData,
          genreIds: [...prevData.genreIds, {id: genreData.id }]
        }));
        setGenreData({ id: '', name: '' });
      } else {
        // Handle error or show message indicating genre already exists
        console.log('Genre with the same ID or name already exists!');
        setGenreMessage('Genre with the same ID or name already exists!');
      }
    }
  };

  const removeproduction_countries = (i) => {
    setMovieData(prevState => {
      if (!Array.isArray(prevState.production_countries)) {
        console.error('production_countries is not an array');
        return prevState;
      }

      if (i < 0 || i >= prevState.production_countries.length) {
        console.error('Index out of bounds');
        return prevState;
      }

      const newproduction_countries = [...prevState.production_countries];
      newproduction_countries.splice(i, 1);

      return {
        ...prevState,
        production_countries: newproduction_countries
      };
    });
  };

  const handleAddproduction_countries = () => {
    if (!production_countriesData.name) {
      setCountryMessage('Production country name cannot be empty');
      console.error('Production country name cannot be empty');
      return;
    }
  
    setMovieData(prevState => ({
      ...prevState,
      production_countries: [...prevState.production_countries, production_countriesData]
    }));
    setCountryMessage('');
    setproduction_countriesData({ name: '' });
  };

  const handleRemoveproduction_countries = (index) => {
    removeproduction_countries(index);
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProductionCompany((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleInputLogo = (e) => {
    const {value} = e.target;
    setNewProductionCompany((prevData) => ({ ...prevData, logo_path: value }));
    getImagePath(value)
  }

  const handleAddProductionCompany = () => {
    console.log(newProductionCompany)
    if (newProductionCompany.name) {
      const exists = movieData.production_companies.some(
        (company) => company.name === newProductionCompany.name
      );
      if (!exists) {
        setMovieData(prevData => ({
          ...prevData,
          production_companies: [...prevData.production_companies, newProductionCompany]
        }));
        console.log('Production Company added successfully:', movieData.production_companies);
        setNewProductionCompany({
          id: '',
          name: '',
          logo_path: '',
          origin_country: '',
        });
        setTempLogo('');
      } else {
        console.log('Production Company with the same name already exists!');
        setCompanyMessage('Production Company with the same name already exists!');
      }
    }
  };

  const removeProduction = (i) => {
    setMovieData(prevState => {
      console.log('Removing production company at index:', i);
      console.log('Production Companies before removal:', movieData.production_companies);
      // Make a shallow copy of the production_companies array
      const newproduction_companies = [...prevState.production_companies];
      // Remove the item at the specified index
      if (i >= 0 && i < newproduction_companies.length) {
        newproduction_companies.splice(i, 1);
      } else {
        console.error('Index out of bounds');
      }
      console.log('Production Companies after removal:', newproduction_companies);
      // Return the new state
      return {
        ...prevState,
        production_companies: newproduction_companies
      };
    });
  };

  const handleRemove = (index) => {
    removeProduction(index);
  };

  const uploadMovieData = async (movieData) => {
    console.log('Uploading movie data:', movieData)
    try {
      const response = await axios.post(`${BASE_URL}/movie/upload`, movieData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        console.log('Movie data uploaded successfully:', response.data);
        movieData = {
          id: null,
          title: '',
          description: '',
          release_date: '',
          backdrop_path: '',
          poster_path: '',
          adult: false,
          genreIds: [],
          original_language: '',
          original_title: '',
          overview: '',
          popularity: null,
          video: false,
          vote_average: null,
          vote_count: null,
          belongsToCollection: {},
          budget: null,
          genres: [],
          homepage: '',
          imdb_id: '',
          production_companies: [],
          production_countries: [],
          revenue: null,
          runtime: null,
          spokenLanguages: [],
          status: '',
          tagline: '',
          reviews: []
        };
      } else {
        console.error('Failed to upload movie data:', response.data);
      }
    } catch (error) {
      console.error('Error uploading movie data:', error);
    }
  };
  
  // Usage: Call this function when the form is submitted
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form...');
    uploadMovieData(movieData);
  };
  

  // const handlerelease_date = (e) => {
  //   setMovieData(prevData => ({ ...prevData, release_date: e.target.value }));
  //   console.log(movieData.release_date)
  // };

  return (
    <MDBContainer fluid className='p-4'>
      <form onSubmit={handleSubmit}>
      <h1 className="my-1 display-3 fw-bold ls-tight px-3 align-items-center">
            The best movie 
            <span className="text-primary"> database in the market!</span>
          </h1>
          <MDBCol md='6'>
          <MDBCard className='card1 my-5'>
            <label className=''></label>
            <MDBCardBody className='p-4'>
              <div className='mt-2'>
                  <div>
                    
                    <MDBRow className=''>
                      <MDBRow className='flex-row '>
                        <MDBCol>
                          <label htmlFor="id" className="block text-sm font-small text-gray-700">
                            <MDBInput
                              wrapperClass='mb-2'
                              label='ID'
                              id='id'
                              type='number'
                              name='id'
                              value={movieData.id}
                              onChange={(e) => setMovieData(prevData => ({ ...prevData, id: e.target.value }))}
                            />
                          </label>
                        </MDBCol>
                        </MDBRow>
                        <MDBCol col='6'>
                          <MDBInput
                            wrapperClass='mb-4'
                            label='Title'
                            id='title'
                            type='text'
                            name='title'
                            value={movieData.title}
                            onChange={(e) => setMovieData(prevData => ({ ...prevData, title: e.target.value }))}
                          />
                        </MDBCol>
                        <MDBCol>
                          {/* <br /> */}
                            <MDBInput
                              label="Release date"
                              icon="calendar-alt"
                              hint="Release date"
                              type="date"
                              value={movieData.release_date}
                              onChange={(e)=>{setMovieData(prevData => ({ ...prevData, release_date: e.target.value }));}}
                              required
                              className="w-1/2 border border-gray-300 rounded-md"
                              data-twe-disabled="true"
                            />
                        </MDBCol>
                      </MDBRow>
                      <MDBCol col='6'>
                          <MDBInput
                            wrapperClass='mb-4'
                            label='Description'
                            id='description'
                            icon= 'pen'
                            type='textarea'
                            name='description'
                            value={movieData.description}
                            onChange={(e) => setMovieData(prevData => ({ ...prevData, description: e.target.value }))}
                          />
                        </MDBCol>
                      <MDBRow className='flex-row'>
                        <MDBCol>
                          <label htmlFor="Adult" className="block text-sm font-small text-gray-700">
                            <MDBCheckbox
                              label= "Adult"
                              name='Adult' 
                              id='Adult' 
                              value={movieData.adult}
                              checked={movieData.adult} 
                              onChange={() => {setMovieData(prevData => ({ ...prevData, adult: !prevData.adult }));}} 
                              className='m-2 mb-0 mt-0' 
                              inline 
                            />
                          </label>
                        </MDBCol>
                        <MDBCol>
                          <label htmlFor="Video" className="w-full text-sm font-small ext-gray-700 mb-0 items-center justify-center align-center">
                            <MDBCheckbox
                              wrapperClass='mb-2 items-center justify-center align-center'
                              label= "Video"
                              id="videoCheckbox"
                              checked={movieData.video}
                              className='m-2 mb-0 mt-0 items-center justify-center align-center' 
                              onChange={() =>
                                setMovieData((prevState) => ({
                                  ...prevState,
                                  video: !prevState.video
                                }))
                              }
                              inline
                            />
                          </label>
                        </MDBCol>
                      </MDBRow>
                      <MDBRow className="flex-row">
                        <MDBCol md="6">
                          <MDBInput
                            wrapperClass='mb-4'
                            label="Original Language"
                            name="original_language"
                            value={movieData.original_language}
                            onChange={(e) => setMovieData(prevData => ({ ...prevData, original_language: e.target.value }))}
                          />
                          <MDBInput
                            wrapperClass='mb-4'
                            label="Original Title"
                            name="original_title"
                            value={movieData.original_title}
                            onChange={(e) => setMovieData(prevData => ({ ...prevData, original_title: e.target.value }))}
                          />
                          <MDBInput
                            wrapperClass='mb-4'
                            label="Overview"
                            type="textarea"
                            name="overview"
                            value={movieData.overview}
                            onChange={(e) => setMovieData(prevData => ({ ...prevData, overview: e.target.value }))}
                          />
                          <MDBInput
                            wrapperClass='mb-4'
                            label="Popularity"
                            type="number"
                            name="popularity"
                            value={movieData.popularity}
                            // onChange={handleChange}
                          />
                        </MDBCol>
                        <MDBCol md="6">
                          <MDBInput
                            wrapperClass='mb-4'
                            label="Revenue"
                            type="number"
                            name="revenue"
                            value={movieData.revenue}
                            onChange={(e) => setMovieData(prevData => ({ ...prevData, revenue: e.target.value }))}
                          />
                          <MDBInput
                            wrapperClass='mb-4'
                            label="Runtime"
                            type="number"
                            name="runtime"
                            value={movieData.runtime}
                            onChange={(e) => setMovieData(prevData => ({ ...prevData, runtime: e.target.value }))}
                          />
                          <MDBInput
                            wrapperClass='mb-4'
                            label="Status"
                            name="status"
                            value={movieData.status}
                            onChange={(e) => setMovieData(prevData => ({ ...prevData, status: e.target.value }))}
                          />
                          <MDBInput
                            wrapperClass='mb-4'
                            label="Tagline"
                            name="tagline"
                            value={movieData.tagline}
                            onChange={(e) => setMovieData(prevData => ({ ...prevData, tagline: e.target.value }))}
                          />
                        </MDBCol>
                      </MDBRow>
                      <MDBRow className='flex-row'>
                        <MDBCol md="6" className='mt-0'>
                          <MDBInput
                            wrapperClass='mb-4'
                            label="Vote Average"
                            type="number"
                            name="vote_average"
                            value={movieData.vote_average}
                            onChange={(e) => setMovieData(prevData => ({ ...prevData, vote_average: e.target.value }))}
                          />
                          <MDBInput
                            wrapperClass='mb-4'
                            label="Vote Count"
                            type="number"
                            name="vote_count"
                            value={movieData.vote_count}
                            onChange={(e) => setMovieData(prevData => ({ ...prevData, vote_count: e.target.value }))}
                          />
                          <MDBInput
                            wrapperClass='mb-4'
                            label="Budget"
                            type="number"
                            name="budget"
                            value={movieData.budget}
                            onChange={(e) => setMovieData(prevData => ({ ...prevData, budget: e.target.value }))}
                          />
                        </MDBCol>
                        <MDBCol md="6">
                          <MDBInput
                            wrapperClass='mb-4'
                            label="Homepage"
                            name="homepage"
                            value={movieData.homepage}
                            onChange={(e) => setMovieData(prevData => ({ ...prevData, homepage: e.target.value }))}
                          />
                          <MDBInput
                            wrapperClass='mb-4'
                            label="IMDB ID"
                            name="imdb_id"
                            value={movieData.imdb_id}
                            onChange={(e) => setMovieData(prevData => ({ ...prevData, imdb_id: e.target.value }))}
                          />
                        </MDBCol>
                      </MDBRow>
                      
                    <div className="image-div">
                        <div>
                          {/* Backdrop Image */}
                          {!!movieData.backdrop_path && (
                            <div className="relative">
                              <div className='image-container'>
                                <button className="remove-button" onClick={() => removeImage('backdrop')}>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 bg-red-600 rounded-lg p-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                  </svg> 
                                </button>
                                <img src={`${IMAGE_BASE_URL}${movieData.backdrop_path}`} className="w-full h-full object-cover" alt="" />
                              </div>
                            </div>
                          )}
                          {/* Backdrop Spinner */}
                          {backdropSpinner && (
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
                            <input id="upload-backdrop-input" type="file" onChange={(ev) => uploadImage(ev, 'backdrop_path')} className="custom-file-input" />
                          </label>
                      </div>
                      <div>
                        {/* Poster Image */}
                        {!!movieData.poster_path && (
                          <div className="relative">
                            <div className='image-container'>
                              <button className="remove-button" onClick={() => removeImage('poster')}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 bg-red-600 rounded-lg p-1">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg> 
                              </button>
                              <img src={`${IMAGE_BASE_URL}${movieData.poster_path}`} className="w-full h-full object-cover" alt="" />
                            </div>
                          </div>
                        )}
                        {/* Poster Spinner */}
                        {posterSpinner && (
                          <div className="spinner-container bg-gray-100 flex items-center rounded-lg">
                            <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-gray-900">
                              <Spinner />
                            </div>
                          </div>
                        )}
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
                          <input id="upload-poster-input" type="file" onChange={(ev) => uploadImage(ev, 'poster_path')} className="custom-file-input" />
                        </label>
                      </div>
                    </div>
                    <MDBRow className="mt-4">
                    <MDBCol>
                      <h5 className='text-black'>Genres</h5>
                      <div className="genre-list">
                        {movieData.genres.map((genre, index) => (
                          <div key={index} className="genre-item text-black d-flex align-items-center">
                            <span className="genre-id me-2">ID: {genre.id}</span>
                            <span className="genre-name me-2">Name: {genre.name}</span>
                            <button className="btn btn-danger remove-genre-btn" onClick={() => handleRemoveGenre(index)}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="d-flex align-items-center mt-2">
                        <MDBInput
                          label="ID"
                          type="text"
                          value={genreData.id}
                          onChange={(e) => setGenreData(prevData => ({ ...prevData, id: e.target.value }))}
                          className="me-2 genre-input-id"
                        />
                        <MDBInput
                          label="Name"
                          type="text"
                          value={genreData.name}
                          onChange={(e) => setGenreData(prevData => ({ ...prevData, name: e.target.value }))}
                          className="me-2 genre-input-name"
                        />
                        <div className='d-flex justify-content-end'>
                          <MDBBtn className="genre-button" size='md' color="primary" onClick={handleAddGenre}>Add Genre</MDBBtn>
                        </div>
                      </div>
                    </MDBCol>
                  </MDBRow>
                    <div>{genre_message && 
                      <div className='genre-message mt-2'>
                        <Message message={genre_message} />
                      </div> }
                      </div>
                      <MDBRow className="mt-4">
                        <MDBCol>
                          <h5 className='text-black'>Production Countries</h5>
                          <div className="genre-list">
                            {movieData.production_countries.map((country, index) => (
                              <div key={index} className="genre-item text-black d-flex align-items-center">
                                <span className="genre-name me-2">Name: {country.name}</span>
                                <button className="btn btn-danger remove-genre-btn" onClick={() => handleRemoveproduction_countries(index)}>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="d-flex align-items-center mt-2 justify-space-evenly">
                            <MDBInput
                              label="Name"
                              type="text"
                              value={production_countriesData.name}
                              onChange={(e) => setproduction_countriesData({ name: e.target.value })}
                              className="me-2 genre-input-name"
                            />
                          </div>
                          <div className='d-flex justify-content-end mt-5'>
                            <MDBBtn className="genre-button" size='md' color="primary" onClick={handleAddproduction_countries}>Add</MDBBtn>
                          </div>
                        </MDBCol>
                      </MDBRow>
                    <div>{country_message && 
                      <div className='company-message mt-2'>
                        <Message message={country_message} />
                      </div> }
                     </div>
                     <div className='rounded-lg bg-blue-400'>
                      <MDBCol>
                      <MDBRow className="mt-4">
                        <MDBCol>
                          <h5 className='text-black'>Production Companies</h5>
                          <div className="genre-list">
                            {movieData.production_companies?.map((company, index) => (
                              <div key={index} className="genre-item text-black d-flex align-items-center">
                                <span className="genre-id me-2">ID: {company.id}</span>
                                <span className="genre-name me-2">Name: {company.name}</span>
                                <span className="genre-name me-2">Origin Country: {company.origin_country}</span>
                                <img src={tempLogo} alt={company.name} className="me-2" style={{ width: '50px', height: '50px' }} />
                                <button className="btn btn-danger remove-genre-btn" onClick={() => handleRemove(index)}>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className=" align-items-center mt-1">
                            <MDBInput
                              label="ID"
                              type="text"
                              name="id"
                              value={newProductionCompany.id}
                              onChange={handleInputChange}
                              className="me-2 genre-input-name"
                            />
                            <MDBInput
                              label="Name"
                              type="text"
                              name="name"
                              value={newProductionCompany.name}
                              onChange={handleInputChange}
                              className="me-2 genre-input-name"
                            />
                            <MDBInput
                              label="Logo Path"
                              type="text"
                              name="logo_path"
                              value={newProductionCompany.logo_path}
                              onChange={handleInputLogo}
                              className="me-2 genre-input-name"
                            />
                            <MDBInput
                              label="Origin Country"
                              type="text"
                              name="origin_country"
                              value={newProductionCompany.origin_country}
                              onChange={handleInputChange}
                              className="me-2 genre-input-name"
                            />
                          </div>
                          
                        
                          {company_message && 
                            <div className='company-message mt-2'>
                              <p>{company_message}</p>
                            </div>
                          }
                        </MDBCol>
                      </MDBRow>
                      </MDBCol>
                      <div className="image-div">
                          <div>
                              {/* Production Logo Image */}
                              {!!newProductionCompany.logo_path && (
                                <div className="relative">
                                  <div className='image-container'>
                                    <button className="remove-button" onClick={() => removeImage('logo_path')}>
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 bg-red-600 rounded-lg p-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                      </svg> 
                                    </button>
                                    <img src={`${tempLogo}`} className="w-full h-full object-cover" alt="" />
                                  </div>
                                </div>
                              )}
                              {/* Production Spinner */}
                              {productionSpinner && (
                                    <div className="spinner-container bg-gray-100 flex items-center rounded-lg">
                                      <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-gray-900">
                                        <Spinner />
                                      </div>
                                    </div>
                                  )}
                              
                              {/* Upload Buttons */}
                              <label className="custom-label relative" htmlFor="upload-logo-input">
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
                                <div className="add-text">Add Production Logo</div>
                                <input id="upload-logo-input" type="file" onChange={(ev) => uploadImage(ev, 'logo_path')} className="custom-file-input" />
                              </label>
                              </div>
                          </div>
                          <div className='d-flex justify-content-end mt-5'>
                            <MDBBtn className="genre-button" size='md' color="primary" onClick={handleAddProductionCompany}>Add</MDBBtn>
                          </div>
                     </div>
                    <div className='d-flex justify-content-end'>
                      <MDBBtn className='w-30 mb-4 mt-2' size='md' type='submit' >
                        Add Movie
                      </MDBBtn>
                    </div>
                  </div>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </form>
  </MDBContainer>
  );
}


export default MovieForm;
