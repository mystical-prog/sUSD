import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';

const Modal = ({ action, onClose }) => {
  const wallet = useAnchorWallet();
  const [sliderValue, setSliderValue] = useState(137);
  const [activeButton, setActiveButton] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowAlert(true);
  };

  const handleIssue = (e) => {
    e.preventDefault();
    
    setShowAlert(true);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-gray-900 rounded-lg p-5 max-w-lg w-full">
        <button onClick={onClose} className="float-right">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class=" text-red-700 w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        </button>

        <h2 className="text-lg text-white font-semibold mb-3">{action}</h2>

        {action === 'Issue sUSD' && (
          <form onSubmit={handleIssue}>
            <label className="block mb-3">
              <span className="text-white">Amount:</span>
              <input
                type="text"
                className="opacity-100 p-4 mt-4 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-purple-500"
                placeholder="Enter amount"
                required
              />
            </label>
            <button className="mt-3 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" type="submit">Submit</button>
           
            {/* Alert */}
            {showAlert && 
                    <div class="flex items-center p-4 my-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                    <svg class="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span class="sr-only">Info</span>
                    <div>
                        <span class="font-medium">Success alert!</span> Change a few things up and try submitting again.
                    </div>
                    </div>
            }
            </form>
            )}

        {action === 'Add SOL' && (
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
                className=" opacity-100 p-4 mt-4 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-purple-500"
                value="Market Price Info"
                disabled
              />
            )}
            {activeButton === "Current Price" && (
              <input
                type="text"
                className="opacity-100 p-4 mt-4 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-purple-500"
                value="Current Price Info"
                disabled
              />
            )}
            <div className="border-t border-gray-600 my-5"></div>
          <div className="flex items-center justify-center">
            <button
              type="button"
              className={`flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                loading ? "bg-gray-700" : "bg-purple-600 hover:bg-purple-700"
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
              className=" opacity-100 p-4 mt-4 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-purple-500"
              value="Market Price Info"
              disabled
            />
          )}
          {activeButton === "Current Price" && (
            <input
              type="text"
              className=" opacity-100 p-4 mt-4 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-purple-500"
              value="Current Price Info"
              disabled
            />
          )}
          <div className="border-t border-gray-600 my-5"></div>
          <div className="flex items-center justify-center">
            <button
              type="button"
              className={`flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                loading ? "bg-gray-700" : "bg-purple-600 hover:bg-purple-700"
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

        {action === 'Remove SOL' && (
          <form onSubmit={handleSubmit}>
          <label className="block mb-3">
            <span className="text-white">Amount:</span>
            <input
              type="text"
              className="opacity-100 p-4 mt-4 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-purple-500"
              placeholder="Enter amount"
              required
            />
          </label>
          <button className="mt-3 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" type="submit">Submit</button>
        </form>
        )}

        {action === 'Repay sUSD' && (
          <form onSubmit={handleSubmit}>
          <label className="block mb-3">
            <span className="text-white">Amount:</span>
            <input
                type="text"
                className="opacity-100 p-4 mt-4 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-purple-500"
                placeholder="Enter amount"
                required
              />
          </label>
          <button className="mt-3 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" type="submit">Submit</button>
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
            <button className="mt-3 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" type="submit">Submit</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Modal;
{/* <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-2 mb-1 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
    </svg> */}