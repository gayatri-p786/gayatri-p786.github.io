from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
from datetime import datetime
from dateutil.relativedelta import relativedelta
# from projekt.wsgi import main as app


app = Flask(__name__,static_url_path='')
CORS(app) 

@app.route('/')
def index():
    return app.send_static_file('index.html')

#API KEY = cmuu051r01qru65i12s0cmuu051r01qru65i12sg
finnhub_api_key = 'cmuu051r01qru65i12s0cmuu051r01qru65i12sg'

@app.route('/search_stock', methods=['GET'])
def search_stock():
    stock_ticker = request.args.get('stock_ticker')
    
    if not stock_ticker:
        return jsonify({'error': 'Stock ticker is required'}), 400

    # Make a request to the Finnhub Stock API for profile data
    profile_endpoint = f'https://finnhub.io/api/v1/stock/profile2?symbol={stock_ticker}&token={finnhub_api_key}'
    
    try:
        profile_response = requests.get(profile_endpoint)
        profile_data = profile_response.json()
    except Exception as e:
        return jsonify({'error': f'Error fetching profile data from Finnhub API: {str(e)}'}), 500
    
    # Make a request to the Finnhub Quote API for recommendation data
    quote_data=get_quote_data(stock_ticker)

    # Make a request to the Finnhub Recommendation API for recommendation data
    latest_data=get_rec_data(stock_ticker)

    # Make a request to the Finnhub News API for recommendation data
    latest_news=get_news_data(stock_ticker)
    # Combine profile and quote data and return to the client

    charts=get_chart_data(stock_ticker)
    # print(profile_data,quote_data,latest_news)
    combined_data = {'profile': profile_data, 'quote': quote_data, 'recommendation':latest_data, 'news':latest_news, 'chart':charts}
    return jsonify(combined_data)

def get_quote_data(stock_ticker):
     # Make a request to the Finnhub Quote API for quote data
    quote_endpoint = f'https://finnhub.io/api/v1/quote?symbol={stock_ticker}&token={finnhub_api_key}'
    
    try:
        quote_response = requests.get(quote_endpoint)
        quote_data = quote_response.json()
        return quote_data
    except Exception as e:
        return jsonify({'error': f'Error fetching quote data from Finnhub API: {str(e)}'}), 500
    

def get_rec_data(stock_ticker):
    rec_endpoint = f'https://finnhub.io/api/v1/stock/recommendation?symbol={stock_ticker}&token={finnhub_api_key}'
    
    try:
        rec_response = requests.get(rec_endpoint)
        rec_data = rec_response.json()
        latest_data = max(rec_data, key=lambda x: x['period'])
        return latest_data
    except Exception as e:
        return jsonify({'error': f'Error fetching quote data from Finnhub API: {str(e)}'}), 500

def get_news_data(stock_ticker):
     # Make a request to the Finnhub Quote API for quote data
    # Get the current date
    current_date = datetime.now()

    # Calculate the date 30 days prior to the current date
    prior_date = current_date - relativedelta(days=30)

    # Format dates to YYYY-MM-DD format
    current_date_str = current_date.strftime("%Y-%m-%d")
    prior_date_str = prior_date.strftime("%Y-%m-%d")

    news_endpoint = f'https://finnhub.io/api/v1/company-news?symbol={stock_ticker}&from={prior_date_str}&to={current_date_str}&token={finnhub_api_key}'
    # print(news_endpoint)
    try:
        news_response = requests.get(news_endpoint)
        news_data = news_response.json()
        # print(news_data)
        filtered_articles = []
        count = 0
        for article in news_data:
            if all(key in article and article[key] for key in ['image', 'url', 'headline', 'datetime']):
                filtered_articles.append(article)
                count += 1
                if count == 5:
                    break
        # print(filtered_articles)
        return filtered_articles
        
    except Exception as e:
        return jsonify({'error': f'Error fetching quote data from Finnhub API: {str(e)}'}), 500

# @app.route('/get_chart', methods=['GET'])
def get_chart_data(stock_ticker):
    polygon_api_key = 'g6094_mtCEzO0IDnhM81rnPP9Zio8AYV'
    current_date = datetime.now()

    # Calculate the date 30 days prior to the current date
    prior_date = current_date - relativedelta(months=6, days=8)

    # Format dates to YYYY-MM-DD format
    current_date_str = current_date.strftime("%Y-%m-%d")
    prior_date_str = prior_date.strftime("%Y-%m-%d")

    chart_endpoint = f'https://api.polygon.io/v2/aggs/ticker/{stock_ticker}/range/1/day/{prior_date_str}/{current_date_str}?adjusted=true&sort=asc&apiKey={polygon_api_key}'
    print(chart_endpoint)
    try:
        chart_response = requests.get(chart_endpoint)
        chart_data = chart_response.json()
        # Initialize arrays for data points
        price_points = []
        volume_points=[]

        # Iterate through results array
        for result in chart_data["results"]:
            # Get date (timestamp) and close price
            date = result["t"]  # Convert timestamp to seconds
            close_price = result["c"]
            vol= result["v"]
            # Create data point
            price_point = [date, close_price]
            volume_point = [date, vol]
            # Append data point to data points array
            price_points.append(price_point)
            volume_points.append(volume_point)
        # print(chart_data)
        
        charts_data={"price":price_points,"volume":volume_points}
        return charts_data
    except Exception as e:
        return jsonify({'error': f'Error fetching quote data from Finnhub API: {str(e)}'}), 500


if __name__ == '__main__':
    # app.run(debug=True)
    app.run(debug=False, host="127.0.0.1", port=5000)



#Things to do:
# 1. required field on empty search Done
# 2. color gradient for charts
# 3. zoom levels for charts
# 4. sticker value stays when fetched data displayed
##### DONE #########

#Things to do Part 2:
# 1. call clear display first even on search
# 2. find stock even for lower case
    ####### Done ######
# 3. fix 6m zoom level