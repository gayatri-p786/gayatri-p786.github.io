import React, { useState, useEffect } from 'react';
import { Alert, Spinner, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import BuyModal from './BuyModal';
import SellModal from './SellModal';

const Portfolio = () => {
    const [portfolio, setPortfolio] = useState([]);
    const [reloadportfolio, setReloadPortfolio] = useState(false);
    const [money, setMoney] = useState(0);
    const [loading, setLoading] = useState(true);
    const [priceLoading, setPriceLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [bmessage, setBmessage] = useState('');
    const [smessage, setSmessage] = useState('');
    const [currentPrices, setCurrentPrices] = useState({});
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [showSellModal, setShowSellModal] = useState(false);
    const [buySuccess, setBuySuccess] = useState(false);
    const [sellSuccess, setSellSuccess] = useState(false);
    const [buyModalData, setBuyModalData] = useState({});
    const [sellModalData, setSellModalData] = useState({});


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
                setPriceLoading(false);
                setErrorMessage("Currently you don't have any stock in your portfolio");
            }
        } catch (error) {
            console.error('Error fetching portfolio:', error);
        } finally {
            // Check if current prices are fetched
            if (Object.keys(currentPrices).length === 0 && portfolio.length > 0) {
                setLoading(true);
            } else {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchPortfolio();
        
    }, []);

    useEffect(() => {
        if (portfolio.length > 0) {
            const fetchCurrentPrices = async () => {
                setPriceLoading(true);
                try {
                    const symbols = portfolio.map(item => item.symbol);
                    const response = await axios.post(`http://${window.location.hostname}:5000/api/current-prices`, { symbols });
                    setCurrentPrices(response.data);
                } catch (error) {
                    console.error('Error fetching current prices:', error);
                } finally {
                    setPriceLoading(false);
                }
            };
    
            fetchCurrentPrices();
        }
    }, [portfolio]);

    // useEffect(() => {
    //     // Logic to fetch portfolio data goes here
    //     // This useEffect will run whenever reloadPortfolio changes
    //     fetchPortfolio();
    // }, [reloadPortfolio]);

    useEffect(() => {
        // This useEffect hook reloads the portfolio data when buy or sell is successful
        if (buySuccess || sellSuccess) {
            fetchPortfolio(); // Reload the portfolio data
            // Reset buySuccess and sellSuccess after 3 seconds
            const timer = setTimeout(() => {
                setBuySuccess(false);
                setSellSuccess(false);
            }, 3000);
            // Cleanup function to clear the timer
            return () => clearTimeout(timer);
        }
    }, [reloadportfolio]);

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

        const change = currentPrice.c - stock.averageCostPerShare;
        const marketValue = stock.quantity * currentPrice.c;
        // console.log(change,marketValue);
        
        return { change:change, mv:marketValue };
    };

    const handleCloseBuyModal = () => {
        setShowBuyModal(false);
    };

    const handleCloseSellModal = () => {
        setShowSellModal(false);
    };

    const openBuyModal = (stock) => {
        setShowBuyModal(true);
        setBuyModalData({
            // show: showBuyModal,
            ticker: stock.symbol,
            company: stock.company,
            currentPrice: currentPrices[stock.symbol].c,
            moneyInWallet: money,
            handleCloseBuyModal: handleCloseBuyModal,
            handleBuySuccess: () => handleSuccessfulBuy(stock.symbol)
        });
    };

    const openSellModal = (stock) => {
        setShowSellModal(true);
        setSellModalData({
            // show: showSellModal,
            ticker: stock.symbol,
            existingQuantity: stock.quantity,
            currentPrice: currentPrices[stock.symbol].c,
            moneyInWallet: money,
            handleCloseSellModal: handleCloseSellModal,
            handleSellSuccess: () => handleSuccessfulSell(stock.symbol)
        });
    };

    const handleSuccessfulBuy = (ticker) => {
        
        setShowBuyModal(false);
        setBmessage(`${ticker} bought succesfully`);
        setBuySuccess(true);
        
        setTimeout(() => {
            setBuySuccess(false);
        }, 3000);
        
        setReloadPortfolio(prevState => !prevState);
        setReloadPortfolio(true);
        
        
    };

    const handleSuccessfulSell = (ticker) => {
        setShowSellModal(false);
        setSmessage(`${ticker} sold succesfully`);
        setSellSuccess(true);
        setTimeout(() => {
            setSellSuccess(false);
        }, 3000);

        setReloadPortfolio(prevState => !prevState);
        setReloadPortfolio(true);
        
    };


    return (
        <div className="d-flex justify-content-center mt-5">
            <div style={{ width: '70%' }}>
                <h1 className="mb-4">My Portfolio</h1>
                <h3 className="mb-4">Money in Wallet: ${money}</h3>
                {buySuccess && (
                    <Alert variant="success" className="text-center">
                        {bmessage}
                    </Alert>
                )}
                {sellSuccess && (
                    <Alert variant="danger" className="text-center">
                        {smessage}
                    </Alert>
                )}
                {loading || priceLoading ? (
                    <Spinner animation="border" variant="primary" />
                ) : (
                    <div>
                        {portfolio.length === 0 ? (
                            <Alert variant="warning" className="text-center">{errorMessage}</Alert>
                        ) : (
                            <div>
                                {portfolio.map((stock, index) => (
                                    <Card key={index} className="mb-3">
                                        <Card.Header className="d-flex justify-content-between align-items-center">
                                            <div className="w-100">
                                                <h1 className="mb-0  d-m-block d-xs-inline-block">{stock.symbol}</h1>
                                                <Card.Subtitle className="mb-2 text-muted  d-m-block d-xs-inline-block">{stock.company}</Card.Subtitle>
                                            </div>
                                        </Card.Header>
                                        <Card.Body className="p-xs-1 p-sm-1">
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <p className="mb-0"><strong>Quantity:</strong> {stock.quantity.toFixed(2)}</p>
                                                    <p className="mb-0"><strong>Avg Cost / Share:</strong> ${stock.averageCostPerShare.toFixed(2)}</p>
                                                    <p className="mb-0"><strong>Total Cost:</strong> ${stock.total.toFixed(2)}</p>
                                                </div>
                                                <div className="col-sm-6">
                                                    <p className="mb-0" style={{ color: stock.change > 0 ? 'green' : (calculateStockData(stock).change < 0 ? 'red' : 'black') }}>
                                                        <strong>Change:</strong> ${calculateStockData(stock).change.toFixed(2)}
                                                    </p>
                                                    <p className="mb-0" style={{ color: stock.change > 0 ? 'green' : (calculateStockData(stock).change < 0 ? 'red' : 'black') }}>
                                                        <strong>Current Price:</strong> ${currentPrices[stock.symbol].c.toFixed(2)}
                                                    </p>
                                                    <p className="mb-0"><strong>Market Value:</strong> ${calculateStockData(stock).mv.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </Card.Body>
                                        <Card.Footer>
                                            <Button variant="primary" onClick={() => openBuyModal(stock)}>Buy</Button>{' '}
                                            <Button variant="danger" onClick={() => openSellModal(stock)}>Sell</Button>
                                        </Card.Footer>
                                        {/* <BuyModal
                                            show={showBuyModal}
                                            onHide={handleCloseBuyModal}
                                            ticker={stock.symbol}
                                            company={stock.company}
                                            currentPrice={currentPrices[stock.symbol].c}
                                            moneyInWallet={money}
                                            handleCloseBuyModal={handleCloseBuyModal}
                                            handleBuySuccess={() => handleSuccessfulBuy(stock.symbol)}
                                        />
                                        <SellModal
                                            show={showSellModal}
                                            onHide={handleCloseSellModal}
                                            ticker={stock.symbol}
                                            existingQuantity={stock.quantity}
                                            currentPrice={currentPrices[stock.symbol].c}
                                            moneyInWallet={money}
                                            handleCloseSellModal={handleCloseSellModal}
                                            handleSellSuccess={() => handleSuccessfulSell(stock.symbol)} 
                                        /> */}
                                        <BuyModal show={showBuyModal} {...buyModalData} />
                                        <SellModal show={showSellModal} {...sellModalData} />
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
