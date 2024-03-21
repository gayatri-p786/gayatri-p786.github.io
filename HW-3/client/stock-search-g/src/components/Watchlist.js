import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';
import { Alert, Spinner, Card, Button } from 'react-bootstrap';
import { BiCaretUp, BiCaretDown } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

const Watchlist = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook
    const [loading, setLoading] = useState(true);
    const [watchlist, setWatchlist] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [currentPrices, setCurrentPrices] = useState({});

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://${window.location.hostname}:5000/api/user/watchlist`);
                const data = await response.json();
                if (data) {
                    setWatchlist(data.watchlist);
                    if (data.watchlist.length === 0) {
                        setErrorMessage("Currently you don't have any stock in your watchlist");
                    }
                }

                console.log(watchlist);
            } catch (error) {
                console.error('Error fetching watchlist:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchCurrentPrices = async () => {
            try {
                const symbols = watchlist.map(item => item.symbol);
                const response = await axios.post(`http://${window.location.hostname}:5000/api/current-prices`, { symbols });
                setCurrentPrices(response.data);
            } catch (error) {
                console.error('Error fetching current prices:', error);
            }
        };

        fetchCurrentPrices();
        // console.log("current");
        // console.log(currentPrices);
    }, [watchlist]);

    const removeFromWatchlist = async (symbol) => {
        try {
            const response = await axios.post(`http://${window.location.hostname}:5000/api/user/removestockwatch`, { symbol });
            if (response) {
                const updatedWatchlist = watchlist.filter(item => item.symbol !== symbol);
                setWatchlist(updatedWatchlist);
            }
        } catch (error) {
            console.error('Error removing stock from watchlist:', error);
        }
    };

    const handleSearch = async (ticker) => {
        try {
            const response = await fetch(`http://${window.location.hostname}:5000/api/data?ticker=${ticker}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            console.log(data);
            const emptyData = Object.entries(data).find(([key, value]) => Array.isArray(value) && value.length === 0);
            if (emptyData) {
                throw new Error(`No ${emptyData[0]} data found.`);
            }
            navigate(`/search/${ticker}`, { state: { data } });
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('No data found. Please Enter a Valid Ticker');
        }
    };

    const renderStatusArrow = (stockChange) => {
        const change = stockChange;
        if (change > 0) {
            return <BiCaretUp className="text-success" />;
        } else if (change < 0) {
            return <BiCaretDown className="text-danger" />;
        } else {
            return null;
        }
    };

    return (
        <div className="d-flex justify-content-center mt-5">
            <div style={{ width: '70%' }}>
                <h1 className="mb-4">My Watchlist</h1>
                
                {loading ? (
                    <Spinner animation="border" variant="primary" />
                ) : (
                    <div>
                        {watchlist.length === 0 ? (
                            <Alert variant="warning" className="text-center">{errorMessage}</Alert>
                        ) : (
                            <div>
                                {/* // Inside the Watchlist component */}
                                {watchlist.map((item, index) => (
                                    <Card key={index} className="mb-3 position-relative">
                                        <Button variant="light" onClick={() => removeFromWatchlist(item.symbol)} className="remove-button position-absolute" style={{ top: '0', left: '0' }}>
                                            <FaTimes style={{ color: 'grey' }} />
                                        </Button><br></br>
                                        <Card.Body onClick={() => handleSearch(item.symbol)} style={{ cursor: 'pointer' }}>
                                            <div className="d-flex justify-content-between">
                                                <div style={{ flex: '1' }}>
                                                    <Card.Title>{item.symbol}</Card.Title>
                                                    <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: '0.9rem' }}>{item.companyName}</Card.Subtitle>
                                                </div>
                                                <div style={{ flex: '1', color: item.stockChange >= 0 ? 'green' : 'red', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                                                    <Card.Title>{currentPrices[item.symbol]?.c}</Card.Title>
                                                    <Card.Subtitle className="mb-2" style={{ fontSize: '0.9rem' }}>{renderStatusArrow(currentPrices[item.symbol]?.d)} {currentPrices[item.symbol]?.d} ({currentPrices[item.symbol]?.dp}%)</Card.Subtitle>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                ))}

                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Watchlist;
