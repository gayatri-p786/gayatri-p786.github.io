import React, { useState } from 'react';
import SearchBar from './SearchBar';
import './styles.css';

function Home() {

    return (
      <div className="text-center heading">
        <h1>Stock Search</h1>
        <SearchBar dropdownstate={true} />
        {/* Other content */}
      </div>
    );
}

export default Home;
