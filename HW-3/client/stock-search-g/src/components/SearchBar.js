import React, { useState } from 'react';
import { Form, FormControl, Button, Alert } from 'react-bootstrap'; // Import Alert from react-bootstrap for displaying messages
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './styles.css'; // Import the CSS file

const SearchBar = ({ onClear, initialTicker }) => {
    // const [ticker, setTicker] = useState('');
    const [ticker, setTicker] = useState(initialTicker || '');
    const [errorMessage, setErrorMessage] = useState('');
    const [message, setMessage] = useState('');
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

    return (
        <div>
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
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>} {/* Display error message */}
            {message && <Alert variant="success">{message}</Alert>} {/* Display success message */}
        </div>
    );
};

export default SearchBar;
