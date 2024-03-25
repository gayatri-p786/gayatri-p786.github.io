// Action types
export const SET_SEARCH_SYMBOL = 'SET_SEARCH_SYMBOL';
export const UPDATE_LATEST_PRICE_DATA = 'UPDATE_LATEST_PRICE_DATA';

// Action creators
export const setSearchSymbol = (symbol, data) => ({
    type: SET_SEARCH_SYMBOL,
    payload: {symbol,data}
});

export const updateLatestPriceData = (ticker, latestPriceData) => {
    return {
      type: UPDATE_LATEST_PRICE_DATA,
      payload: { ticker, latestPriceData },
    };
  };
