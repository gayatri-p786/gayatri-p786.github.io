import { SET_SEARCH_SYMBOL } from '../actions/searchActions';

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
                searchData: {
                    ...state.searchData,
                    [action.payload.symbol]: action.payload.data
                }
            };
        default:
            return state;
    }
};

export default searchReducer;
