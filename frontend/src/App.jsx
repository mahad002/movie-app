import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/navbar/header';
import Home from './pages/homePage/home';
import MovieList from './components/movieList/movieList';
import LoginRegister from './pages/login-registerPage/login-register';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Profile from './pages/profilePage/profile';
import { AuthProvider } from './Context/AuthContext';
import MovieForm from './pages/movieForm/form';


function App() {
  return (
    <AuthProvider> 
      <div className="App">
        <Router>
          <Header />
          <Routes>
            <Route index element={<h1><Home/></h1>} />
            <Route path="movies/:type" element={<MovieList />} />
            <Route path="movie/:id" element={<Movie />} />
            <Route path="profile/:username" element={<Profile />} />
            <Route path="login-register" element={<h1><LoginRegister /></h1>} />
            <Route path="signup" element={<h1><Login /></h1>} />
            <Route path="pageform" element={<h1><MovieForm /></h1>} />
            <Route path="/*" element={<h1>Error 404 Page not available!</h1>} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
