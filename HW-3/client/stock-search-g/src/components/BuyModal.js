import React, { useState } from 'react';
import { Modal, Button, Form} from 'react-bootstrap';
import axios from 'axios';
import { BACKEND_URL } from '../config';

const BuyModal = ({ show, ticker, company, currentPrice, moneyInWallet, onHide, handleCloseBuyModal, handleBuySuccess }) => {
    const [quantity, setQuantity] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const [total, setTotal] = useState(0);

    const handleBuy = async () => {
        try {
            // Fetch user's portfolio data
            const response = await axios.get(`/api/user/portfolio`);
            const userData = response.data;
            let upin_response = 300;
    
            // Check if the ticker already exists in the user's portfolio
            const existingStock = userData.portfolio.find(stock => stock.symbol === ticker);
    
            if (existingStock) {
                // If the stock already exists, update the quantity, total, and average cost per share
                const updatedPortfolio = userData.portfolio.map(stock => {
                    if (stock.symbol === ticker) {
                        return {
                            ...stock,
                            quantity: stock.quantity + parseInt(quantity),
                            total: stock.total + parseFloat(total),
                            averageCostPerShare: (stock.total + parseFloat(total)) / (stock.quantity + parseInt(quantity))
                        };
                    }
                    return stock;
                });

                console.log(updatedPortfolio);
    
                // Update the portfolio data in the backend
                upin_response = await axios.post(`/api/user/portfolio/update`, {
                    portfolio: updatedPortfolio
                });
                
            } else {
                // If the stock does not exist, add a new record to the portfolio
                const newStock = {
                    symbol: ticker,
                    company: company,
                    quantity: parseInt(quantity),
                    total: parseFloat(total),
                    averageCostPerShare: parseFloat(total) / parseInt(quantity)
                };
    
                console.log(newStock);
                // Update the portfolio data in the backend
                upin_response = await axios.post(`/api/user/portfolio/insert`, {
                    stock: newStock
                });
            }
            if (upin_response.status === 200) {
                // Update the money in wallet based on the current money and total cost
                const newMoneyInWallet = parseFloat(moneyInWallet - parseFloat(total));
                
                // Update the money in wallet using another backend endpoint
                const updateMoneyResponse = await axios.post(`/api/user/money/update`, { money: newMoneyInWallet });
    
                if (updateMoneyResponse.status === 200) {
                    // Money in wallet updated successfully
                    // Perform any additional actions, such as closing the modal
                    // handleClose();
                } else {
                    console.error('Failed to update money in wallet');
                    // Handle the failure scenario
                }
                handleBuySuccess();
            // Close the modal after successful buy
            handleCloseBuyModal();
            } else {
                console.error('Failed to buy stock');
                // Handle the failure scenario
            }
            handleBuySuccess();
            // Close the modal after successful buy
            handleCloseBuyModal();
        } catch (error) {
            console.error('Error buying stock:', error);
            setErrorMessage('Failed to buy stock. Please try again.');
        }
    };
    
    const isBuyDisabled = () => {
        return quantity < 1 || quantity === '' || total > moneyInWallet;
    };

    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value);
        setQuantity(newQuantity);
        if (newQuantity >= 1) {
            const newTotal = newQuantity * currentPrice;
            setTotal(newTotal);
            if (newTotal <= moneyInWallet) {
                
                setErrorMessage('');
            } else {
                // setTotal(0);
                setErrorMessage("Not enough money in wallet!");
            }
        } else {
            setTotal(0);
            setErrorMessage('');
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{ticker}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Current Price:</strong> {currentPrice}</p>
                <p><strong>Money in Wallet:</strong> ${moneyInWallet}</p>
                <div className="d-flex align-items-center">
                    <Form.Group className="flex-grow-1">
                        <Form.Label><strong>Quantity:</strong></Form.Label>
                        <Form.Control type="number" value={quantity} onChange={handleQuantityChange} 
                        min="0" 
                        required  />
                    </Form.Group>
                </div>
                <p style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</p>
               
            </Modal.Body>
            <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ float: 'left' }}>
                    <Form.Label><strong>Total:</strong> ${total}</Form.Label>
                </div>
                <Button variant="success" onClick={handleBuy} disabled={isBuyDisabled()}>Buy</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BuyModal;
