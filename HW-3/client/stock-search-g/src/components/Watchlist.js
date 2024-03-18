import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';
import { Alert, Spinner, Card, Button } from 'react-bootstrap'; 
import { useNavigate } from 'react-router-dom';

const Watchlist = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook
    const [loading, setLoading] = useState(true);
    const [watchlist, setWatchlist] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
              const response = await fetch(`http://${window.location.hostname}:5000/api/user/watchlist`);
              const data = await response.json();
              if (data) {
                setWatchlist(data.watchlist);
                if (watchlist.length==0){
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

    const removeFromWatchlist = async (symbol) => {
        try {
            const response = await axios.post(`http://${window.location.hostname}:5000/api/user/removestockwatch`, { symbol });
            if (response){
              const updatedWatchlist = watchlist.filter(item => item.symbol !== symbol);
              setWatchlist(updatedWatchlist);
            }
            
        } catch (error) {
            console.error('Error removing stock from watchlist:', error);
        }
    };

    const handleSearch = async (ticker) => {
      try {
          // Perform the HTTP request to your Node.js backend
          
          const response = await fetch(`http://${window.location.hostname}:5000/api/data?ticker=${ticker}`);
          // console.log(`http://${window.location.hostname}:5000/api/data/${ticker}`);
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
          navigate(`/search/${ticker}`, { state: { data } });
          
          // If request is successful, display the message
          // setMessage(data.message);
      } catch (error) {
          console.error('Error:', error);
          // Handle error (e.g., display error message)
          setErrorMessage('No data found. Please Enter a Valid Ticker');
      }
  };

    return (
        <div>
          <h1>Watchlist</h1>
            {loading ? (
                <Spinner animation="border" variant="primary" />
            ) : (
                <div>
                    {watchlist.length === 0 ? (
                        <Alert variant="warning">{errorMessage}</Alert>
                        ) : (
                          <div>
                            {watchlist.map((item, index) => (
                                <Card key={index} onClick={() => handleSearch(item.symbol)}>
                                    <Card.Body>
                                        <Button variant="light" onClick={() => removeFromWatchlist(item.symbol)}>
                                            <FaTimes style={{ color: 'grey' }} /> {/* Customize cross button color */}
                                        </Button>
                                        <Card.Title>{item.symbol}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">{item.companyName}</Card.Subtitle>
                                        <Card.Text>
                                            Price: {item.stockPrice}<br />
                                            Change: {item.stockChange}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Watchlist;
