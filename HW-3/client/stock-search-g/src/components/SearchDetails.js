import React, { useState, useEffect }  from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import { BiCaretUp, BiCaretDown, BiStar, BiChevronLeft, BiChevronRight } from 'react-icons/bi'; 
import { AiFillStar} from 'react-icons/ai';
import HourlyPriceChart from './HourlyPriceChart';
import TabCharts from './TabCharts';
import './styles.css'; // Import the CSS file
import axios from 'axios';
import BuyModal from './BuyModal';
import SellModal from './SellModal';
import InsightsTab from './InsightsTab';
import TopNewsTab from './TopNews';
import { Alert } from 'react-bootstrap'; // Import Alert from react-bootstrap for displaying messages
import ChartsTab from './chartsTab';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchSymbol, updateLatestPriceData } from '../actions/searchActions';


function SearchDetails() {
    const location = useLocation();
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const ticker = location.state?.symbol
    const data = useSelector(state => state.search.searchData);

    console.log("new ticker",ticker);

    // console.log("ticker in details", ticker);
    // console.log("data in details",data);
    // const latestPriceData = data?.latestpricedata;

    // const ticker = location.state?.ticker;
    // const data = useSelector(state => state.search.searchData);
    // const [latestPriceData, setData] = useState(data[ticker].latestPriceData);
    // const [previousData, setPreviousData] = useState(null); // Get the data passed from the server
    // const [data.latestPriceData, setdata.latestPriceData] = useState(latestPriceData || previousData);
    // console.log("data",data);
    // console.log("latestPrice",latestPriceData);
    // console.log("display",data.latestPriceData,"previous",previousData);
    // const { profileData, historicalData, latestPriceData, newsData, recommendationData, sentimentData, peersData, earningsData } = data;
    
    const [hasStock, setHasStock] = useState(false);
    const [existQuantity, setExistQuantity] = useState(0);
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [showSellModal, setShowSellModal] = useState(false);
    const [money, setMoney] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [watchlist, setWatchlist] = useState([]);
    const [showSellButton, setShowSellButton] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [buySuccess, setBuySuccess] = useState(false);
    const [sellSuccess, setSellSuccess] = useState(false);

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

      const handleSymbolClick = async (symbol) => {
        try {
            const response = await fetch(`http://${window.location.hostname}:5000/api/data?ticker=${symbol}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            dispatch(setSearchSymbol(symbol, data));
            // await new Promise((resolve, reject) => {
            //     dispatch(setSearchSymbol(symbol, data));
            //     resolve(); // Resolve the promise after dispatch completes
            // });
            navigate(`/search/${symbol}`, { state: { symbol } });
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('No data found. Please enter a valid ticker.');
        }
    };
    

    useEffect(() => {
        // Fetch user's portfolio from MongoDB
        const fetchPortfolio = async () => {
            try {
                const response = await axios.get(`http://${window.location.hostname}:5000/api/user/portfolio`);
                const portfolio = response.data;
                const hasStock = portfolio.portfolio.some(item => item.symbol === ticker);
                setHasStock(hasStock);
                setShowSellButton(hasStock);
                setMoney(portfolio.money);
                const stock = portfolio.portfolio.find(item => item.symbol === ticker);
                if (stock) {
                    setExistQuantity(stock.quantity);
                } else {
                    // If the stock doesn't exist in the portfolio, set quantity to 0
                    setExistQuantity(0);
                }
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
            stockdp: data.latestPriceData.dp
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
                setAlertMessage(`${symbol} removed from Watchlist succesfully`);
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
            // console.log(marketOpenTime,marketCloseTime,estTime);
    
            return estTime >= marketOpenTime && estTime <= marketCloseTime;
        }
    
        // Return false for weekends
        return false;
    };
    
    

    // Function to format timestamp to yyyy-mm-dd hh:mm:ss format
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

     // State to manage active tab
    const [activeTab, setActiveTab] = useState('summary');
    const [starClicked, setStarClicked] = useState(false); 

    useEffect(() => {
        const stockSymbol = data.profileData.ticker;
        const isStockInWatchlist = watchlist.some(item => item.symbol === stockSymbol);
        setStarClicked(isStockInWatchlist);
    }, [watchlist]);
    

    const handleStarClick = () => {
        setStarClicked(prevStarClicked => !prevStarClicked); // Toggle the starClicked state
        setShowAlert(true); // Show the alert
        setTimeout(() => setShowAlert(false), 3000); // Toggle the state
    };

    

    // useEffect(() => {
    //     const interval = setInterval(async () => {
    //         // if (isMarketOpen()) {
    //             try {
    //                 const response = await axios.get(`http://${window.location.hostname}:5000/api/profiledata`);
    //                 const responseData = response.data;
    //                 setPreviousData(data.latestPriceData); // Set the current data as previous data
    //                 setData(responseData.data);
    //                 dispatch(updateLatestPriceData(responseData.data.latestPriceData)); // Set new data
    //             } catch (error) {
    //                 console.error('Error fetching data:', error);
    //                 setErrorMessage('Failed to fetch data');
    //             }
    //             // try {
    //             //     const response = await axios.get(`http://${window.location.hostname}:5000/api/profiledata?ticker=${data.profileData.ticker}`);
    //             //     console.log("15 second response",response);
    //             //     if (response.status !=200) {
    //             //         throw new Error('Failed to fetch data');
    //             //     }
    //             //     const newData = response.data.data;
    //             //     setData(prevData => ({ ...prevData, profileData: newData.profileData }));
    //             // } catch (error) {
    //             //     console.error('Error fetching updated data:', error);
    //             //     setErrorMessage('Failed to fetch updated data');
    //             // }
    //         // }
    //     }, 15000); // Fetch data every 15 seconds

    //     return () => clearInterval(interval); // Cleanup the interval on component unmount
    // }, []);

    // useEffect(() => {
    //     setdata.latestPriceData(latestPriceData || previousData); // Update data.latestPriceData whenever data or previousData changes
    // }, [latestPriceData, previousData]);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (isMarketOpen()) {
            try {
                const response = await axios.get(`http://${window.location.hostname}:5000/api/profiledata?ticker=${ticker}`);
                const responseData = response.data;
                dispatch(updateLatestPriceData(ticker, responseData.data)); // Update latest price data in Redux store
            } catch (error) {
                console.error('Error fetching data:', error);
                setErrorMessage('Failed to fetch data');
            }
        }
        }, 15000); // Fetch data every 15 seconds

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, [dispatch, ticker]);
    
    useEffect(() => {
        const stockSymbol = data.profileData.ticker;
        const isStockInWatchlist = watchlist.some(item => item.symbol === stockSymbol);
        if (starClicked) {
            setAlertMessage(`${ticker} added to Watchlist successfully!`);
            addToWatchlist();
        } else {
            if (isStockInWatchlist) {
                setAlertMessage(`${ticker} removed from Watchlist successfully!`);
                removeFromWatchlist(stockSymbol);
            }
        }
    }, [starClicked]);
    

    // Function to handle buy button click
    const handleBuyClick = () => {
        setShowBuyModal(true);
        setShowAlert(true);
        setShowSellButton(true);
        setAlertMessage(`${ticker} bought successfully!`);
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

    const handleSellClick = () => {
        setShowSellModal(true);
        setShowAlert(true);
        setAlertMessage(`${ticker} sold successfully!`);
    };

    const handleSell = (ticker, sellQuantity) => {
        // Implement sell functionality
        console.log(`Selling ${sellQuantity} shares of ${ticker}`);
        setShowSellModal(false);
    };

    const handleCloseSellModal = () => {
        setShowSellModal(false);
    };

    const handleSuccessfulBuy = () => {
        setBuySuccess(true);
        setTimeout(() => {
            setBuySuccess(false);
        }, 3000);
        // setReloadPortfolio(prevState => !prevState);
    };

    const handleSuccessfulSell = () => {
        setSellSuccess(true);
        setTimeout(() => {
            setSellSuccess(false);
        }, 3000);
        // setReloadPortfolio(prevState => !prevState);
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


    const renderContent = () => {
        if (!data) {
            return <Alert variant="danger">{errorMessage}</Alert>;
        }

        return (
            <div>
                <SearchBar initialTicker={ticker} dropdown={false} />
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            {showAlert && starClicked && (
                <Alert variant="success" className='text-center'>
                    {alertMessage}
                </Alert>
            )}

                {buySuccess && (
                    <Alert variant="success" className="text-center">
                        {data.profileData.ticker} bought successfully!
                    </Alert>
                )}
                {sellSuccess && (
                    <Alert variant="danger" className="text-center">
                        {data.profileData.ticker} sold successfully!
                    </Alert>
                )}
                
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
                            {showSellButton && <button className="btn btn-danger" onClick={handleSellClick} style={{marginLeft:"0.5em"}}>Sell</button>}
                            <BuyModal
                                            show={showBuyModal}
                                            onHide={handleCloseBuyModal}
                                            ticker={data.profileData.ticker}
                                            company={data.profileData.name}
                                            currentPrice={data.latestPriceData.c}
                                            moneyInWallet={money}
                                            handleCloseBuyModal={handleCloseBuyModal}
                                            handleBuySuccess={handleSuccessfulBuy}
                                        />
                                        <SellModal
                                            show={showSellModal}
                                            onHide={handleCloseSellModal}
                                            ticker={data.profileData.ticker}
                                            existingQuantity={existQuantity}
                                            currentPrice={data.latestPriceData.c}
                                            moneyInWallet={money}
                                            handleCloseSellModal={handleCloseSellModal}
                                            handleSellSuccess={handleSuccessfulSell}
                                        />
                        </div>
                    </div>
                    <div className="col-4 text-center">
                        <div className="company-logo-container">
                            <img src={data.profileData.logo} alt="Company Logo" height="100px" />
                        </div>
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
                                {isMarketOpen() ? `Market is open` : `Market closed on ${formatTimestamp(data.latestPriceData.t)}`}
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
                                                    <a href="#" onClick={() => handleSymbolClick(peer)}>{peer}</a>
                                                    {index !== data.peersData.length - 1 ? ', ' : ''}
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
                                <TopNewsTab newsData={data.newsData}/>

                            </div>
                            <div className={`tab-pane fade ${activeTab === 'charts' ? 'show active' : ''}`}>
                                {/* <p>{data.historicalData.results}</p> */}
                                
                                <ChartsTab historicalData={data.historicalData} latestPriceData={data.latestPriceData}/>

                            </div>
                            <div className={`tab-pane fade ${activeTab === 'insights' ? 'show active' : ''}`}>
                                <InsightsTab sentimentData={data.sentimentData} earningData={data.earningsData} ticker={data.profileData.ticker} recommendationData={data.recommendationData} />
                            </div>
                        </div>
                </div>
            </div>
            </div>
            
        );
    };


   

    return (
        <div className="container">
            <div className="text-center heading">
                <h1>Stock Search</h1>
            </div>

            
                {renderContent()}

            {/* {data && (
            
            )} */}
        </div>
    );
}

export default SearchDetails;
