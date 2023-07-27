import React, { useState } from "react";
import Modal from "./Modal";

const FORM_CONFIGS = {
  'Issue CDP': [
    { type: 'text', name: 'field1', label: 'Field 1', required: true },
  ],
  'Add CDP': [
    { type: 'toggle', name: 'marketPrice', label: 'Market Price' },
    { type: 'toggle', name: 'limitPrice', label: 'Limit Price' },
  ],
  'Close CDP': [
    { type: 'toggle', name: 'marketPrice', label: 'Market Price' },
    { type: 'toggle', name: 'limitPrice', label: 'Limit Price' },
  ],
  'Remove CKBTC': [
    { type: 'text', name: 'field1', label: 'Field 1', required: true },
  ],
  'Repay CKBTC': [
    { type: 'text', name: 'field1', label: 'Field 1', required: true },
  ],
  'Adjust Safemint Rate': [
    { type: 'slider', name: 'safemintRate', label: 'Safemint Rate', min: 100, max: 200 },
  ],
};

const CDPInteraction = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [activeTab, setActiveTab] = useState('CDP Management');  // new state for active tab

  const actions = [
    "Issue CDP", "Add CDP", "Close CDP", "Remove CKBTC", "Adjust Safemint Rate", "Repay CKBTC"
  ];

  const handleActionClick = (action) => {
    setActiveAction(action);
    setModalOpen(true);
  };

  const handleFormSubmit = (formData) => {
    console.log(formData);
    setModalOpen(false);
  };

  const info = [
    { title: 'Entry Rate', value: '1.23' },
    { title: 'Liquidation Rate', value: '2.34' },
    { title: 'Amount', value: '1000' },
    { title: 'Safemint Rate', value: '4.56' },
    { title: 'Max Issuable Debt', value: '5000' },
    { title: 'Issued Debt', value: '3000' },
    { title: 'Volume', value: '7000' },
  ];

  const [cdps, setCdps] = useState([
    {amount: 100, price: 50, debtRate: 5, nonce: 1234567890},
    {amount: 200, price: 45, debtRate: 10, nonce: 2345678901},
    {amount: 150, price: 55, debtRate: 7, nonce: 3456789012}
  ]);

  return (
    <div className="flex justify-center items-center h-full my-32 bg-gray-900">
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
          <div className="mt-5">
            <h2 className="text-lg font-semibold tracking-wide text-purple-500 text-center">Orders</h2>
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

        {modalOpen && activeAction && (
          <Modal
            action={activeAction}
            fields={FORM_CONFIGS[activeAction]}
            onClose={() => setModalOpen(false)}
            onSubmit={handleFormSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default CDPInteraction;
