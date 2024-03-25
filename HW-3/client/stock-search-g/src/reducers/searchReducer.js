import { SET_SEARCH_SYMBOL, UPDATE_LATEST_PRICE_DATA } from '../actions/searchActions';

const initialState = {
    searchSymbol: '',
    searchData: {}
};

const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SEARCH_SYMBOL:
            return {
                ...state,
                searchSymbol: action.payload.symbol,
                searchData: action.payload.data
            };
        
        case UPDATE_LATEST_PRICE_DATA:
            const { ticker, latestPriceData } = action.payload;
            return {
                ...state,
                searchData: {
                        ...state.searchData,
                        latestPriceData: latestPriceData,
                    },
            };

        default:
            return state;
    }
};

export default searchReducer;
