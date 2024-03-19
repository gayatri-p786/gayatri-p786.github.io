import React, { useState, useEffect }  from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import { BiCaretUp, BiCaretDown, BiStar, BiChevronLeft, BiChevronRight } from 'react-icons/bi'; 
import { AiFillStar} from 'react-icons/ai';
import HourlyPriceChart from './HourlyPriceChart';
import ChartsTab from './chartsTab';
import './styles.css'; // Import the CSS file
import axios from 'axios';
import BuyModal from './BuyModal';
import { Alert } from 'react-bootstrap'; // Import Alert from react-bootstrap for displaying messages


function SearchDetails() {
    const location = useLocation();
    const data = location.state?.data; // Get the data passed from the server
    
    // const { profileData, historicalData, latestPriceData, newsData, recommendationData, sentimentData, peersData, earningsData } = data;
    const ticker = data.profileData.ticker;
    const [hasStock, setHasStock] = useState(false);
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [money, setMoney] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [watchlist, setWatchlist] = useState([]);

    const currentTime = new Date();
    const pstOptions = { timeZone: 'America/Los_Angeles' }; // Specify the PST timezone
    const pstTimeString = currentTime.toLocaleString('en-US', {
        ...pstOptions,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const formattedDate = pstTimeString.replace(/\//g, '-'); // Replace slashes with dashes



    useEffect(() => {
        // Fetch user's portfolio from MongoDB
        const fetchPortfolio = async () => {
            try {
                const response = await axios.get(`http://${window.location.hostname}:5000/api/user/portfolio`);
                const portfolio = response.data;
                const hasStock = portfolio.portfolio.some(item => item.symbol === ticker);
                setHasStock(hasStock);
                setMoney(portfolio.money);
            } catch (error) {
                console.error('Error fetching user portfolio:', error);
            }
        };

        fetchPortfolio();
    }, [ticker]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://${window.location.hostname}:5000/api/user/watchlist`);
                const data = await response.json();
                if (data) {
                    setWatchlist(data.watchlist);
                    if (watchlist.length != 0) {
                        // setErrorMessage("Currently you don't have any stock in your watchlist");
                    
                    // Check if the symbol exists in the watchlist
                    const hasSymbol = data.watchlist.some(item => item.symbol === ticker);
                    // Set starClicked state based on whether the symbol exists in the watchlist
                    setStarClicked(hasSymbol);
                    }else{
                        setStarClicked(false);
                    }
                }
            } catch (error) {
                console.error('Error fetching watchlist:', error);
            } 
        };
    
        fetchUserData();
    }, []);
    
    const addToWatchlist = async () => {
        const watchlistStock = {
            symbol: data.profileData.ticker,
            companyName: data.profileData.name,
            stockPrice: data.latestPriceData.c,
            stockChange: data.latestPriceData.d,
        };
        try {
            const response = await axios.post(`http://${window.location.hostname}:5000/api/user/addstockwatch`, { stock: watchlistStock });
            if (response.data.success) {
                console.log('Stock added to watchlist successfully');
                // Optionally, you can update the UI or show a success message
            } else {
                console.error('Failed to add stock to watchlist');
                // Optionally, you can show an error message to the user
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle any errors from the request
        }
    };

    const removeFromWatchlist = async (symbol) => {
        try {
            const response = await axios.post(`http://${window.location.hostname}:5000/api/user/removestockwatch`, { symbol });
            if (response.data.success) {
                console.log('Stock removed from watchlist successfully');
                setWatchlist(watchlist.filter(item => item.symbol !== symbol));
                // Optionally, you can update the UI or show a success message
            } else {
                console.error('Failed to remove stock from watchlist');
                // Optionally, you can show an error message to the user
            }
        } catch (error) {
            console.error('Error removing stock from watchlist:', error);
        }
    };

    // Function to check if the market is open based on timestamp
    const isMarketOpen = () => {
        const now = new Date();
        const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000); // Convert current time to UTC
        const estTime = new Date(utcTime + (3600000 * -5)); // Convert UTC time to EST
    
        const dayOfWeek = estTime.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const hours = estTime.getHours();
        const minutes = estTime.getMinutes();
    
        // Check if it's a weekday (Monday to Friday)
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            // Check if the time is within market hours (9:30 am to 4:00 pm EST)
            const marketOpenTime = new Date(estTime);
            marketOpenTime.setHours(9, 30, 0); // 9:30 am EST
            const marketCloseTime = new Date(estTime);
            marketCloseTime.setHours(16, 0, 0); // 4:00 pm EST
            console.log(marketOpenTime,marketCloseTime,estTime);
    
            return estTime >= marketOpenTime && estTime <= marketCloseTime;
        }
    
        // Return false for weekends
        return false;
    };
    
    

    // Function to format timestamp to yyyy-mm-dd hh:mm:ss format
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toISOString().replace('T', ' ').slice(0, 19);
    };

     // State to manage active tab
    const [activeTab, setActiveTab] = useState('summary');
    const [starClicked, setStarClicked] = useState(false); 

    const handleStarClick = () => {
        setStarClicked(!starClicked);
        setShowAlert(true); // Show the alert
        setTimeout(() => setShowAlert(false), 3000);  // Toggle the state
        const stockSymbol = data.profileData.ticker;
        const isStockInWatchlist = watchlist.some(item => item.symbol === stockSymbol);
        if (!isStockInWatchlist) {
            addToWatchlist();
        } else {
            removeFromWatchlist(stockSymbol);
        }
    };

    // Function to handle buy button click
    const handleBuyClick = () => {
        setShowBuyModal(true);
    };

    // Function to handle buy modal close
    const handleCloseBuyModal = () => {
        setShowBuyModal(false);
    };

    // Function to handle buy action
    const handleBuy = (ticker, quantity) => {
        // Implement buy functionality
        console.log(`Buying ${quantity} shares of ${ticker}`);
        setShowBuyModal(false);
    };

    const handleSell = () => {
        // Implement sell functionality
    };
    

    const renderStatusArrow = () => {
        const change = data.latestPriceData.d;
        if (change > 0) {
            return <BiCaretUp className="text-success" />; // Up arrow
        } else if (change < 0) {
            return <BiCaretDown className="text-danger" />; // Down arrow
        } else {
            return null; // No change
        }
    };

    const tabs = ['summary', 'topNews', 'charts', 'insights']; // Define all tabs
    const [scrollPosition, setScrollPosition] = useState(0);

    const scrollTabs = (direction) => {
        const tabsContainer = document.querySelector('.nav-tabs');
        const tabsList = tabsContainer.querySelectorAll('.nav-item');
        const tabWidth = tabsList[0].clientWidth;
        const tabsToShow = Math.floor(tabsContainer.clientWidth / tabWidth);
        const tabsCount = tabsList.length;

        let newPosition;
        if (direction === 'right') {
            newPosition = Math.min(scrollPosition + 1, tabsCount - tabsToShow);
        } else {
            newPosition = Math.max(scrollPosition - 1, 0);
        }

        setScrollPosition(newPosition);
        tabsContainer.scrollTo({ left: newPosition * tabWidth, behavior: 'smooth' });
    };


   

    return (
        <div className="container">
            <div className="text-center heading">
                <h1>Stock Search</h1>
            </div>

            <SearchBar initialTicker={data.profileData.ticker} dropdown={false} />

            {showAlert && starClicked && (
                <Alert variant="success" className='text-center'>
                    Stock added to watchlist!
                </Alert>
            )}

            {data && (
            <div className='content-container'>
                <div className="row mt-4 justify-content-center">
                    <div className="col-4 text-center">
                        <div className="company-info">
                            <h2>
                                {data.profileData.ticker}
                                <button 
                                    className={`star-button`} 
                                    onClick={handleStarClick}
                                    style={{
                                        border: 'none',
                                        background: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <AiFillStar style={{ fill: starClicked ? 'yellow' : 'black', color: starClicked ? 'yellow' : 'black' }} />
                                </button>
                            </h2>

                            <h3>{data.profileData.name}</h3>
                            <p>{data.profileData.exchange}</p>
                            <button className="btn btn-success" onClick={handleBuyClick}>Buy</button>
                            {hasStock && <button className="btn btn-danger" onClick={handleSell}>Sell</button>}
                            <BuyModal
                                show={showBuyModal}
                                onHide={handleCloseBuyModal}
                                ticker={ticker}
                                currentPrice={data.latestPriceData.c}
                                moneyInWallet={money}
                                onBuy={handleBuy}
                                handleCloseBuyModal={handleCloseBuyModal}
                            />
                        </div>
                    </div>
                    <div className="col-4 text-center">
                        <img src={data.profileData.logo} alt="Company Logo" className="img-fluid" />
                    </div>
                    <div className="col-4 text-center">
                        <p className={data.latestPriceData.d > 0 ? 'text-success' : 'text-danger'} style={{ fontSize: '24px', fontWeight: 'bold' }}>
                            {data.latestPriceData.c}
                        </p>
                        <p className={data.latestPriceData.d > 0 ? 'text-success' : 'text-danger'} style={{ fontSize: '18px', fontWeight: 'bold' }}>
                            {renderStatusArrow()} {data.latestPriceData.d} ({data.latestPriceData.dp}%)
                        </p>
                        
                        <p>{formattedDate}</p>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-4 text-center">
                        <div style={{ fontWeight: 'bold', color: isMarketOpen() ? 'green' : 'red' }}>
                            <span>
                                {isMarketOpen() ? `Market is open on ${formattedDate}` : `Market closed on ${formatTimestamp(data.latestPriceData.t)}`}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    {/* <div className='mt-4 d-md-block'> */}
                        <div className="mt-4 flex-container">
                            <button className="btn btn-light d-md-none" onClick={() => scrollTabs('left')}><BiChevronLeft /></button>
                            <div className="overflow-auto">
                                <ul className="nav nav-tabs justify-content-between">
                                    {tabs.map((tab, index) => (
                                        <li key={tab} className={`nav-item ${index < scrollPosition || index >= scrollPosition + 3 ? 'd-none d-md-block' : ''}`}>
                                            {/* Hide the tabs based on scroll position */}
                                            <button className={`nav-link ${activeTab === tab ? 'active-tab' : 'inactive-tab'}`} onClick={() => setActiveTab(tab)}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button className="btn btn-light d-md-none" onClick={() => scrollTabs('right')}><BiChevronRight /></button>
                        </div>
                    {/* </div> */}
                        <div className="tab-content">
                            <div className={`tab-pane fade ${activeTab === 'summary' ? 'show active' : ''}`}>
                                <div className="row">
                                    {/* First column */}
                                    <div className="col-md-6">
                                        <p className="text-center text-md-left"><strong>High Price:</strong> {data.latestPriceData.h}</p>
                                        <p className="text-center text-md-left"><strong>Low Price:</strong> {data.latestPriceData.l}</p>
                                        <p className="text-center text-md-left"><strong>Open Price:</strong> {data.latestPriceData.o}</p>
                                        <p className="text-center text-md-left"><strong>Prev Price:</strong> {data.latestPriceData.pc}</p>
                                        <h4 style={{ textAlign: 'center', textDecoration: 'underline' }}>About the Company</h4><br></br>
                                        <p style={{ textAlign: 'center' }}><strong>IPO Start Date:</strong> {data.profileData.ipo}</p>
                                        <p style={{ textAlign: 'center' }}><strong>Industry:</strong> {data.profileData.finnhubIndustry}</p>
                                        <p style={{ textAlign: 'center' }}><strong>WebPage:</strong> <a href={data.profileData.weburl}>{data.profileData.weburl}</a></p>
                                        <p style={{ textAlign: 'center' }}><strong>Company Peers:</strong></p>
                                        <div style={{ textAlign: 'center', maxHeight: '200px', overflowY: 'scroll' }}>
                                            {data.peersData.map((peer, index) => (
                                                <span key={index}>
                                                    <a href={`/search/${peer}`}>{peer}</a>{index !== data.peersData.length - 1 ? ', ' : ''}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Second column */}
                                    <div className="col-md-6">
                                        {/* {JSON.stringify(data.historicalData,null,2)} */}
                                        {/* <p>{data.fromDate},{data.toDate}</p> */}
                                        <HourlyPriceChart chartData={data.polygonData} isGreen={data.latestPriceData.d > 0 ? 1 : 0}/>

                                    </div>
                                </div>
                            </div>
                            <div className={`tab-pane fade ${activeTab === 'topNews' ? 'show active' : ''}`}>
                                {/* Top News Tab Content */}
                            </div>
                            <div className={`tab-pane fade ${activeTab === 'charts' ? 'show active' : ''}`}>
                                {/* <p>{data.historicalData.results}</p> */}
                                
                                <ChartsTab historicalData={data.historicalData} latestPriceData={data.latestPriceData}/>

                            </div>
                            <div className={`tab-pane fade ${activeTab === 'insights' ? 'show active' : ''}`}>
                                {/* Insights Tab Content */}
                            </div>
                        </div>
                </div>
            </div>
            
            )}
        </div>
    );
}

export default SearchDetails;
