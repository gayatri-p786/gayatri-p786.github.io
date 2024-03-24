import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
import './styles.css';
import SearchLink from './SearchLink';

function Navbar() {
    const location = useLocation();
    // const ticker = useSelector(state => state.searchSymbol);
    // const searchData = useSelector(state => state.searchData);
    const [expanded, setExpanded] = useState(false);
    // const navigate = useNavigate();

    // function handleSearchLink() {
    //     // const ticker = useSelector(state => state.searchSymbol);
    //     // const searchData = useSelector(state => state.searchData);
    
    //     if (ticker && searchData[ticker]) {
    //         navigate(`/search/${ticker}`, { state: { searchData } });
    //     } else {
    //         navigate('/search/home');
    //     }
    // }

    

    return (
        <BootstrapNavbar bg="royalblue" variant="dark" expand="sm" sticky="top" style={{ padding: '8px 0' }} expanded={expanded}>
            <Container className="justify-content-between">
                <BootstrapNavbar.Brand as={Link} to="/">Stock Search</BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
                <BootstrapNavbar.Collapse id="basic-navbar-nav" className="collapse-content">
                <Nav>
                <SearchLink location={location}/>
                    {/* <Nav.Link as={Link} className={'active'} onClick={handleSearchLink}>Search</Nav.Link> */}
                    <Nav.Link as={Link} to="/watchlist" className={location.pathname === '/watchlist' ? 'active' : ''}>Watchlist</Nav.Link>
                    <Nav.Link as={Link} to="/portfolio" className={location.pathname === '/portfolio' ? 'active' : ''}>Portfolio</Nav.Link>
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
}

export default Navbar;


