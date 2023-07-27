import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import React, { useState, useEffect } from "react";
import { createCDP, createLimitCDP, createNonce, createSOLPDA, getCDPsOnChain, sendDurableTx } from "../logic/chain-call";
import axios from "axios";

const CreateCDPForm = () => {
  const wallet = useAnchorWallet();
  const { publicKey, signTransaction } = useWallet();
  const [number, setNumber] = useState(0.01);
  const [slider, setSlider] = useState(140);
  const [activeButton, setActiveButton] = useState("Market Price");
  const [solRate, setRate] = useState();
  const [limitPrice, setLimitPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [limitOrders, setLimitOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('create');

  // Dummy CDPs
  const [cdps, setCdps] = useState([
    {amount: 100, price: 50, debtRate: 5, nonce: 1234567890},
    {amount: 200, price: 45, debtRate: 10, nonce: 2345678901},
    {amount: 150, price: 55, debtRate: 7, nonce: 3456789012}
  ]);

  const onMarket = async () => {
    updateSolRate();
    setActiveButton("Market Price");
  };

  const handleLimitOrder = async () => {
    let temp = limitOrders;
    const [noncePubkey, nonce] = await createNonce(wallet);
    const ser = await createLimitCDP(wallet, Number(number), Number(slider * 100), noncePubkey, nonce, publicKey, signTransaction);
    temp.push({ price : Number(limitPrice.toFixed(2)), amount : Number(number), debtRate : Number(slider), nonce : nonce, noncePubkey : noncePubkey, ser : ser });
    setLimitOrders(temp);
    alert("Limit Order Created!");
  };

  const updateSolRate = async () => {
    const res = await axios.get("https://api.coinbase.com/v2/prices/SOL-USD/spot");
    setRate(Number(res.data.data.amount).toFixed(2));

    let temp = limitOrders;
    
    for(const i in temp){
      if(temp[i].price <= solRate) {
        try {
          await sendDurableTx(wallet, temp[i].ser);
          alert("Limit order executed for the price : ", temp[i].price);
          temp.splice(i, 1);
        } catch (error) {
          console.log(error);
        }
      }
    }
    setLimitOrders(temp);
    console.log(limitOrders);
  };

  const onCreate = async () => {
    setLoading(true);
    if(activeButton == "Market Price") {
      await createCDP(wallet, number, (slider*100));
      setLoading(false);
    } else {
      await handleLimitOrder();
      console.log(limitOrders);
      setLoading(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(updateSolRate, 5000);
    return () => {
      clearInterval(intervalId);
    }
  }, []);

  const Tab = ({ title, active }) => (
    <button 
      className={`py-2 px-4 text-white ${active ? 'border-b-2 border-blue-500' : ''}`}
      onClick={() => setActiveTab(title.toLowerCase())}
    >
      {title}
    </button>
  );

  return (
    <div className="flex justify-center items-center h-full my-28 bg-gray-900">
      <div className="p-10 bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl transition-all duration-500 ease-in-out transform">
        <h1 className="text-3xl font-semibold mb-5 tracking-wide text-blue-500 text-center">Create CDP</h1>
        <div className="flex space-x-4 justify-center transition-all duration-500 ease-in-out">
          <Tab title="Create" active={activeTab === 'create'} />
          <Tab title="Orders" active={activeTab === 'orders'} />
        </div>
        {activeTab === 'create' ? (
          // The create form code
          <div className="space-y-8">
            <label htmlFor="number-input" className="block text-lg font-medium text-gray-300 transition-colors duration-200 ease-in-out">
              Amount
              <input
                type="number"
                id="number-input"
                className="p-4 mt-1 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-blue-500"
                value={number}
                min={0.01}
                step={0.01}
                onChange={(e) => setNumber(e.target.value)}
              />
              <span className="block mt-2 text-sm text-gray-500">
                Approximately ${(number * solRate).toFixed(2)} USD
              </span>
            </label>
            <div className="border-t border-gray-600 my-5"></div>

          {/* Slider Input */}
          <label htmlFor="slider-input" className="block text-lg font-medium text-gray-300 transition-colors duration-200 ease-in-out">
            Safemint Rate
            <div className="flex justify-between text-md text-gray-400">
              <span>140</span>
              <span>160</span>
            </div>
            <input
              type="range"
              min="140"
              max="160"
              step={0.01}
              id="slider-input"
              className="mt-1 block w-full rounded-full bg-gray-700 text-gray-300 shadow-md transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-blue-500 appearance-none h-3"
              value={slider}
              onChange={(e) => setSlider(e.target.value)}
              style={{ background: `linear-gradient(to right, #818CF8 0%, #818CF8 ${(slider-140)/20*100}%, #4B5563 ${(slider-140)/20*100}%, #4B5563 100%)`}}
            />
            <div className="text-center text-md text-gray-300">{slider}</div>

            {/* Buttons */}
            <div className="flex space-x-4 mt-3">
              <button
                type="button"
                onClick={onMarket}
                className={`flex-1 py-2 rounded-full bg-opacity-40 ${activeButton === 'Market Price' ? 'bg-red-500 border-red-900' : 'bg-gray-600'} border-gray-700 border-4 hover:border-red-700 backdrop-blur text-white text-lg font-medium transition-colors duration-200 ease-in-out shadow-md hover:bg-red-500`}
              >
                Market Price
              </button>
              <button
                type="button"
                onClick={() => setActiveButton("Limit Price")}
                className={`flex-1 py-2 rounded-full bg-opacity-40 ${activeButton === 'Limit Price' ? 'bg-green-500 border-green-900' : 'bg-gray-600'} border-gray-700 border-4 hover:border-green-700 backdrop-blur text-white text-lg font-medium transition-colors duration-200 ease-in-out shadow-md hover:bg-green-500`}
              >
                Limit Price
              </button>
            </div>

            {/* Active Button Info */}
            {activeButton === "Market Price" && (
              <input
                type="number"
                className="opacity-100 p-4 mt-4 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-blue-500"
                value={solRate}
                disabled
              />
            )}
            {activeButton === "Limit Price" && (
              <input
                type="number"
                className="mt-4 opacity-100 p-4 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-blue-500"
                value={limitPrice}
                step={0.01}
                onChange={(e) => setLimitPrice(Number(e.target.value))}
              />
            )}
          </label>

          <div className="border-t border-gray-600 my-5"></div>
          <div className="flex items-center justify-center">
            <button
              type="button"
              className={`flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                loading ? "bg-gray-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={loading}
              onClick={onCreate}
            >
              {loading ? (
                <div className="animate-spin mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
              ) : (
                "Create CDP"
              )}
            </button>
            </div>
          </div>
        ) : (
          <div className="mt-5">
            <h2 className="text-lg font-semibold tracking-wide text-blue-500 text-center">Orders</h2>
            {cdps.map((cdp, index) => (
              <div key={index} className="bg-gray-700 rounded-md mt-4 p-4">
                <h3 className="text-lg text-white">Order #{index+1}</h3>
                <p className="text-white mt-2">Amount: {cdp.amount}</p>
                <p className="text-white">Price: {cdp.price}</p>
                <p className="text-white">Debt Rate: {cdp.debtRate}</p>
                <p className="text-white">Nonce: {cdp.nonce}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCDPForm;
