import React, { useState, useEffect } from 'react';
import './BottomBar.css'; // Import the CSS file

const BottomBar = ({solPrice}) => {

    return (
        <div className="bottom-bar">
            <div className="flex justify-around text-center">
                <div className="crypto-price">
                    <h2>Solana</h2>
                    <p className="price">${solPrice}</p>
                </div>
                <div className="crypto-price">
                    <h2>Liquidation Rate</h2>
                    <p className="price">135%</p>
                </div>
            </div>
        </div>
    );
};

export default BottomBar;
