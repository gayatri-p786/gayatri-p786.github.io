import { Nav, Navbar as BootstrapNavbar, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import './styles.css';

function Navbar() {
    const location = useLocation();

    return (
        <BootstrapNavbar bg="royalblue" variant="dark" sticky="top" style={{ padding: '8px 0' }}>
            <Container className="d-flex justify-content-between align-items-center">
                <BootstrapNavbar.Brand as={Link} to="/">Stock Search</BootstrapNavbar.Brand>
                <Nav>
                    <Nav.Link as={Link} to="/search/home" className={location.pathname === '/search/home' ? 'active' : ''}>Search</Nav.Link>
                    <Nav.Link as={Link} to="/watchlist" className={location.pathname === '/watchlist' ? 'active' : ''}>Watchlist</Nav.Link>
                    <Nav.Link as={Link} to="/portfolio" className={location.pathname === '/portfolio' ? 'active' : ''}>Portfolio</Nav.Link>
                </Nav>
            </Container>
        </BootstrapNavbar>
    );
}

export default Navbar;
