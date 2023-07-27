import { useState } from 'react';

const Modal = ({ action, onClose }) => {
  const [sliderValue, setSliderValue] = useState(137);
  const [activeButton, setActiveButton] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-gray-900 rounded-lg p-5 max-w-lg w-full">
        <button onClick={onClose} className="float-right">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class=" text-red-700 w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        </button>

        <h2 className="text-lg text-white font-semibold mb-3">{action}</h2>

        {action === 'Issue CDP' && (
          <form onSubmit={handleSubmit}>
            <label className="block mb-3">
              <span className="text-white">Amount:</span>
              <input
                type="text"
                className="opacity-100 p-4 mt-4 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-blue-500"
                placeholder="Enter amount"
                required
              />
            </label>
            <button className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Submit</button>
          </form>
        )}

        {action === 'Add CDP' && (
          <div>
            <div className="flex space-x-4 mt-3">
              <button
                type="button"
                onClick={() => setActiveButton("Market Price")}
                className={`flex-1 py-2 rounded-full bg-opacity-40 ${activeButton === 'Market Price' ? 'bg-red-500' : 'bg-gray-600'} border-gray-700 border-4 hover:border-red-700 backdrop-blur text-white text-lg font-medium transition-colors duration-200 ease-in-out shadow-md hover:bg-red-500`}
              >
                Market Price
              </button>
              <button
                type="button"
                onClick={() => setActiveButton("Current Price")}
                className={`flex-1 py-2 rounded-full bg-opacity-40 ${activeButton === 'Current Price' ? 'bg-green-500' : 'bg-gray-600'} border-gray-700 border-4 hover:border-green-700 backdrop-blur text-white text-lg font-medium transition-colors duration-200 ease-in-out shadow-md hover:bg-green-500`}
              >
                Current Price
              </button>
            </div>

            {/* Active Button Info */}
            {activeButton === "Market Price" && (
              <input
                type="text"
                className=" opacity-100 p-4 mt-4 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-blue-500"
                value="Market Price Info"
                disabled
              />
            )}
            {activeButton === "Current Price" && (
              <input
                type="text"
                className="opacity-100 p-4 mt-4 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-blue-500"
                value="Current Price Info"
                disabled
              />
            )}
            <div className="border-t border-gray-600 my-5"></div>
          <div className="flex items-center justify-center">
            <button
              type="button"
              className={`flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                loading ? "bg-gray-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={loading}
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
        )}

        {action === 'Close CDP' && (
          <div>
          <div className="flex space-x-4 mt-3">
            <button
              type="button"
              onClick={() => setActiveButton("Market Price")}
              className={`flex-1 py-2 rounded-full bg-opacity-40 ${activeButton === 'Market Price' ? 'bg-red-500' : 'bg-gray-600'} border-gray-700 border-4 hover:border-red-700 backdrop-blur text-white text-lg font-medium transition-colors duration-200 ease-in-out shadow-md hover:bg-red-500`}
            >
              Market Price
            </button>
            <button
              type="button"
              onClick={() => setActiveButton("Current Price")}
              className={`flex-1 py-2 rounded-full bg-opacity-40 ${activeButton === 'Current Price' ? 'bg-green-500' : 'bg-gray-600'} border-gray-700 border-4 hover:border-green-700 backdrop-blur text-white text-lg font-medium transition-colors duration-200 ease-in-out shadow-md hover:bg-green-500`}
            >
              Current Price
            </button>
          </div>

          {/* Active Button Info */}
          {activeButton === "Market Price" && (
            <input
              type="text"
              className=" opacity-100 p-4 mt-4 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-blue-500"
              value="Market Price Info"
              disabled
            />
          )}
          {activeButton === "Current Price" && (
            <input
              type="text"
              className=" opacity-100 p-4 mt-4 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-blue-500"
              value="Current Price Info"
              disabled
            />
          )}
          <div className="border-t border-gray-600 my-5"></div>
          <div className="flex items-center justify-center">
            <button
              type="button"
              className={`flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                loading ? "bg-gray-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={loading}
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
        )}

        {action === 'Remove CDP' && (
          <form onSubmit={handleSubmit}>
          <label className="block mb-3">
            <span className="text-white">Amount:</span>
            <input
              type="text"
              className="opacity-100 p-4 mt-4 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-blue-500"
              placeholder="Enter amount"
              required
            />
          </label>
          <button className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Submit</button>
        </form>
        )}

        {action === 'Repay CDP' && (
          <form onSubmit={handleSubmit}>
          <label className="block mb-3">
            <span className="text-white">Amount:</span>
            <input
                type="text"
                className="opacity-100 p-4 mt-4 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-blue-500"
                placeholder="Enter amount"
                required
              />
          </label>
          <button className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Submit</button>
        </form>
        )}

        {action === 'Remove CKBTC' && (
          <form onSubmit={handleSubmit}>
          <label className="block mb-3">
            <span className="text-white">Amount:</span>
            <input
                type="text"
                className="opacity-100 p-4 mt-4 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-blue-500"
                placeholder="Enter amount"
                required
              />
          </label>
          <button className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Submit</button>
        </form>
        )}
        {action === 'Repay CKBTC' && (
          <form onSubmit={handleSubmit}>
          <label className="block mb-3">
            <span className="text-white">Amount:</span>
            <input
                type="text"
                className="opacity-100 p-4 mt-4 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-blue-500"
                placeholder="Enter amount"
                required
              />
          </label>
          <button className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Submit</button>
        </form>
        )}

        {action === 'Adjust Safemint Rate' && (
          <form onSubmit={handleSubmit}>
            <label className="block mb-3 text-center">
              <div className="flex justify-between text-md text-gray-400">
              <span>140</span>
              <span>160</span>
            </div>
              <input
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                type="range"
                name="rate"
                min="137"
                max="160"
                value={sliderValue}
                onChange={handleSliderChange}
                required
              />
              <span className="text-center text-white">Rate: {sliderValue}</span>
            </label>
            <button className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Submit</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Modal;
