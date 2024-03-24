import { combineReducers } from 'redux';
import searchReducer from './searchReducer';

const rootReducer = combineReducers({
    search: searchReducer,
    // Add more reducers here if needed
});

export default rootReducer;
