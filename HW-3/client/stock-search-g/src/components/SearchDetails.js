import React, { useState }  from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import { BiCaretUp, BiCaretDown, BiStar } from 'react-icons/bi'; 
import HourlyPriceChart from './HourlyPriceChart';
import './styles.css'; // Import the CSS file

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

    return (
        <div className="container">
            <SearchBar initialTicker={data.profileData.ticker} />
            {data && (
            <div>
                <div className="row mt-4 justify-content-center">
                    <div className="col-md-4 text-center">
                        <div className="company-info">
                            <h2>
                                {data.profileData.ticker}<BiStar /> 
                            </h2>
                            <h3>{data.profileData.name}</h3>
                            <p>{data.profileData.exchange}</p>
                            <button className="btn btn-success">Buy</button>
                        </div>
                    </div>
                    <div className="col-md-4 text-center">
                        <img src={data.profileData.logo} alt="Company Logo" className="img-fluid" />
                    </div>
                    <div className="col-md-4 text-center">
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
                        <ul className="nav nav-tabs justify-content-between">
                            <li className="nav-item">
                                <button className={`nav-link ${activeTab === 'summary' ? 'active-tab' : 'inactive-tab'}`} onClick={() => setActiveTab('summary')}>Summary</button>
                            </li>
                            <li className="nav-item">
                                <button className={`nav-link ${activeTab === 'topNews' ? 'active-tab' : 'inactive-tab'}`} onClick={() => setActiveTab('topNews')}>Top News</button>
                            </li>
                            <li className="nav-item">
                                <button className={`nav-link ${activeTab === 'charts' ? 'active-tab' : 'inactive-tab'}`} onClick={() => setActiveTab('charts')}>Charts</button>
                            </li>
                            <li className="nav-item">
                                <button className={`nav-link ${activeTab === 'insights' ? 'active-tab' : 'inactive-tab'}`} onClick={() => setActiveTab('insights')}>Insights</button>
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div className={`tab-pane fade ${activeTab === 'summary' ? 'show active' : ''}`}>
                                <div className="row">
                                    {/* First column */}
                                    <div className="col-md-6">
                                        <p><strong>High Price:</strong> {data.latestPriceData.h}</p>
                                        <p><strong>Low Price:</strong> {data.latestPriceData.l}</p>
                                        <p><strong>Open Price:</strong> {data.latestPriceData.o}</p>
                                        <p><strong>Prev Price:</strong> {data.latestPriceData.pc}</p>
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
                                        <HourlyPriceChart historicalData={data.historicalData} isMarketOpen={isMarketOpen()} />
                                        
                                    </div>
                                </div>
                            </div>
                            <div className={`tab-pane fade ${activeTab === 'topNews' ? 'show active' : ''}`}>
                                {/* Top News Tab Content */}
                            </div>
                            <div className={`tab-pane fade ${activeTab === 'charts' ? 'show active' : ''}`}>
                                {/* Charts Tab Content */}
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
