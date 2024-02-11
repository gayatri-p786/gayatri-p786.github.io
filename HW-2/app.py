from flask import Flask, render_template, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

@app.route('/')
def index():
    return render_template('index.html')

#API KEY = cmuu051r01qru65i12s0cmuu051r01qru65i12sg

@app.route('/search_stock', methods=['GET'])
def search_stock():
    stock_ticker = request.args.get('stock_ticker')
    
    if not stock_ticker:
        return jsonify({'error': 'Stock ticker is required'}), 400

    # Make a request to the Finnhub Stock API for profile data
    finnhub_api_key = 'cmuu051r01qru65i12s0cmuu051r01qru65i12sg'
    profile_endpoint = f'https://finnhub.io/api/v1/stock/profile2?symbol={stock_ticker}&token={finnhub_api_key}'
    
    try:
        profile_response = requests.get(profile_endpoint)
        profile_data = profile_response.json()
    except Exception as e:
        return jsonify({'error': f'Error fetching profile data from Finnhub API: {str(e)}'}), 500

    # Make a request to the Finnhub Quote API for quote data
    quote_endpoint = f'https://finnhub.io/api/v1/quote?symbol={stock_ticker}&token={finnhub_api_key}'
    
    try:
        quote_response = requests.get(quote_endpoint)
        quote_data = quote_response.json()
    except Exception as e:
        return jsonify({'error': f'Error fetching quote data from Finnhub API: {str(e)}'}), 500
    
    # Make a request to the Finnhub Quote API for recommendation data
    rec_endpoint = f'https://finnhub.io/api/v1/stock/recommendation?symbol={stock_ticker}&token={finnhub_api_key}'
    
    try:
        rec_response = requests.get(rec_endpoint)
        rec_data = rec_response.json()
        latest_data = max(rec_data, key=lambda x: x['period'])

        # print("Latest Data:")
        # print(latest_data)
        # print(rec_data[0])
    except Exception as e:
        return jsonify({'error': f'Error fetching quote data from Finnhub API: {str(e)}'}), 500

    # Combine profile and quote data and return to the client
    combined_data = {'profile': profile_data, 'quote': quote_data, 'recommendation':latest_data}
    return jsonify(combined_data)

if __name__ == '__main__':
    app.run(debug=True)
