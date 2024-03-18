import React, { useState }  from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import { BiCaretUp, BiCaretDown, BiStar, BiChevronLeft, BiChevronRight } from 'react-icons/bi'; 
import HourlyPriceChart from './HourlyPriceChart';
import ChartsTab from './chartsTab';
import './styles.css'; // Import the CSS file
import axios from 'axios';

function SearchDetails() {
    const location = useLocation();
    const data = location.state?.data; // Get the data passed from the server
    
    // const { profileData, historicalData, latestPriceData, newsData, recommendationData, sentimentData, peersData, earningsData } = data;
    const ticker = data.profileData.ticker;

    // Function to check if the market is open based on timestamp
    const isMarketOpen = (timestamp) => {
        // Convert timestamp to milliseconds
        const milliseconds = timestamp * 1000;
        // Get the current time in milliseconds
        const currentTime = new Date().getTime();
        // Calculate the difference in minutes
        const diffMinutes = (currentTime - milliseconds) / (1000 * 60);
        // Market is open if less than 5 minutes have elapsed from the timestamp
        return diffMinutes <= 5;
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
        setStarClicked(!starClicked); // Toggle the state
        addToWatchlist();
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


    // Function to handle adding a stock to the watchlist
    const addToWatchlist = async () => {
        const watchlistStock = {
            symbol: data.profileData.ticker,
            companyName: data.profileData.name,
            stockPrice: data.latestPriceData.c,
            stockChange: data.latestPriceData.d,
        };
        try {
            // Make a POST request to the server to add the stock to the watchlist
            const response = await axios.post(`http://${window.location.hostname}:5000/api/user/addstockwatch`, { stock: watchlistStock });

            // Check if the request was successful
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

    return (
        <div className="container">
            <div className="text-center heading">
                <h1>Stock Search</h1>
            </div>

            <SearchBar initialTicker={data.profileData.ticker} />

            {data && (
            <div className='content-container'>
                <div className="row mt-4 justify-content-center">
                    <div className="col-4 text-center">
                        <div className="company-info">
                            <h2>{data.profileData.ticker}
                                <button className={`star-button ${starClicked ? 'star-yellow' : ''}`} onClick={handleStarClick}>
                                    <BiStar />
                                </button>
                            </h2>
                            <h3>{data.profileData.name}</h3>
                            <p>{data.profileData.exchange}</p>
                            <button className="btn btn-success">Buy</button>
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
                        
                        <p>{formatTimestamp(data.latestPriceData.t)}</p>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-4 text-center">
                        <div style={{ fontWeight: 'bold', color: isMarketOpen() ? 'green' : 'red' }}>
                            <span>{isMarketOpen() ? 'Market Open on ' : 'Market Closed on '}{formatTimestamp(data.latestPriceData.t)}</span>
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
