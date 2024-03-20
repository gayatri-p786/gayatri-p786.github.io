import React, { useState, useEffect } from 'react';
import { Alert, Spinner, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import BuyModal from './BuyModal';
import SellModal from './SellModal';

const Portfolio = () => {
    const [portfolio, setPortfolio] = useState([]);
    const [money, setMoney] = useState(0);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [currentPrices, setCurrentPrices] = useState({});
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [showSellModal, setShowSellModal] = useState(false);
    const [buySuccess, setBuySuccess] = useState(false);
    const [sellSuccess, setSellSuccess] = useState(false);

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const response = await fetch(`http://${window.location.hostname}:5000/api/user/portfolio`);
                const data = await response.json();
                console.log("port data", data);
                if (data) {
                    setPortfolio(data.portfolio);
                    setMoney(data.money);
                }
                if (data.portfolio.length === 0) {
                    setErrorMessage("Currently you don't have any stock in your portfolio");
                }
            } catch (error) {
                console.error('Error fetching portfolio:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolio();
        
    }, []);

    useEffect(() => {
        const fetchCurrentPrices = async () => {
            try {
                setLoading(true);
                try {
                    const symbols = portfolio.map(item => item.symbol);
                    const response = await axios.post(`http://${window.location.hostname}:5000/api/current-prices`, { symbols });
                    setCurrentPrices(response.data);
                } catch (error) {
                    console.error('Error fetching current prices:', error);
                }
            } catch (error) {
                console.error('Error fetching current prices:', error);
            }finally{
                setLoading(false);
            }
        };

        fetchCurrentPrices();
        
    }, [portfolio]);

    // Function to calculate the change and market value for each stock
    // Function to calculate the change and market value for each stock
    const calculateStockData = (stock) => {
        // console.log("portfolio");
        // console.log(portfolio);

        // console.log("prices");
        // console.log(currentPrices);

        // Fetch current price from currentPrices array using stock symbol as key
        const currentPrice = currentPrices[stock.symbol];
        // console.log("p",currentPrice);
        
        if (!currentPrice) {
            console.error(`Current price not found for ${stock.symbol}`);
            return { change: 0, marketValue: 0 };
        }

        const change = stock.averageCostPerShare - currentPrice.c;
        const marketValue = stock.quantity * currentPrice.c;
        // console.log(change,marketValue);
        
        return { change:change, mv:marketValue };
    };

    
    const handleBuy = async (quantity) => {
        try {
            // Perform buy operation here
            // Update money and portfolio states accordingly
            setBuySuccess(true);
            // Close the buy modal
            setShowBuyModal(false);
        } catch (error) {
            console.error('Error buying stock:', error);
        }
    };

    const handleSell = async (quantity) => {
        try {
            // Perform sell operation here
            // Update money and portfolio states accordingly
            setSellSuccess(true);
            // Close the sell modal
            setShowSellModal(false);
        } catch (error) {
            console.error('Error selling stock:', error);
        }
    };

    const handleCloseBuyModal = () => {
        setShowBuyModal(false);
    };

    const handleCloseSellModal = () => {
        setShowSellModal(false);
    };

    const openBuyModal = (stock) => {
        setShowBuyModal(true);
    };

    const openSellModal = (stock) => {
        setShowSellModal(true);
    };


    return (
        <div className="d-flex justify-content-center mt-5">
            <div style={{ width: '70%' }}>
                <h1 className="mb-4">My Portfolio</h1>
                <h2 className="mb-4">Money in Wallet: ${money}</h2>
                {buySuccess && (
                    <Alert variant="success" className="text-center">
                        Stock bought successfully!
                    </Alert>
                )}
                {sellSuccess && (
                    <Alert variant="danger" className="text-center">
                        Stock sold successfully!
                    </Alert>
                )}
                {loading ? (
                    <Spinner animation="border" variant="primary" />
                ) : (
                    <div>
                        {portfolio.length === 0 ? (
                            <Alert variant="warning" className="text-center">{errorMessage}</Alert>
                        ) : (
                            <div>
                                {portfolio.map((stock, index) => (
                                    <Card key={index} className="mb-3">
                                        <Card.Header>
                                            <h1 className="mb-0">{stock.symbol}</h1>
                                            <Card.Subtitle className="mb-2 text-muted">{stock.company}</Card.Subtitle>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <p><strong>Quantity:</strong> {stock.quantity}</p>
                                                    <p><strong>Avg Cost / Share:</strong> ${stock.averageCostPerShare}</p>
                                                    <p><strong>Total Cost:</strong> ${stock.total.toFixed(2)}</p>
                                                </div>
                                                <div className="col-sm-6">
                                                    <p style={{ color: stock.change > 0 ? 'green' : (calculateStockData(stock).change < 0 ? 'red' : 'black') }}>
                                                        <strong>Change:</strong> ${calculateStockData(stock).change}
                                                    </p>
                                                    <p style={{ color: stock.change > 0 ? 'green' : (calculateStockData(stock).change < 0 ? 'red' : 'black') }}>
                                                        <strong>Current Price:</strong> ${currentPrices[stock.symbol].c}
                                                    </p>
                                                    <p><strong>Market Value:</strong> ${calculateStockData(stock).mv}</p>
                                                </div>
                                            </div>
                                        </Card.Body>
                                        <Card.Footer>
                                            <Button variant="primary" onClick={() => openBuyModal(stock.symbol)}>Buy</Button>{' '}
                                            <Button variant="danger" onClick={() => openSellModal(stock.symbol)}>Sell</Button>
                                        </Card.Footer>
                                        <BuyModal
                                            show={showBuyModal}
                                            onHide={handleCloseBuyModal}
                                            ticker={stock.symbol}
                                            company={stock.company}
                                            currentPrice={currentPrices[stock.symbol]?.c}
                                            moneyInWallet={money}
                                            onBuy={handleBuy}
                                        />
                                        <SellModal
                                            show={showSellModal}
                                            onHide={handleCloseSellModal}
                                            ticker={stock.symbol}
                                            onSell={handleSell}
                                            existingQuantity={stock.quantity}
                                            currentPrice={currentPrices[stock.symbol]?.c}
                                            moneyInWallet={money}
                                        />
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

export default Portfolio;
