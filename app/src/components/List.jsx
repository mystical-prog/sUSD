import React, { useState, useEffect } from 'react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { getCDPsOnChain } from '../logic/chain-call';
import './List.css';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useNavigate } from 'react-router-dom';

const List = () => {
  const wallet = useAnchorWallet();
  const navigate = useNavigate();

  const [cdps, setCdps] = useState([]);

  useEffect(() => {
    (async () => {
      let temp = [];
      const cdps = await getCDPsOnChain(wallet);
      for(const i in cdps) {
        temp.push({ amount : Number(cdps[i].account.amount) * LAMPORTS_PER_SOL/ 10**11, price : Number(Number(cdps[i].account.entryPrice) * 10 / LAMPORTS_PER_SOL).toFixed(2), publicKey : cdps[i].publicKey.toBase58(), liquidationPrice : Number(Number(cdps[i].account.liquidationPrice) * 10 / LAMPORTS_PER_SOL).toFixed(2)});
      }
      setCdps(temp);
      console.log(cdps);
    })();
  }, []);

  const handleManageClick = (cdp) => {
    navigate(`/interact/${cdp.publicKey}`);
  };

  return (
    <div className="bg-gray-900 text-white p-8">
      <h1 className="text-4xl text-center font-semibold mb-8 text-purple-500">List of CDPs</h1>
      <div className="flex flex-wrap justify-around">
        {cdps.map((cdp, index) => (
          <div
            key={index}
            className="cdp-card m-4 p-8 rounded-lg shadow-md transition-all duration-200 ease-in-out hover:shadow-lg bg-gray-800"
          >
            <h2 className="text-2xl font-semibold tracking-wide text-purple-500 mb-4">{`CDP #${index + 1}`}</h2>
            <div class="px-6 py-4 font-medium text-lg whitespace-nowrap border-b rounded-t-lg text-gray-300 border-gray-500 border-1 bg-gray-700">{`Amount: ${cdp.amount}`}</div>
            <div class="px-6 py-4 border-b text-lg text-gray-300 border-gray-500 border-1 bg-gray-700">{`Entry Price: ${cdp.price}`}</div>
            <div class="px-6 py-4 border-b text-lg rounded-b-lg  text-gray-300 border-gray-500 border-1 bg-gray-700">{`Liquidation Price: ${cdp.liquidationPrice}`}</div>
            <button
              className="mt-3 bg-gray-900 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded shadow-md transform transition hover:scale-105"
              onClick={() => handleManageClick(cdp)}
            >
              Manage CDP
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
