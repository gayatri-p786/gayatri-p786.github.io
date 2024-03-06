import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchDetails from './components/SearchDetails';
import Watchlist from './components/Watchlist';
import Portfolio from './components/Portfolio';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
    return (
      <Router>
      <div>
          <Navbar />
          <Routes>
              <Route path="/" element={<Navigate to="/search/home" />} />
              <Route path="/search/home" element={<Home />} />
              <Route path="/search/:ticker" element={<SearchDetails />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
          <Footer />
      </div>
  </Router>
    );
}

export default App;
