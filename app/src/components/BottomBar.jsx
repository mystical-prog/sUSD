import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BottomBar.css'; // Import the CSS file

const BottomBar = () => {
    const [btcPrice, setBtcPrice] = useState(0);
    const [ethPrice, setEthPrice] = useState(0);
    const [solPrice, setSolPrice] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const btcRes = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
                const ethRes = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
                const solRes = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
                setBtcPrice(btcRes.data.bitcoin.usd);
                setEthPrice(ethRes.data.ethereum.usd);
                setSolPrice(solRes.data.solana.usd);
            } catch (error) {
                console.error('Failed to fetch prices', error);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 60000);  // refresh every minute

        return () => clearInterval(intervalId);  // cleanup function on unmount
    }, []);

    return (
        <div className="bottom-bar">
            <div className="flex justify-around text-center">
                <div className="crypto-price">
                    <h2>Bitcoin</h2>
                    <p className="price">${btcPrice.toFixed(2)}</p>
                </div>
                <div className="crypto-price">
                    <h2>Ethereum</h2>
                    <p className="price">${ethPrice.toFixed(2)}</p>
                </div>
                <div className="crypto-price">
                    <h2>Solana</h2>
                    <p className="price">${solPrice.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

export default BottomBar;
