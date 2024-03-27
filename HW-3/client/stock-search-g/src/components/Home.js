import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import './styles.css';

function Home() {

  const location = useLocation();
  const symbolFromWatchlist = location.state?.ticker;
  console.log("home watchlist",symbolFromWatchlist);

    return (
      <div className="text-center heading">
        <h1>Stock Search</h1>
        <SearchBar resetS={true} dropdownstate={true} watchlistTicker={symbolFromWatchlist}/>
        {/* Other content */}
      </div>
    );
}

export default Home;
