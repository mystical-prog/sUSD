import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { useParams } from "react-router-dom";
import { getSpecificCDP, sendDurableTx, withDrawNonce } from "../logic/chain-call";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import BottomBar from "./BottomBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FORM_CONFIGS = {
  'Issue sUSD': [
    { type: 'text', name: 'field1', label: 'Field 1', required: true },
  ],
  'Add SOL': [
    { type: 'toggle', name: 'marketPrice', label: 'Market Price' },
    { type: 'toggle', name: 'limitPrice', label: 'Limit Price' },
  ],
  'Close CDP': [
    { type: 'toggle', name: 'marketPrice', label: 'Market Price' },
    { type: 'toggle', name: 'limitPrice', label: 'Limit Price' },
  ],
  'Remove SOL': [
    { type: 'text', name: 'field1', label: 'Field 1', required: true },
  ],
  'Repay sUSD': [
    { type: 'text', name: 'field1', label: 'Field 1', required: true },
  ],
  'Adjust Safemint Rate': [
    { type: 'slider', name: 'safemintRate', label: 'Safemint Rate', min: 100, max: 200 },
  ],
};

const CDPInteraction = () => {
  const navigate = useNavigate();
  const {pubkey} = useParams();
  const [solRate, setRate] = useState(22);
  const wallet = useAnchorWallet();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [activeTab, setActiveTab] = useState('CDP Management'); 
  const [limit, setLimitOrders] = useState([]);

  const actions = [
    "Issue sUSD", "Repay sUSD", "Add SOL", "Remove SOL", "Close CDP", "Adjust Safemint Rate",
  ];

  const getCDP = async () => {
    const res = await axios.get("https://api.coinbase.com/v2/prices/SOL-USD/spot");
    setRate(Number(res.data.data.amount).toFixed(2));

    const cdp = await getSpecificCDP(wallet, pubkey);
    setInfo([
      { title: 'Entry Rate', value: Number(Number(cdp.entryPrice) * 10 / LAMPORTS_PER_SOL).toFixed(2)},
      { title: 'Liquidation Rate', value: Number(Number(cdp.liquidationPrice) * 10 / LAMPORTS_PER_SOL).toFixed(2) },
      { title: 'Amount', value: Number(cdp.amount) * LAMPORTS_PER_SOL/ 10**11 },
      { title: 'Safemint Rate', value: Number(cdp.debtPercent) / 100 },
      { title: 'Max Issuable Debt', value: Number(Number(cdp.maxDebt) / 10**6).toFixed(2) },
      { title: 'Issued Debt', value: Number(Number(cdp.usedDebt) / 10**6).toFixed(2) },
      { title: 'Volume', value: Number(cdp.amount) * LAMPORTS_PER_SOL/ 10**11 },
    ])

    let temp = limit;
    
    for(const i in temp){
      if(temp[i].type == "Add SOL") {
        if(temp[i].price <= Number(res.data.data.amount).toFixed(2)) {
          const sig = await sendDurableTx(wallet, temp[i].ser);
          alert("Limit Order Executed!");
          console.log(sig);
          temp.splice(i, 1);
        }
      } else {
        if(temp[i].price >= Number(res.data.data.amount).toFixed(2)) {
          const sig = await sendDurableTx(wallet, temp[i].ser);
          alert("Limit Order Executed!");
          console.log(sig);
          temp.splice(i, 1);
          setLimitOrders([]);
          window.location.href = "/";
        }
      }
    }
    setLimitOrders(temp);
    console.log(limit);
  }

  useEffect(() => {
    (async () => {
        await getCDP();

        const intervalId = setInterval(getCDP, 5000);
        return () => {
          clearInterval(intervalId);
        }
    })();
  }, []);

  const handleActionClick = (action) => {
    setActiveAction(action);
    setModalOpen(true);
  };

  const handleFormSubmit = (formData) => {
    console.log(formData);
    setModalOpen(false);
  };

  const handleCancelOrder = async (index) => {
    let temp = limit;
    try{
      await withDrawNonce(wallet, temp[index].noncePubkey);
      temp.splice(index, 1);
      setLimitOrders(temp);
      alert("Order Cancelled!");
      setActiveTab('CDP Management');
    } catch (error) {
      console.log(error);
    }
  }

  const [info, setInfo] = useState([
    { title: 'Entry Rate', value: '1.23' },
    { title: 'Liquidation Rate', value: '2.34' },
    { title: 'Amount', value: '1000' },
    { title: 'Safemint Rate', value: '4.56' },
    { title: 'Max Issuable Debt', value: '5000' },
    { title: 'Issued Debt', value: '3000' },
    { title: 'Volume', value: '7000' },
  ]);

  return (
    <>
    <div className="flex justify-center items-center h-full my-16 bg-gray-900">
      <div className="w-full md:w-1/2 lg:w-2/3 p-8 bg-gray-800 rounded-lg shadow-xl space-y-6">
        <h1 className="text-4xl text-center font-semibold mb-8 text-purple-500">Manage Your CDP</h1>

        {/* New code for tabs */}
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={() => setActiveTab('CDP Management')}
            className={`py-2 px-4 rounded ${activeTab === 'CDP Management' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'}`}
          >
            CDP Management
          </button>
          <button
            onClick={() => setActiveTab('Orders')}
            className={`py-2 px-4 rounded ${activeTab === 'Orders' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'}`}
          >
            Orders
          </button>
        </div>

        {activeTab === 'CDP Management' && (
          <>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">Title</th>
                    <th scope="col" className="px-6 py-3">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {info.map((item, index) => (
                    <tr className={`${index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'} border-b dark:border-gray-700`}>
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.title}</th>
                      <td className="px-6 py-4">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between space-x-4">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleActionClick(action)}
                  className="bg-purple-500 hover:bg-purple-700 text-white font-medium py-4 px-6 rounded shadow-lg "
                >
                  {action}
                </button>
              ))}
            </div>
          </>
        )}

        {activeTab === 'Orders' && (
          <>
          { limit.length == 0 ? <div className="block text-lg font-medium text-gray-300 transition-colors duration-200 ease-in-out">No Active Limit Orders</div> :
          <div className="mt-5">
            <h2 className="text-lg font-semibold tracking-wide text-purple-500 text-center">Orders</h2>
            {limit.map((order, index) => (
              <div key={index} className="bg-gray-700 rounded-md mt-4 p-4">
                <h3 className="text-lg text-white">{order.type}</h3>
                { order.type == "Add SOL" ? <p className="text-white mt-2">Amount: {order.amount}</p> : "" }
                <p className="text-white">Price: {order.price}</p>
                <p className="text-white">Nonce: {order.nonce}</p>
                <button onClick={() => handleCancelOrder(index)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mt-2 rounded">
                    Cancel Order
                </button>
              </div>
            ))}
          </div>
          }
          </>
        )}

        {modalOpen && activeAction && (
          <Modal
            action={activeAction}
            fields={FORM_CONFIGS[activeAction]}
            onClose={() => setModalOpen(false)}
            onSubmit={handleFormSubmit}
            pubkey={pubkey}
            limitOrders={limit}
            setOrders={setLimitOrders}
            currPrice={solRate}
          />
        )}
      </div>
    </div>
    <BottomBar solPrice={solRate} />
    </>
  );
};

export default CDPInteraction;
