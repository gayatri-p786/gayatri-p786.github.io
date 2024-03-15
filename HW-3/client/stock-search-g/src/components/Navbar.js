import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './styles.css';

function Navbar() {
    const location = useLocation();
    const [expanded, setExpanded] = useState(false);

    return (
        <BootstrapNavbar bg="royalblue" variant="dark" expand="sm" sticky="top" style={{ padding: '8px 0' }} expanded={expanded}>
            <Container className="justify-content-between">
                <BootstrapNavbar.Brand as={Link} to="/">Stock Search</BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
                <BootstrapNavbar.Collapse id="basic-navbar-nav" className="collapse-content">
                    <Nav>
                        <Nav.Link as={Link} to="/search/home" className={location.pathname === '/search/home' ? 'active' : ''}>Search</Nav.Link>
                        <Nav.Link as={Link} to="/watchlist" className={location.pathname === '/watchlist' ? 'active' : ''}>Watchlist</Nav.Link>
                        <Nav.Link as={Link} to="/portfolio" className={location.pathname === '/portfolio' ? 'active' : ''}>Portfolio</Nav.Link>
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
}

export default Navbar;
