import { useState,useRef,useEffect,useContext } from 'react';
import AuthServices from '../../services/AuthServices';
import { AuthContext } from '../../Context/AuthContext';
import Message from '../../components/Message';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
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
  const [movieData, setMovieData] = useState({
    title: '',
    description: '',
    releaseDate: '',
    backdropPath: '',
    posterPath: '',
    adult: false,
    genreIds: [],
    originalLanguage: '',
    originalTitle: '',
    overview: '',
    popularity: null,
    video: false, //I checked the Tmbd Database and every movie has video as false so I'm considering it as false
    voteAverage: null,
    voteCount: null,
    belongsToCollection: {}, //
    budget: null,
    genres: [],
    homepage: '',
    imdbId: '',
    productionCompanies: [], // 
    productionCountries: [], //
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
  const [productionCountriesData, setProductionCountriesData] = useState({
    name: ''
  });
  const [genre_message, setGenreMessage] = useState(null);
  const [company_message, setCompanyMessage] = useState(null);
  const [country_message, setCountryMessage] = useState(null);

  useEffect(()=>{
    console.log(movieData)
  
  },[movieData])

  const uploadImage = async (ev, pathToUpdate) => {
    if (pathToUpdate === 'backdropPath') {
      setBackdropSpinner(true);
    } else if (pathToUpdate === 'posterPath') {
      setPosterSpinner(true);
    }

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
        if (pathToUpdate === 'backdropPath') {
          setBackdropSpinner(false);
        } else if (pathToUpdate === 'posterPath') {
          setPosterSpinner(false);
        }
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

  const handleRemoveGenre = (index) => {
    const updatedGenres = movieData.genres.filter((genre, i) => i !== index);
    setMovieData(prevData => ({
      ...prevData,
      genres: updatedGenres
    }));
  };

  const handleRemoveProductionCountries = (index) => {
    const updatedProductionCompanies = movieData.productionCountries.filter((genre, i) => i !== index);
    setMovieData(prevData => ({
      ...prevData,
      productionCompanies: updatedProductionCompanies
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

  const handleAddProductionCountries = () => {
    if (productionCountriesData.name) {
      // Check if ID or name already exists in genres array
      const exists = movieData.productionCountries.some(productionCountries => productionCountries.name === productionCountriesData.name);
      if (!exists) {
        setMovieData(prevData => ({
          ...prevData,
          productionCountries: [...prevData.productionCountries, { name: productionCountriesData.name }]
        }));
        setProductionCountriesData({ name: '' });
      } else {
        // Handle error or show message indicating already exists
        console.log('Production Country with the same name already exists!');
        setGenreMessage('Production Country with the same name already exists!');
      }
    }
  };
  

  // const handleReleaseDate = (e) => {
  //   setMovieData(prevData => ({ ...prevData, releaseDate: e.target.value }));
  //   console.log(movieData.releaseDate)
  // };

  return (
    <MDBContainer fluid className='p-4'>
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
                    <MDBRow className='mt-4'>
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
                              value={movieData.releaseDate}
                              onChange={(e)=>{setMovieData(prevData => ({ ...prevData, releaseDate: e.target.value }));}}
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
                      {/* <MDBRow className=''>
                        <MDBCol>
                          <MDBInput
                            selected={movieData.releaseDate}
                            wrapperClass=''
                            label='Genre'
                            id='genre'
                            type='text'
                            name='genre'
                            value={movieData.genre}
                            onChange={(e) => setMovieData(prevData => ({ ...prevData, genre: e.target.value }))}
                          />
                        </MDBCol>
                      </MDBRow> */}
                      <MDBRow className='flex-row'>
                        <MDBCol>
                          <label htmlFor="Adult" className="block text-sm font-small text-gray-700">
                            <MDBCheckbox
                              label= "Adult"
                              name='Adult' 
                              id='Adult' 
                              value={movieData.adult}
                              checked={movieData.adult} 
                              onChange={() => {setMovieData(prevData => ({ ...prevData, adult: !prevData.adult })); console.log(movieData.adult)}} 
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
                            name="originalLanguage"
                            value={movieData.originalLanguage}
                            onChange={(e) => setMovieData(prevData => ({ ...prevData, originalLanguage: e.target.value }))}
                          />
                          <MDBInput
                            wrapperClass='mb-4'
                            label="Original Title"
                            name="originalTitle"
                            value={movieData.originalTitle}
                            onChange={(e) => setMovieData(prevData => ({ ...prevData, originalTitle: e.target.value }))}
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
                            name="voteAverage"
                            value={movieData.voteAverage}
                            onChange={(e) => setMovieData(prevData => ({ ...prevData, voteAverage: e.target.value }))}
                          />
                          <MDBInput
                            wrapperClass='mb-4'
                            label="Vote Count"
                            type="number"
                            name="voteCount"
                            value={movieData.voteCount}
                            onChange={(e) => setMovieData(prevData => ({ ...prevData, voteCount: e.target.value }))}
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
                            name="imdbId"
                            value={movieData.imdbId}
                            onChange={(e) => setMovieData(prevData => ({ ...prevData, imdbId: e.target.value }))}
                          />
                        </MDBCol>
                      </MDBRow>
                    <div className="image-div">
                        <div>
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
                            <input id="upload-backdrop-input" type="file" onChange={(ev) => uploadImage(ev, 'backdropPath')} className="custom-file-input" />
                          </label>
                      </div>
                      <div>
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
                          <input id="upload-poster-input" type="file" onChange={(ev) => uploadImage(ev, 'posterPath')} className="custom-file-input" />
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
                      <h5 className='text-black'>Genres</h5>
                      <div className="genre-list">
                        {movieData.genres.map((genre, index) => (
                          <div key={index} className="genre-item text-black d-flex align-items-center">
                            <span className="genre-id me-2">ID: {genre.id}</span>
                            <span className="genre-name me-2">Name: {genre.name}</span>
                            <button className="btn btn-danger remove-genre-btn" onClick={() => handleRemoveProductionCountries(index)}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="d-flex align-items-center mt-2">
                        <MDBInput
                          label="Name"
                          type="text"
                          value={genreData.name}
                          onChange={(e) => setProductionCountriesData(prevData => ({ ...prevData, name: e.target.value }))}
                          className="me-2 genre-input-name"
                        />
                        {/* <div className='m-8'></div> */}
                        <div className='d-flex justify-content-end'>
                          <MDBBtn className="genre-button" size='md' color="primary" onClick={handleAddProductionCountries}>Add</MDBBtn>
                        </div>
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
                        <MDBRow>
                          <div className="col-12 col-md-6 px-3 py-3">
                            {/*create input for multiple */}
                          </div>
                        </MDBRow>
                      </MDBCol>
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
  </MDBContainer>
  );
}


export default MovieForm;
