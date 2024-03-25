const express = require('express');
const axios = require('axios'); // Import the axios library
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://patilgayatri086:EttCUjuvfbSdDta2@cluster0.grxcm5a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


app.use(cors());
app.use(express.json());

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
        sixMonthsAgo.setFullYear(currentDate.getFullYear() - 2);

        // Subtract 8 days
        const sixMonthsEightDaysAgo = new Date(sixMonthsAgo);
        sixMonthsEightDaysAgo.setDate(sixMonthsAgo.getDate() - 8);

        // Format the date (optional)
        const sixformattedDate = sixMonthsEightDaysAgo.toISOString().split('T')[0];

        // const currentDate = new Date();
        
        const utcTime = currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000); // Convert current time to UTC
        const estTime = new Date(utcTime + (3600000 * -4)); // Convert UTC time to EST
        const currentHour = estTime.getHours();

        const isWeekday = estTime.getDay() >= 1 && estTime.getDay() <= 5; // Monday to Friday

        let fromDate, toDate;
        if (isWeekday && currentHour >= 9 && currentHour < 16) { 
            console.log("open");// Market is open
            const yesterday = new Date(estTime);
            yesterday.setDate(yesterday.getDate() - 1);
            const formattedYesterday = yesterday.toISOString().split('T')[0]; // yyyy-mm-dd format
            fromDate = formattedYesterday;
            toDate = estTime.toISOString().split('T')[0]; // Today's date
        } else { // Market is closed
            console.log("closed");
            const currentHour = estTime.getHours();
            if (currentHour >= 16) { // Market closed after 4:00 pm EST
                // Set fromDate to one day before current date
                console.log("closed today");
                const yesterday = new Date(estTime);
                const today = new Date(estTime);
                yesterday.setDate(yesterday.getDate() - 2);
                today.setDate(today.getDate() - 1);
                const formattedYesterday = yesterday.toISOString().split('T')[0]; // yyyy-mm-dd format
                fromDate = formattedYesterday;
                toDate = today.toISOString().split('T')[0];
                // console.log(formattedYesterday, today);
            } else { // Market closed before 4:00 pm EST
                // Set fromDate to two days before current date
                console.log("closed yesterday");
                const twoDaysBeforeCurrent = new Date(estTime);
                twoDaysBeforeCurrent.setDate(twoDaysBeforeCurrent.getDate() - 3);
                const formattedTwoDaysBeforeCurrent = twoDaysBeforeCurrent.toISOString().split('T')[0];
        
                // Set toDate to one day before current date
                const oneDayBeforeCurrent = new Date(estTime);
                oneDayBeforeCurrent.setDate(oneDayBeforeCurrent.getDate() - 2);
                const formattedOneDayBeforeCurrent = oneDayBeforeCurrent.toISOString().split('T')[0];
        
                fromDate = formattedTwoDaysBeforeCurrent;
                toDate = formattedOneDayBeforeCurrent;
            }
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
        // console.log(profileData);
        
        return { profileData, historicalData, latestPriceData, newsData, recommendationData, sentimentData, peersData, earningsData, polygonData };
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to fetch data from Finnhub API');
    }
};

app.get('/api/profiledata', async (req, res) => {
    // console.log("hello");
    try {
         
        let stock_ticker = req.query.ticker;

        const latestPrice_endpoint = `https://finnhub.io/api/v1/quote?symbol=${stock_ticker}&token=${finnhub_api_key}`;
        
        console.log("endpoint",latestPrice_endpoint);
        const profileResponse = await axios.get(latestPrice_endpoint);
        console.log("responsedata",profileResponse.data)

        const data = handleNullValues(profileResponse.data);;
        console.log("15second data",data);
        res.json({data: data});
        
    } catch (error) {
        console.error('Error:', error);
        // Handle error (e.g., send error response)
        res.status(500).json({ error: 'Failed to fetch data from Finnhub API' });
    }
});

app.get('/api/user/watchlist', async (req, res) => {
    try {
        // Fetch user's watchlist from the database
        const db = client.db('StockProfiles');
        const usersCollection = db.collection('favorites');
        const existingUser = await usersCollection.findOne({});
        if (!existingUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json({ watchlist: existingUser.watchlist });
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        res.status(500).json({ error: 'Failed to fetch watchlist' });
    }
});

app.get('/api/user/portfolio', async (req, res) => {
    try {
        const db = client.db('StockProfiles');
        const usersCollection = db.collection('favorites');
        const user = await usersCollection.findOne({}); // Assuming only one user

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json({ portfolio: user.portfolio, money: user.wallet.money });
    } catch (error) {
        console.error('Error fetching portfolio:', error);
        res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
});

app.post('/api/user/money/update', async (req, res) => {
    try {
        const { money } = req.body; // New money value
        
        // Assuming only one user in the database
        const db = client.db('StockProfiles');
        const usersCollection = db.collection('favorites');
        const user = await usersCollection.findOne({});

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Update the money in the user's wallet
        const result = await usersCollection.updateOne(
            {},
            { $set: { 'wallet.money': money } }
        );

        if (result.modifiedCount === 1) {
            res.status(200).json({ message: 'Money in wallet updated successfully' });
        } else {
            res.status(500).json({ error: 'Failed to update money in wallet' });
        }
    } catch (error) {
        console.error('Error updating money in wallet:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// API endpoint to update user's watchlist
app.post('/api/user/addstockwatch', async (req, res) => {
    try {
        const { stock } = req.body;
        // console.log(stock);
        // Get the users collection
        const usersCollection = client.db('StockProfiles').collection('favorites');

        // Check if the stock symbol already exists in the watchlist
        const existingStock = await usersCollection.findOne({ 'watchlist.symbol': stock.symbol });

        if (!existingStock) {
            // Update the watchlist for the single user
            const result = await usersCollection.updateOne(
                {},
                { $push: { watchlist: stock } }
            );

            if (result.modifiedCount === 1) {
                console.log('Stock added to watchlist successfully.');
                res.status(200).json({ message: 'Stock added to watchlist successfully.' });
            } else {
                console.log('Failed to add stock to watchlist.');
                res.status(500).json({ error: 'Failed to add stock to watchlist.' });
            }
        } else {
            console.log('Stock already exists in watchlist.');
            res.status(400).json({ error: 'Stock already exists in watchlist.' });
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/api/user/removestockwatch', async (req, res) => {
    try {
        const { symbol } = req.body;
        console.log('Removing stock with symbol:', symbol);

        await client.connect();
        const usersCollection = client.db('StockProfiles').collection('favorites');

        // Remove the stock from the user's watchlist
        const result = await usersCollection.updateOne(
            {},
            { $pull: { watchlist: { symbol } } } // Remove the stock with the given symbol from the watchlist array
        );

        if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'Stock removed from watchlist' });
        } else {
            res.status(404).json({ error: 'Stock not found in watchlist' });
        }
    } catch (error) {
        console.error('Error removing stock from watchlist:', error);
        res.status(500).json({ error: 'Internal server error' });
    } 
});

// Update portfolio route
app.post('/api/user/portfolio/update', async (req, res) => {
    try {
        const { portfolio } = req.body;

        const db = client.db('StockProfiles');
        const usersCollection = db.collection('favorites');

        // Assuming only one user, so updating the portfolio directly
        const result = await usersCollection.updateOne(
            {}, // Update for all users
            { $set: { portfolio } }
        );

        res.json({ success: true, message: 'Portfolio updated successfully' });
    } catch (error) {
        console.error('Error updating portfolio:', error);
        res.status(500).json({ error: 'Failed to update portfolio' });
    }
});

// Insert portfolio route
app.post('/api/user/portfolio/insert', async (req, res) => {
    try {
        const { stock } = req.body;

        const db = client.db('StockProfiles');
        const usersCollection = db.collection('favorites');

        // Assuming only one user, so inserting the new stock directly
        const result = await usersCollection.updateOne(
            {}, // Update for all users
            { $push: { portfolio: stock } }
        );

        res.json({ success: true, message: 'Stock added to portfolio successfully' });
    } catch (error) {
        console.error('Error inserting stock to portfolio:', error);
        res.status(500).json({ error: 'Failed to add stock to portfolio' });
    }
});


app.post('/api/user/portfolio/remove', async (req, res) => {
    try {
        console.log("inside remove symbol");
        let symbol = req.query.ticker;
        const db = client.db('StockProfiles');
        const usersCollection = db.collection('favorites');
        console.log(symbol);
        // Update the portfolio array within the user object to remove the specified stock
        const result = await usersCollection.updateOne(
            { /* Add your user identifier here, such as user ID or username */ },
            { $pull: { portfolio: { symbol } } }
        );
        console.log(result);

        if (result.modifiedCount === 1) {
            res.status(200).json({ success: true, message: 'Stock removed from favorites successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Stock not found in favorites' });
        }
    } catch (error) {
        console.error('Error removing stock from favorites:', error);
        res.status(500).json({ success: false, message: 'Failed to remove stock from favorites' });
    }
});



app.get('/api/data', async (req, res) => {
    // console.log("hello");
    try {
         
        let stock_ticker = req.query.ticker;

        const data = await fetchFinnhubData(stock_ticker);
        // console.log(data);
        res.json(data);
        
    } catch (error) {
        console.error('Error:', error);
        // Handle error (e.g., send error response)
        res.status(500).json({ error: 'Failed to fetch data from Finnhub API' });
    }
});

// Define a route to fetch the current price
app.post('/api/current-prices', async (req, res) => {
    const symbols = req.body.symbols; // Assuming symbols is an array of stock symbols
    try {
        const promises = symbols.map(async symbol => {
            const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhub_api_key}`);
            return { [symbol]: response.data }; // Assuming 'c' is the key for current price in the API response
        });
        const results = await Promise.all(promises);
        const currentPrices = Object.assign({}, ...results);
        res.json(currentPrices);
    } catch (error) {
        console.error('Error fetching current prices:', error);
        res.status(500).json({ error: 'Failed to fetch current prices' });
    }
});


const client = new MongoClient(uri, {   useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const db = client.db('StockProfiles');
        const usersCollection = db.collection('favorites');

        // Check if a user exists
        const existingUser = await usersCollection.findOne({});
        if (existingUser) {
            // Reset user values to default
            await usersCollection.updateOne(
                {},
                {
                    $set: {
                        watchlist: [],
                        portfolio: [],
                        wallet: { money: parseFloat(25000.00) }
                    }
                }
            );
            console.log("User already exists. Resetting values to default.");
        } else {
            // Create new user with default values
            await usersCollection.insertOne({
                watchlist: [],
                portfolio: [],
                wallet: { money: 25000 }
            });
            console.log("New user created with default values.");
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});