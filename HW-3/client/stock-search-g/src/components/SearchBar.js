import React, { useState, useEffect  } from 'react';
import { Form, FormControl, Button, Alert, Dropdown, Spinner } from 'react-bootstrap'; // Import Alert from react-bootstrap for displaying messages
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchSymbol } from '../actions/searchActions';
import axios from 'axios';
import './styles.css'; // Import the CSS file
import { BACKEND_URL } from '../config';

const SearchBar = ({ resetS, dropdownstate, watchlistTicker }) => {
    console.log("watchlistTicker",watchlistTicker);
    const dispatch = useDispatch();
    // const initialTicker = useSelector(state => state.search.searchSymbol);
    // console.log("my ticker",initialTicker);
    const searchSymbol = useSelector(state => state.search.searchSymbol);
    const [ticker, setTicker] = useState(searchSymbol||'');
    console.log("tickers",ticker);
    const [errorMessage, setErrorMessage] = useState('');
    const [suggestions, setSuggestions] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [dataLoading, setdataLoading] = useState(false);
    const [resetSearch, setResetSearch] = useState(false);
    const [dropdown, setDropdown] = useState(dropdownstate && true);
    const navigate = useNavigate();


    useEffect(() => {
        if (resetSearch) {
            // Reset the state when resetSearch prop changes
            setTicker('');
            setErrorMessage('');
            setSuggestions([]);
            setdataLoading(false);
            setLoading(true);
            setDropdown(true);
        }
    }, [resetSearch]);

    useEffect(() => {
        if (watchlistTicker) {
            handleSearch(watchlistTicker);
        }
    }, [watchlistTicker]);

    useEffect(() => {
        // Update ticker state when searchSymbol changes
        setTicker(searchSymbol || '');
    }, [searchSymbol]);

    const handleSearch = async (searchticker = ticker) => {
        console.log("in handlesearch");
        setDropdown(false);
        setdataLoading(true);
        // dispatch(setSearchSymbol(ticker));
        try {
            // Perform the HTTP request to your Node.js backend
            
            const response = await fetch(`/api/data?ticker=${searchticker}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            console.log(data);
            // Check if any of the arrays in data are empty
            const emptyData = Object.entries(data).find(([key, value]) => Array.isArray(value) && value.length === 0);
            if (emptyData) {
                throw new Error(`No ${emptyData[0]} data found.`);
            }
            dispatch(setSearchSymbol(searchticker, data)); 
            setdataLoading(false);
            navigate(`/search/${searchticker}`, { state: { searchticker } });
            
            // If request is successful, display the message
            // setMessage(data.message);
        } catch (error) {
            console.error('Error:', error);
            // Handle error (e.g., display error message)
            setErrorMessage('No data found. Please Enter a Valid Ticker');
        }finally {
            // Clear the suggestions
            setSuggestions([]);
            setdataLoading(false);
        }
    };

    const handleClear = () => {
        setTicker('');
        setErrorMessage('');
        setDropdown(false);
        setResetSearch(true);
        dispatch(setSearchSymbol('', {})); 
        navigate('/search/home'); 
        
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSelectSuggestion = async (selectedSuggestion) => {
        setTicker(selectedSuggestion); 
        // await new Promise(resolve => setTicker(selectedSuggestion, resolve)); 
        console.log("selected ticker",ticker,selectedSuggestion);
        setSuggestions([]); 
        setDropdown(false);
        handleSearch(selectedSuggestion);
    };

    const handleInputChange = async (inputValue) => {
        // const lowercaseValue = inputValue.toLowerCase();
        // setTicker(lowercaseValue);
        setTicker(inputValue);
        setLoading(true);
        try {
            
            const response = await axios.get(`https://finnhub.io/api/v1/search?q=${inputValue}&token=cmuu051r01qru65i12s0cmuu051r01qru65i12sg`);
            console.log(`https://finnhub.io/api/v1/search?q=${inputValue}&token=cmuu051r01qru65i12s0cmuu051r01qru65i12sg`);
            if (!response.data.result) {
                throw new Error('No results found');
            }
            const filteredSuggestions = response.data.result.filter(suggestion => suggestion.type === 'Common Stock' && !suggestion.description.includes('.') && !suggestion.symbol.includes('.'));
            // console.log(filteredSuggestions);
            setSuggestions(filteredSuggestions); // Update suggestions state with autocomplete results
            console.log(suggestions.length);
            
        } catch (error) {
            console.error('Error fetching autocomplete suggestions:', error.message);
            setErrorMessage('Failed to fetch autocomplete suggestions');
            // setLoading(false);
        }
        setLoading(false);
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
                <Button type="button" className="search-bar-button" onClick={()=>{handleSearch();}}>
                    <FaSearch className="search-bar-icons" />
                </Button>
                <Button className="search-bar-button" onClick={handleClear}>
                    <FaTimes className="search-bar-icons" />
                </Button>
                {ticker.length > 0 && (
                    <Dropdown.Menu show={dropdown} className="autocomplete-dropdown">
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
            {dataLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                           <Spinner animation="border" variant="primary" />
                       </div>
                        ): null}
        </div>
    );
};

export default SearchBar;
