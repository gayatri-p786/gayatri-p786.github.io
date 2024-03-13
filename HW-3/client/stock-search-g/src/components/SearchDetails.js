import React from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';



function SearchDetails() {
    const location = useLocation();
    const data = location.state?.data; // Get the data passed from the server

    return (
        <div>
            <SearchBar /> {/* Include SearchBar component */}
            {/* Display data received from the server */}
            {data && (
                <div>
                    <h2>Profile Data</h2>
                    <p>Symbol: {data.ticker}</p>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default SearchDetails;
