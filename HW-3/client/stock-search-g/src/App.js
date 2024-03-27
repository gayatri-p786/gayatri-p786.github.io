import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchDetails from './components/SearchDetails';
import Watchlist from './components/Watchlist';
import Portfolio from './components/Portfolio';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import store from './store';

function App() {
    return (
        <Provider store={store}>
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
        </Provider>
    );
}

export default App;





// To be Done:
// responsive (done)
// watchlist to search/ticker redirection (done)
// portfolio buy sell issue (Done)
// spinner for dataLoading in SearchBar in mobile view not showing(done)
// highcharts color
