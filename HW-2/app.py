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

    # Make a request to the Finnhub Stock API
    finnhub_api_key = 'cmuu051r01qru65i12s0cmuu051r01qru65i12sg'
    endpoint = f'https://finnhub.io/api/v1/stock/profile2?symbol={stock_ticker}&token={finnhub_api_key}'
    
    try:
        print(endpoint)
        response = requests.get(endpoint)
        data = response.json()
        print(data)
        # Return the API response to the client
        # return jsonify({'data':data}),200
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': f'Error fetching data from Finnhub API: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
