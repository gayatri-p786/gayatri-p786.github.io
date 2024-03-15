const express = require('express');
const axios = require('axios'); // Import the axios library
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
const polygon_api_key = 'g6094_mtCEzO0IDnhM81rnPP9Zio8AYV';
const finnhub_api_key = 'cmuu051r01qru65i12s0cmuu051r01qru65i12sg';

// Function to handle null values in response data
const handleNullValues = (data) => {
    for (const key in data) {
        if (data[key] === null) {
            data[key] = 0;
        }
    }
    return data;
};

// Fetch data from Finnhub API endpoints
const fetchFinnhubData = async (stock_ticker) => {
    try {

        // Get current date
        const currentDate = new Date();

        // Get date 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Format dates (optional)
        const formattedCurrentDate = currentDate.toISOString().split('T')[0]; // yyyy-mm-dd format
        const formattedThirtyDaysAgo = thirtyDaysAgo.toISOString().split('T')[0]; // yyyy-mm-dd format

        // Subtract 6 months
        const sixMonthsAgo = new Date(currentDate);
        sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

        // Subtract 8 days
        const sixMonthsEightDaysAgo = new Date(sixMonthsAgo);
        sixMonthsEightDaysAgo.setDate(sixMonthsAgo.getDate() - 8);

        // Format the date (optional)
        const sixformattedDate = sixMonthsEightDaysAgo.toISOString().split('T')[0];

        const currentHour = currentDate.getHours();
        const isWeekday = currentDate.getDay() >= 1 && currentDate.getDay() <= 5; // Monday to Friday

        let fromDate, toDate;
        if (isWeekday && currentHour >= 9 && currentHour < 16) { // Market is open
            const yesterday = new Date(currentDate);
            yesterday.setDate(yesterday.getDate() - 1);
            const formattedYesterday = yesterday.toISOString().split('T')[0]; // yyyy-mm-dd format
            fromDate = formattedYesterday;
            toDate = currentDate.toISOString().split('T')[0]; // Today's date
        } else { // Market is closed
            const previousClose = new Date(currentDate);
            previousClose.setDate(previousClose.getDate() - 1);
            previousClose.setHours(16, 0, 0, 0); // Set time to market close (4:00 pm EST)
            const onemore = new Date(currentDate);
            onemore.setDate(previousClose.getDate() - 1);
            const formattedPreviousClose = previousClose.toISOString().split('T')[0]; // yyyy-mm-dd format
            const formattedoneprior = onemore.toISOString().split('T')[0];
            fromDate = formattedoneprior;
            toDate = formattedPreviousClose; 
        }
        // console.log(fromDate,toDate);


        const profile_endpoint = `https://finnhub.io/api/v1/stock/profile2?symbol=${stock_ticker}&token=${finnhub_api_key}`;
        const historical_endpoint = `https://api.polygon.io/v2/aggs/ticker/${stock_ticker}/range/1/day/${sixformattedDate}/${formattedCurrentDate}?adjusted=true&sort=asc&apiKey=${polygon_api_key}`;
        const latestPrice_endpoint = `https://finnhub.io/api/v1/quote?symbol=${stock_ticker}&token=${finnhub_api_key}`;
        const news_endpoint = `https://finnhub.io/api/v1/company-news?symbol=${stock_ticker}&from=${formattedThirtyDaysAgo}&to=${formattedCurrentDate}&token=${finnhub_api_key}`;
        const recommendation_endpoint = `https://finnhub.io/api/v1/stock/recommendation?symbol=${stock_ticker}&token=${finnhub_api_key}`;
        const sentiment_endpoint = `https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${stock_ticker}&from=2022-01-01&token=${finnhub_api_key}`;
        const peers_endpoint = `https://finnhub.io/api/v1/stock/peers?symbol=${stock_ticker}&token=${finnhub_api_key}`;
        const earnings_endpoint = `https://finnhub.io/api/v1/stock/earnings?symbol=${stock_ticker}&token=${finnhub_api_key}`;
        const polygon_endpoint = `https://api.polygon.io/v2/aggs/ticker/${stock_ticker}/range/1/hour/${fromDate}/${toDate}?adjusted=true&sort=asc&apiKey=${polygon_api_key}`;
        // console.log(polygon_endpoint);
        
        const profileResponse = await axios.get(profile_endpoint);
        const historicalResponse = await axios.get(historical_endpoint);
        const latestPriceResponse = await axios.get(latestPrice_endpoint);
        const newsResponse = await axios.get(news_endpoint);
        const recommendationResponse = await axios.get(recommendation_endpoint);
        const sentimentResponse = await axios.get(sentiment_endpoint);
        const peersResponse = await axios.get(peers_endpoint);
        const earningsResponse = await axios.get(earnings_endpoint);
        const polygonResponse = await axios.get(polygon_endpoint);
        // Fetch data from additional endpoints
        
        const profileData = handleNullValues(profileResponse.data);
        const historicalData = handleNullValues(historicalResponse.data);
        const latestPriceData = handleNullValues(latestPriceResponse.data);
        const newsData = handleNullValues(newsResponse.data);
        const recommendationData = handleNullValues(recommendationResponse.data);
        const sentimentData = handleNullValues(sentimentResponse.data);
        const peersData = handleNullValues(peersResponse.data);
        const earningsData = handleNullValues(earningsResponse.data);
        const polygonData = handleNullValues(polygonResponse.data);
        // Handle data from additional endpoints
        
        return { profileData, historicalData, latestPriceData, newsData, recommendationData, sentimentData, peersData, earningsData, polygonData };
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to fetch data from Finnhub API');
    }
};

app.get('/api/data', async (req, res) => {
    // console.log("hello");
    try {
         
        let stock_ticker = req.query.ticker;

        const data = await fetchFinnhubData(stock_ticker);
        // console.log(data);
        res.json(data);
        // console.log(stock_ticker);
        
        // Construct the profile endpoint URL
        // const promises = [
        //     axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${stock_ticker}&token=${finnhub_api_key}`),
        //     axios.get(`https://api.polygon.io/v2/aggs/ticker/${stock_ticker}/range/1/day/2023-01-09/2023-07-09?adjusted=true&sort=asc&apiKey=your_polygon_api_key`),
        //     axios.get(`https://finnhub.io/api/v1/quote?symbol=${stock_ticker}&token=${finnhub_api_key}`),
        //     axios.get(`https://finnhub.io/api/v1/company-news?symbol=${stock_ticker}&from=<DATE>&to=<DATE>&token=${finnhub_api_key}`),
        //     axios.get(`https://finnhub.io/api/v1/stock/recommendation?symbol=${stock_ticker}&token=${finnhub_api_key}`),
        //     axios.get(`https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${stock_ticker}&from=2022-01-01&token=${finnhub_api_key}`),
        //     axios.get(`https://finnhub.io/api/v1/stock/peers?symbol=${stock_ticker}&token=${finnhub_api_key}`),
        //     axios.get(`https://finnhub.io/api/v1/stock/earnings?symbol=${stock_ticker}&token=${finnhub_api_key}`)
        // ];

        // // Wait for all promises to resolve
        // const responses = await Promise.all(promises);

        // // Extract data from each response
        // const data = responses.map(response => response.data);

        // // Send the combined data back to the client
        // res.json(data);

        // Send the data back to the client
        // console.log(`/search/${stock_ticker}?data=${encodeURIComponent(JSON.stringify(data))}`);
        // res.redirect(302, `http://localhost:3000/search/${stock_ticker}?data=${encodeURIComponent(JSON.stringify(data))}`);
   
    } catch (error) {
        console.error('Error:', error);
        // Handle error (e.g., send error response)
        res.status(500).json({ error: 'Failed to fetch data from Finnhub API' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
