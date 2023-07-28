import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { adjustDebtPercentTx, issueSUSDTx, removeCollateralTx, repaySUSDTx, createNonce, closeLimitTx, closeCDPTx, addCollateralTx, addLimitTx } from '../logic/chain-call';
import { useNavigate } from 'react-router-dom';

const Modal = ({ action, onClose, pubkey, limitOrders, setOrders, currPrice }) => {
  const wallet = useAnchorWallet();
  const navigate = useNavigate();
  const { publicKey, signTransaction } = useWallet();
  const [sliderValue, setSliderValue] = useState(140);
  const [activeButton, setActiveButton] = useState(null);
  const [amount, setAmount] = useState(0);
  const [limitPrice, setLimitPrice] = useState(currPrice);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  };

  const handleLimitOrder = async (type) => {
    let temp = limitOrders;
    const [noncePubkey, nonce] = await createNonce(wallet);
    if(type == "Close Position") {
      const ser = await closeLimitTx(wallet, pubkey, noncePubkey, nonce, publicKey, signTransaction);
      temp.push({ type : type, price : Number(limitPrice).toFixed(2), nonce : nonce, noncePubkey : noncePubkey, ser : ser });
      setOrders(temp);
      alert("Limit Order Created!");
      console.log(temp);
    } else if(type == "Add SOL") {
      const ser = await addLimitTx(wallet, amount, pubkey, noncePubkey, nonce, publicKey, signTransaction);
      temp.push({ type : type, amount : amount, price : Number(limitPrice).toFixed(2), nonce : nonce, noncePubkey : noncePubkey, ser : ser });
      setOrders(temp);
      alert("Limit Order Created!");
    } else {
      alert("Something went wrong!");
    }
  };

  const handleClose = async (e) => {
    setLoading(true);
    e.preventDefault();
    if(activeButton == "Market Price") {
      try{ 
      const res = await closeCDPTx(wallet, pubkey);
      console.log(res);
      window.location.href = "/";
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else if(activeButton == "Limit Price") {
      await handleLimitOrder("Close Position");
      setLoading(false);
    } else {
      alert("Something is wrong!");
      setLoading(false);
    }
    setLoading(false);
    setActiveButton(null);
    setAmount(0);
  }

  const handleAdd = async (e) => {
    setLoading(true);
    e.preventDefault();
    if(activeButton == "Market Price") {
      try{ 
      const res = await addCollateralTx(wallet, amount, pubkey);
      console.log(res);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else if(activeButton == "Limit Price") {
      await handleLimitOrder("Add SOL");
      setLoading(false);
    } else {
      alert("Something is wrong!");
      setLoading(false);
    }
    setLoading(false);
    setActiveButton(null);
    setAmount(0);
  }

  const handleIssue = async (e) => {
    setLoading(true);
    e.preventDefault();
    const res = await issueSUSDTx(wallet, amount, pubkey);
    console.log(res);
    setShowAlert(true);
    setLoading(false);
    setAmount(0);
  }

  const handleSafemint = async (e) => {
    setLoading(true);
    e.preventDefault();
    const res = await adjustDebtPercentTx(wallet, sliderValue, pubkey);
    console.log(res);
    setShowAlert(true);
    setLoading(false);
    setAmount(0);
  }

  const handleRepay = async (e) => {
    setLoading(true);
    e.preventDefault();
    const res = await repaySUSDTx(wallet, amount, pubkey);
    console.log(res);
    setShowAlert(true);
    setLoading(false);
    setAmount(0);
  }

  const handleRemove = async (e) => {
    setLoading(true);
    e.preventDefault();
    const res = await removeCollateralTx(wallet, amount, pubkey);
    console.log(res);
    setShowAlert(true);
    setLoading(false);
    setAmount(0);
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
                type="number"
                step={0.01}
                min={0.01}
                className="opacity-100 p-4 mt-4 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-purple-500"
                placeholder="Enter amount"
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </label>
            <button className="mt-3 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" type="submit">{loading ? "Loading.." : "Issue"}</button>
           
            {/* Alert */}
            {showAlert && 
                    <div class="flex items-center p-4 my-4 text-sm text-green-800 border-green-800 border-2 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                    <svg class="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span class="sr-only">Info</span>
                    <div>
                        <span class="font-medium">Interaction was successfull! </span>
                    </div>
                    </div>
            }
            </form>
            )}

        {action === 'Add SOL' && (
          <div>
            <input
              type="number"
              step={0.01}
              min={0.01}
              className="opacity-100 p-4 mt-4 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-purple-500"
              placeholder="Enter amount"
              onChange={(e) => setAmount(e.target.value)}
              required
            />
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
                onClick={() => setActiveButton("Limit Price")}
                className={`flex-1 py-2 rounded-full bg-opacity-40 ${activeButton === 'Limit Price' ? 'bg-green-500' : 'bg-gray-600'} border-gray-700 border-4 hover:border-green-700 backdrop-blur text-white text-lg font-medium transition-colors duration-200 ease-in-out shadow-md hover:bg-green-500`}
              >
                Limit Price
              </button>
            </div>

            {/* Active Button Info */}
            {activeButton === "Market Price" && (
              <input
                type="number"
                className=" opacity-100 p-4 mt-4 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-purple-500"
                value={currPrice}
                disabled
              />
            )}
            {activeButton === "Limit Price" && (
              <input
                type="number"
                min={0.01}
                step={0.01}
                onChange={(e) => setLimitPrice(e.target.value)}
                className="opacity-100 p-4 mt-4 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-purple-500"
                value={limitPrice}
              />
            )}
            <div className="border-t border-gray-600 my-5"></div>
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={handleAdd}
              className={`flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                loading ? "bg-gray-700" : "bg-purple-600 hover:bg-purple-700"
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
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
                <span>Loading</span>
                </>
              ) : (
                "Add SOL"
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
              onClick={() => setActiveButton("Limit Price")}
              className={`flex-1 py-2 rounded-full bg-opacity-40 ${activeButton === 'Limit Price' ? 'bg-green-500' : 'bg-gray-600'} border-gray-700 border-4 hover:border-green-700 backdrop-blur text-white text-lg font-medium transition-colors duration-200 ease-in-out shadow-md hover:bg-green-500`}
            >
              Limit Price
            </button>
          </div>

          {/* Active Button Info */}
          {activeButton === "Market Price" && (
            <input
              type="number"
              className=" opacity-100 p-4 mt-4 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-purple-500"
              value={currPrice}
              disabled
            />
          )}
          {activeButton === "Limit Price" && (
            <input
              type="number"
              className=" opacity-100 p-4 mt-4 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-purple-500"
              value={limitPrice}
              min={0.01}
              step={0.01}
              onChange={(e) => setLimitPrice(e.target.value)}
            />
          )}
          <div className="border-t border-gray-600 my-5"></div>
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={handleClose}
              className={`flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                loading ? "bg-gray-700" : "bg-purple-600 hover:bg-purple-700"
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
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
                <span>Loading</span>
                </>
              ) : (
                "Close"
              )}
            </button>
            </div>
        </div>
        )}

        {action === 'Remove SOL' && (
          <form onSubmit={handleRemove}>
          <label className="block mb-3">
            <span className="text-white">Amount:</span>
            <input
              type="number"
              min={0.01}
              step={0.01}
              className="opacity-100 p-4 mt-4 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-purple-500"
              placeholder="Enter amount"
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>
          <button className="mt-3 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" type="submit">{loading ? "Loading.." : "Remove"}</button>
          {showAlert && 
                    <div class="flex items-center p-4 my-4 text-sm text-green-800 border-green-800 border-2 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                    <svg class="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span class="sr-only">Info</span>
                    <div>
                        <span class="font-medium">Interaction was successfull! </span>
                    </div>
                    </div>
            }
        </form>
        )}

        {action === 'Repay sUSD' && (
          <form onSubmit={handleRepay}>
          <label className="block mb-3">
            <span className="text-white">Amount:</span>
            <input
                type="number"
                min={0.01}
                step={0.01}
                className="opacity-100 p-4 mt-4 block w-full rounded-md bg-gray-700 text-gray-300 border-transparent shadow-md h-12 text-lg transition-all duration-200 ease-in-out hover:border-gray-500 focus:border-purple-500"
                placeholder="Enter amount"
                onChange={(e) => setAmount(e.target.value)}
                required
              />
          </label>
          <button className="mt-3 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" type="submit">{loading ? "Loading.." : "Repay"}</button>
          {showAlert && 
                    <div class="flex items-center p-4 my-4 text-sm text-green-800 border-green-800 border-2 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                    <svg class="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span class="sr-only">Info</span>
                    <div>
                        <span class="font-medium">Interaction was successfull! </span>
                    </div>
                    </div>
            }
        </form>
        )}
        {action === 'Adjust Safemint Rate' && (
          <form onSubmit={handleSafemint}>
            <label className="block mb-3 text-center">
              <div className="flex justify-between text-md text-gray-400">
              <span>140</span>
              <span>160</span>
            </div>
              <input
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                type="range"
                name="rate"
                min="140"
                max="160"
                step={0.01}
                value={sliderValue}
                onChange={handleSliderChange}
                required
              />
              <span className="text-center text-white">Rate: {sliderValue}</span>
            </label>
            <button className="mt-3 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" type="submit">{loading ? "Loading.." : "Adjust"}</button>
            {showAlert && 
                    <div class="flex items-center p-4 my-4 text-sm text-green-800 border-green-800 border-2 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                    <svg class="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span class="sr-only">Info</span>
                    <div>
                        <span class="font-medium">Interaction was successfull! </span>
                    </div>
                    </div>
            }
          </form>
        )}
      </div>
    </div>
  );
};

export default Modal;