import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { FaFacebook } from 'react-icons/fa';
import {FaXTwitter} from 'react-icons/fa6';

const TopNewsTab = ({ newsData }) => {
    const [selectedNews, setSelectedNews] = useState(null);

    const handleOpenModal = (news) => {
        setSelectedNews(news);
    };

    const handleCloseModal = () => {
        setSelectedNews(null);
    };

    // Function to handle sharing on Twitter
const shareOnTwitter = (title, url) => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(tweetUrl, '_blank'); // Open Twitter in a new tab
};

// Function to handle sharing on Facebook
const shareOnFacebook = (url) => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, '_blank'); // Open Facebook in a new tab
};

    const formatDate = (datetime) => {
        if (!datetime) return '';
        const date = new Date(datetime *1000);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    // Filter and limit the newsData to display only the top 20 articles with images and headlines
    const filteredNewsData = newsData.filter(news => news.headline && news.image).slice(0, 20);

    return (
        <div style={{paddingTop: "20px"}}>
            <div className="row">
                {filteredNewsData.map((news, index) => (
                    <div key={index} className="col-md-6 mb-3">
                        <div className="card bg-light" onClick={() => handleOpenModal(news)} style={{ cursor: 'pointer', padding: "20px" }}>
                            <div className="row no-gutters">
                                <div className="col-4">
                                    <img src={news.image} className="card-img" alt={news.headline} height="100px" />
                                </div>
                                <div className="col-8">
                                    <div className="card-body">
                                        <h5 className="card-title">{news.headline}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal show={selectedNews !== null} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <div>
                        <Modal.Title>{selectedNews && selectedNews.source}</Modal.Title>
                        <p className='text-muted'>{selectedNews && formatDate(selectedNews.datetime)}</p>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <h3>{selectedNews && selectedNews.headline}</h3>
                    <p>{selectedNews && selectedNews.summary}</p>
                    <p>For more details, click <a href={selectedNews && selectedNews.url} target="_blank">here</a></p>
                    <div className="border p-3">
                        <p>Share</p>
                        <FaXTwitter className="mr-3" size={30} color="black" style={{ cursor: 'pointer'}} onClick={() => shareOnTwitter(selectedNews.headline, selectedNews.url)} /> {/* Adjust size and color */}
                        <FaFacebook size={30} color="blue" style={{ cursor: 'pointer'}} onClick={() => shareOnFacebook(selectedNews.url)} /> {/* Adjust size and color */}
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default TopNewsTab;
