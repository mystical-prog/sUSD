import React, { useState } from 'react';
import './List.css';

const List = () => {
  const [cdps, setCdps] = useState([
    {amount: 100, price: 50, publicKey: 'publicKey1', liquidationPrice: 45, nonce: 1234567890},
    {amount: 200, price: 60, publicKey: 'publicKey2', liquidationPrice: 55, nonce: 2345678901},
    {amount: 150, price: 55, publicKey: 'publicKey3', liquidationPrice: 50, nonce: 3456789012},
  ]);

  const handleManageClick = (cdp) => {
    console.log(`Managing CDP: ${JSON.stringify(cdp)}`);
  };

  return (
    <div className="bg-gray-900 text-white p-8 my-14">
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
            <div class="px-6 py-4 border-b text-lg text-gray-300 border-gray-500 border-1 bg-gray-700">{`Public Key: ${cdp.publicKey}`}</div>
            <div class="px-6 py-4 border-b text-lg rounded-b-lg  text-gray-300 border-gray-500 border-1 bg-gray-700">{`Liquidation Price: ${cdp.liquidationPrice}`}</div>
            <button
              className="mt-3 bg-gray-900 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded shadow-md transition"
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
