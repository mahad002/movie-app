import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import './App.css'
import Header from "./components/navbar/header";

function App() {

  return (
    <>
      <div className="App">
        <Router>
          <Header/>
          <Routes>
            <Route index element={<h1>Hello</h1>} />
            <Route path="movies/:type" element={<h1>Movie list for Type</h1>} />
            <Route path="movie/:id" element={<h1>Movie Detail</h1>} />
            <Route path="/*" element={<h1>Error 404 Page not available!</h1>} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
