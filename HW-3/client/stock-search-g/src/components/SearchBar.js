import React, { useState } from 'react';
import { Form, FormControl, Button, Alert, Dropdown, Spinner } from 'react-bootstrap'; // Import Alert from react-bootstrap for displaying messages
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css'; // Import the CSS file

const SearchBar = ({ onClear, initialTicker }) => {
    // const [ticker, setTicker] = useState('');
    const [ticker, setTicker] = useState(initialTicker || '');
    const [errorMessage, setErrorMessage] = useState('');
    const [suggestions, setSuggestions] = useState([]); 
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async () => {
        try {
            // Perform the HTTP request to your Node.js backend
            
            const response = await fetch(`http://${window.location.hostname}:5000/api/data?ticker=${ticker}`);
            // console.log(`http://${window.location.hostname}:5000/api/data/${ticker}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            navigate(`/search/${ticker}`, { state: { data } });
            // If request is successful, display the message
            // setMessage(data.message);
        } catch (error) {
            console.error('Error:', error);
            // Handle error (e.g., display error message)
            setErrorMessage('Failed to fetch data');
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

    const handleSelectSuggestion = (selectedSymbol) => {
        setTicker(selectedSymbol);
        setSuggestions([]); // Clear suggestions after selection
    };

    const handleInputChange = async (inputValue) => {
        setTicker(inputValue);
        try {
            setLoading(true);
            const response = await axios.get(`https://finnhub.io/api/v1/search?q=${inputValue}&token=cmuu051r01qru65i12s0cmuu051r01qru65i12sg`);
            console.log(`https://finnhub.io/api/v1/search?q=${inputValue}&token=cmuu051r01qru65i12s0cmuu051r01qru65i12sg`);
            if (!response.data.result) {
                throw new Error('No results found');
            }
            const filteredSuggestions = response.data.result.filter(suggestion => suggestion.type === 'Common Stock');
            // console.log(filteredSuggestions);
            setSuggestions(filteredSuggestions); // Update suggestions state with autocomplete results
            console.log(suggestions.length);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching autocomplete suggestions:', error.message);
            setErrorMessage('Failed to fetch autocomplete suggestions');
            setLoading(false);
        }
    };

    return (
        <div className='position-relative'>
            <div className="search-bar-container">
            <FormControl
                    type="text"
                    placeholder="Enter Stock Ticker Symbol"
                    className="search-bar-input"
                    value={ticker}
                    onChange={(e) => handleInputChange(e.target.value)} // Call handleInputChange to fetch autocomplete suggestions
                    onKeyPress={handleKeyPress}
                    style={{ border: 'none' }}
                />
                <Button className="search-bar-button" onClick={handleSearch}>
                    <FaSearch className="search-bar-icons" />
                </Button>
                <Button className="search-bar-button" onClick={handleClear}>
                    <FaTimes className="search-bar-icons" />
                </Button>
                {suggestions.length > 0 && (
                    <Dropdown.Menu show={true} className="autocomplete-dropdown">
                        {loading ? (
                            <Spinner animation="border" variant="primary" />
                        ) : (
                            suggestions.map((suggestion) => (
                                <Dropdown.Item
                                    key={suggestion.symbol}
                                    onClick={() => handleSelectSuggestion(suggestion.symbol)}
                                >
                                    <div className="autocomplete-dropdown-item">
                                        {suggestion.symbol} | {suggestion.description}
                                    </div>
                                </Dropdown.Item>
                            ))
                        )}
                    </Dropdown.Menu>
            )}
            </div>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>} {/* Display error message */}
            {/* {message && <Alert variant="success">{message}</Alert>} Display success message */}
            {/* Render autocomplete dropdown if suggestions exist */}
            
        </div>
    );
};

export default SearchBar;
