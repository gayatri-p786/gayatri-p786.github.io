import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

function SellModal({ show, ticker, currentPrice, moneyInWallet, existingQuantity, onHide, handleCloseSellModal, handleSellSuccess }) {
    const [quantity, setQuantity] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const [total, setTotal] = useState(0);

    const handleSell = async () => {
        console.log('inside sell');
        // Validate sell quantity
        try {
            // Fetch user's portfolio data
            const response = await axios.get(`http://${window.location.hostname}:5000/api/user/portfolio`);
            const userData = response.data;
            let upin_response = 300;
            console.log(userData);
    
            // Check if the ticker already exists in the user's portfolio
            const existingStock = userData.portfolio.find(stock => stock.symbol === ticker);
            console.log(existingStock);
            const newquant=existingQuantity-parseInt(quantity);
            if (newquant<=0){
                const remove_response=await axios.post(`http://${window.location.hostname}:5000/api/user/portfolio/remove?ticker=${ticker}`);
                // console.log(remove_response);
                if (remove_response.status===200){
                    console.log("Removed STock from Portfolio");
                    const newMoneyInWallet = parseFloat(moneyInWallet + parseFloat(total));
                
                // Update the money in wallet using another backend endpoint
                    const updateMoneyResponse = await axios.post(`http://${window.location.hostname}:5000/api/user/money/update`, { money: newMoneyInWallet });
        
                    if (updateMoneyResponse.status === 200) {
                        // Money in wallet updated successfully
                        // Perform any additional actions, such as closing the modal
                        // handleClose();
                    } else {
                        console.error('Failed to update money in wallet');
                        // Handle the failure scenario
                    }

                }else{
                    console.log("Could NOT remove stock");
                }
                handleSellSuccess();
                handleCloseSellModal();
                
            }else if (existingStock && parseInt(quantity)<=existingQuantity) {
                // If the stock already exists, update the quantity, total, and average cost per share
                const updatedPortfolio = userData.portfolio.map(stock => {
                    if (stock.symbol === ticker) {
                        return {
                            ...stock,
                            quantity: stock.quantity - parseInt(quantity),
                            total: stock.total - parseFloat(total),
                            averageCostPerShare: (stock.total - parseFloat(total)) / (stock.quantity - parseInt(quantity))
                        };
                    }
                    return stock;
                });

                console.log(updatedPortfolio);
    
                // Update the portfolio data in the backend
                upin_response = await axios.post(`http://${window.location.hostname}:5000/api/user/portfolio/update`, {
                    portfolio: updatedPortfolio
                });
                if (upin_response.status === 200) {
                    // Update the money in wallet based on the current money and total cost
                    const newMoneyInWallet = parseFloat(moneyInWallet + parseFloat(total));
                    
                    // Update the money in wallet using another backend endpoint
                    const updateMoneyResponse = await axios.post(`http://${window.location.hostname}:5000/api/user/money/update`, { money: newMoneyInWallet });
        
                    if (updateMoneyResponse.status === 200) {
                        // Money in wallet updated successfully
                        // Perform any additional actions, such as closing the modal
                        // handleClose();
                    } else {
                        console.error('Failed to update money in wallet');
                        // Handle the failure scenario
                    }
                } else {
                    console.error('Failed to sell stock');
                    // Handle the failure scenario
                }
                setErrorMessage('');
                handleSellSuccess();
            handleCloseSellModal();
            } else{
                setErrorMessage('You cannot sell the stocks that you don\'t have');
                handleCloseSellModal();
            }

            // Close the modal after successful buy
            
        } catch (error) {
            console.error('Error selling stock:', error);
            setErrorMessage('Failed to sell stock. Please try again.');
        }
    };

    const isSellDisabled = () => {
        return quantity < 1 || quantity === '' || quantity > existingQuantity;
    };

    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value);
        setQuantity(newQuantity);
        const newTotal = newQuantity * currentPrice;
        setTotal(newTotal);
        if (newQuantity >= 1 && newQuantity<=existingQuantity) {
            setErrorMessage('');
        } else {
            // setTotal(0);
            setErrorMessage('You cannot Sell Stocks you don\'t have');
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
                <Button variant="success" onClick={handleSell} disabled={isSellDisabled()}>Sell</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default SellModal;
