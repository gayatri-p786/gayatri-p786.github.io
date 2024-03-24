import React from 'react';
import { Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchLink = ({ location }) => {
    let ticker = useSelector(state => {
        console.log('State: ', state);
        return state.search.searchSymbol;
      });
    // let ticker = useSelector(state => {
    //     console.log('State: ', state);
    //     state.searchSymbol;});
    const searchData = useSelector(state => state.search.searchData);
    const navigate = useNavigate();

    const handleSearchLinkClick = () => {
        
        console.log("in search",ticker,searchData);
        if (ticker && searchData[ticker]) {
            navigate(`/search/${ticker}`, { state: { data: searchData[ticker] } });
        } else {
            navigate("/search/home");
        }
    };

    return (
        <Nav.Link onClick={handleSearchLinkClick} className={location.pathname === '/search/home' ? 'active' : ''}>Search</Nav.Link>
    );
};

export default SearchLink;
