import React, { useState } from 'react';

const CDPInteraction = () => {
  // Initialize dummy data for the component.
  const CDPDetails = {
    entry_rate: '1.00',
    liquidation_rate: '2.00',
    amount: '1000',
    safemint_rate: '0.50',
    max_issuable_debt: '2000',
    issued_debt: '500',
    volume: '10000'
  };

  const tabs = [
    { name: 'Issue', fieldLabel: 'Amount', btnText: 'Issue', func: () => console.log('Clicked Issue IRSC') },
    { name: 'Repay', fieldLabel: 'Amount', btnText: 'Repay', func: () => console.log('Clicked Repay IRSC') },
    { name: 'Add ckBTC', fieldLabel: 'Amount', btnText: 'Add', func: () => console.log('Clicked Add ckBTC') },
    { name: 'Remove ckBTC', fieldLabel: 'Amount', btnText: 'Remove', func: () => console.log('Clicked Remove ckBTC') },
    { name: 'Close CDP', btnText: 'Close', func: () => console.log('Clicked Close CDP') },
    { name: 'Adjust Safemint', fieldLabel: 'Safemint', btnText: 'Adjust', isSlider: true, func: () => console.log('Clicked Adjust Safemint') },
    // Fill other tabs as required...
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [sliderInput, setSliderInput] = useState(137);
  const [numberInput, setNumberInput] = useState(0.0001);
  const [loaded, setLoaded] = useState(true);

  const handleSliderChange = (event) => {
    setSliderInput(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNumberInput(event.target.value);
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 p-10">
      <div
        className="flex flex-row bg-gray-800 rounded-xl shadow-2xl w-full transition-all duration-500 ease-in-out transform h-full"
      >
        {/* Left Side */}
        <div className="flex flex-col w-1/2 pr-4 items-center border-r-2 border-gray-600 p-10">
          <h2 className="text-center text-3xl font-medium text-blue-500 mb-6">Details</h2>
          {Object.entries(CDPDetails).map(([key, value]) => (
            <div key={key} className="flex justify-between w-3/4 mb-3 text-xl font-medium text-gray-300 transition-colors duration-200 ease-in-out">
              <span className="capitalize">{key.replace('_', ' ')}:</span>
              <span>{value}</span>
            </div>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex flex-col w-1/2 pl-4 items-center p-10">
          <h2 className="text-center text-3xl font-medium text-blue-500 mb-6">Interaction</h2>
          <div className="flex space-x-2 overflow-x-auto whitespace-nowrap justify-center w-full mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                className={`px-4 py-2 rounded-md bg-opacity-40 ${activeTab.name === tab.name ? 'bg-blue-500 border-blue-900' : 'bg-gray-600'} border-gray-700 border-4 hover:border-blue-700 text-white text-lg font-medium transition-colors duration-200 ease-in-out shadow-md hover:bg-blue-500`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.name}
              </button>
            ))}
          </div>
          <div className="mt-4 w-full flex flex-col items-center">
            {activeTab.fieldLabel && (
              <div className="w-2/3 flex flex-col mb-3">
                <label className="mb-3 mt-3 text-gray-300 font-bold">{activeTab.fieldLabel} :</label>
                {activeTab.isSlider ? (
                  <>
                      <input 
                          className="shadow bg-background h-1.5 w-full border cursor-pointer appearance-none rounded-lg"
                          id="slider-input" 
                          type="range" 
                          min="137" 
                          max="160"
                          step="1"
                          value={sliderInput}
                          onChange={handleSliderChange}
                      />
                      <div className="flex justify-between text-sm text-gray-300 mt-2 font-bold">
                          <span>Min: 137%</span>
                          <span>Current: {sliderInput}%</span>
                          <span>Max: 160%</span>
                      </div>
                  </>
                ) : (
                  <input 
                      className="shadow appearance-none bg-gray-700 border rounded w-full py-2 px-3 text-gray-300 font-bold leading-tight focus:outline-none focus:shadow-outline" 
                      id="number-input" 
                      type="number"
                      min={0.0001}
                      step={0.0001}
                      placeholder='0.0001'
                      value={numberInput}
                      onChange={handleNumberChange} 
                  />
                )}
              </div>
            )}
            <button className="px-4 py-2 rounded-lg bg-gray-700 text-white" onClick={activeTab.func}>{loaded ? activeTab.btnText : "Loading.."}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CDPInteraction;
