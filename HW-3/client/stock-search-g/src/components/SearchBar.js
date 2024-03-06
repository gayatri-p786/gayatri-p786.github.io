import React, { useState } from 'react';
import { Form, FormControl, Button } from 'react-bootstrap';
import { FaSearch, FaTimes } from 'react-icons/fa';

import { useHistory } from 'react-router-dom';
import './styles.css'; // Import the CSS file


const SearchBar = ({ onSearch, onClear }) => {
    const [ticker, setTicker] = useState('');
    const history = useHistory();
  
    const handleSearch = async () => {
        try {
          // Perform the HTTP request to your Node.js backend
          const response = await fetch(`/your-backend-route?ticker=${ticker}`);
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
    
          // If request is successful, navigate to the search details page
          history.push(`/search/${ticker}`);
        } catch (error) {
          console.error('Error:', error);
          // Handle error (e.g., display error message)
        }
      };
  
    const handleClear = () => {
      setTicker('');
      onClear();
    };
  
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    };

  return (
    <div className="search-bar-container">
      <FormControl
        type="text"
        placeholder="Enter Stock Ticker Symbol"
        className="search-bar-input"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{ border: 'none' }} // Remove input field border
      />
      <Button className="search-bar-button" onClick={handleSearch}>
        <FaSearch className="search-bar-icons" />
      </Button>
      <Button className="search-bar-button" onClick={handleClear}>
        <FaTimes className="search-bar-icons" /> 
      </Button>
    </div>
  );
};

export default SearchBar;
