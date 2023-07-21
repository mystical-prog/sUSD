import React, { useState } from "react";

const CreateCDPForm = () => {
  const [number, setNumber] = useState("");
  const [slider, setSlider] = useState(137);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form processing logic here
    console.log(`Number: ${number}, Slider: ${slider}`);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="p-10 bg-gray-800 rounded-xl shadow-2xl w-2/5 transition-all duration-500 ease-in-out transform hover:scale-105"
      >
        <h1 className="text-center text-3xl font-bold mb-5 tracking-wide text-indigo-500 underline italic">Create CDP</h1>
        <div className="space-y-8">
          <label
            htmlFor="number-input"
            className="block text-sm font-medium text-gray-300 transition-colors duration-200 ease-in-out"
          >
            Number
            <input
              type="number"
              id="number-input"
              className="mt-1 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-indigo-500"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </label>
          <div className="border-t border-gray-600 my-5"></div>
          <label
            htmlFor="slider-input"
            className="block text-sm font-medium text-gray-300 transition-colors duration-200 ease-in-out"
          >
            Slider
            <div className="flex justify-between text-xs text-gray-400">
              <span>137</span>
              <span>160</span>
            </div>
            <input
              type="range"
              min="137"
              max="160"
              id="slider-input"
              className="mt-1 block w-full rounded-full bg-gray-700 text-gray-300 shadow-md transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-indigo-500 appearance-none h-3"
              value={slider}
              onChange={(e) => setSlider(e.target.value)}
              style={{ background: `linear-gradient(to right, #818CF8 0%, #818CF8 ${(slider-137)/23*100}%, #4B5563 ${(slider-137)/23*100}%, #4B5563 100%)`}}
            />
            <div className="text-center text-xs text-gray-300">{slider}</div>
            <div className="flex space-x-4 mt-3">
              <button
                type="button"
                className="flex-1 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-700 transition-colors duration-200 ease-in-out shadow-md"
              >
                Market Price
              </button>
              <button
                type="button"
                className="flex-1 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-700 transition-colors duration-200 ease-in-out shadow-md"
              >
                Current Price
              </button>
            </div>
          </label>
          <div className="pt-5">
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-1/2 inline-flex justify-center py-2 px-4 border border-transparent shadow-2xl text-sm font-medium rounded-full text-gray-800 bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out hover:shadow-3xl transform hover:-translate-y-1"
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
