import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import './App.css'
import Header from "./components/navbar/header";
import Home from "./pages/homePage/home";
import MovieList from "./components/movieList/movieList";
import Movie from "./pages/moviePage/movie";
import Login from "./pages/loginPage/login";
import Register from "./pages/signupPage/signup";

function App() {

  return (
    <>
      <div className="App">
        <Router>
          <Header/>
          <Routes>
            <Route index element={<h1><Home/></h1>} />
            <Route path="movies/:type" element={<MovieList/>} />
            <Route path="movie/:id" element={<Movie/>} />
            <Route path="login" element={<h1><Login/></h1>} />
            <Route path="signup" element={<h1><Register/></h1>} />
            <Route path="/*" element={<h1>Error 404 Page not available!</h1>} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
