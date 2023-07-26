import { useAnchorWallet } from "@solana/wallet-adapter-react";
import React, { useState, useEffect } from "react";
import { getCDPsOnChain } from "../logic/chain-call";
import axios from "axios"

const CreateCDPForm = () => {
  const wallet = useAnchorWallet();
  const [number, setNumber] = useState(0.01);
  const [slider, setSlider] = useState(140);
  const [activeButton, setActiveButton] = useState("Market Price");
  const [solRate, setRate] = useState();
  const [limitPrice, setLimitPrice] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Number: ${number}, Slider: ${slider}`);
  };

  const onMarket = async () => {
    const res = await axios.get("https://api.coinbase.com/v2/prices/SOL-USD/spot");
    setRate(Number(res.data.data.amount).toFixed(2));
    setActiveButton("Market Price")
  }

  useEffect(() => {
    (async () => {

      const res = await axios.get("https://api.coinbase.com/v2/prices/SOL-USD/spot");
      setRate(Number(res.data.data.amount).toFixed(2));
      
      const cdps = await getCDPsOnChain(wallet);
      console.log(cdps);

    })();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-10">
      <form
        onSubmit={handleSubmit}
        className="p-10 bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl transition-all duration-500 ease-in-out transform"
      >
        <h1 className="text-3xl font-semibold mb-5 tracking-wide text-blue-500 text-center">Create CDP</h1>
        <div className="space-y-8">
          {/* Number Input */}
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
                onChange={(e) => setLimitPrice(e.target.value)}
              />
            )}
          </label>

          <div className="border-t border-gray-600 my-5"></div>

          {/* Submit Button */}
          <div className="pt-5">
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-1/2 bg-opacity-40 bg-gray-600 border-gray-700 border-4 hover:border-blue-700 text-xl inline-flex justify-center py-2 px-4 border-transparent shadow-2xl font-medium rounded-full text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out hover:shadow-3xl transform hover:-translate-y-1"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCDPForm;
