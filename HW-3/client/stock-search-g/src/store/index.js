import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from "@redux-devtools/extension";
import {thunk} from 'redux-thunk'; // If using thunk middleware
import rootReducer from '../reducers';

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk)) // Apply middleware like thunk
);

export default store;
