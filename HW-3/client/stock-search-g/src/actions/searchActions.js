// Action types
export const SET_SEARCH_SYMBOL = 'SET_SEARCH_SYMBOL';

// Action creators
export const setSearchSymbol = (symbol, data) => ({
    type: SET_SEARCH_SYMBOL,
    payload: {symbol,data}
});
