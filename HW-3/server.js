const express = require('express');
const axios = require('axios'); // Import the axios library
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get('/api/data', async (req, res) => {
    // console.log("hello");
    try {
        const finnhub_api_key = 'cmuu051r01qru65i12s0cmuu051r01qru65i12sg'; // Replace this with your Finnhub API key
        // console.log(finnhub_api_key);
        let stock_ticker = req.query.ticker;
        console.log(stock_ticker);
        
        // Construct the profile endpoint URL
        const profile_endpoint = `https://finnhub.io/api/v1/stock/profile2?symbol=${stock_ticker}&token=${finnhub_api_key}`;

        // Make a GET request to the profile endpoint
        const response = await axios.get(profile_endpoint);

        // Extract the data from the response
        const data = response.data;
        res.json(data);

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
