import React, { useState, useEffect } from 'react';
import { Alert, Spinner } from 'react-bootstrap'; // Import Alert from react-bootstrap for displaying messages


const Portfolio = () => {
    const [portfolio, setPortfolio] = useState([]);
    const [money, setMoney] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const response = await fetch(`http://${window.location.hostname}:5000/api/user/portfolio`);
                // console.log(`http://${window.location.hostname}:5000/api/user/portfolio`);
                const data = await response.json();
                // console.log(data);
                if (data){
                  // console.log(response.data);
                  setPortfolio(data.portfolio);
                  setMoney(data.money);
                  console.log(portfolio);
                }
                if (portfolio.length==0){
                  setErrorMessage("Currently you don't have any stock in your portfolio");
                }
                // setLoading(false);
            } catch (error) {
                console.error('Error fetching portfolio:', error);
                
            }finally {
              setLoading(false);
          }
        };

        fetchPortfolio();
    }, []);

    return (
        <div>
          <h1>My Portfolio</h1>
          <h2>Money in Wallet: ${money}</h2>
            {loading ? (
                <Spinner animation="border" variant="primary" />
            ) : (
                <div>
                    {portfolio.length === 0 ? (
                      
                      <Alert variant="warning">{errorMessage}</Alert>
                        // <Alert message="Currently you don't have any stock in your portfolio" variant="warning" />
                    ) : (
                        <div>
                            {/* Display watchlist */}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Portfolio;
