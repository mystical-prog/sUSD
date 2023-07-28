import './App.css';
import Navbar from './components/Navbar';
import CreateCDPForm from './components/Create';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';
import * as buffer from "buffer";
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import BottomBar from './components/BottomBar';
import CDPInteraction from './components/CDPInteraction';
import Landing from './components/Landing';
import List from './components/List';

require('@solana/wallet-adapter-react-ui/styles.css');

function App() {

  window.Buffer = buffer.Buffer;

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
          <main>
          <Routes>
            <Route path='' element={<Landing />} />
            <Route path='/create' element={<CreateCDPForm />} />
            <Route path='/list' element={<List />} />
            <Route path='/interact/:pubkey' element={<CDPInteraction />} />
          </Routes>
          </main>
      </BrowserRouter>
    </div>
  );
}

export const Context = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
      () => [
          /**
           * Wallets that implement either of these standards will be available automatically.
           *
           *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
           *     (https://github.com/solana-mobile/mobile-wallet-adapter)
           *   - Solana Wallet Standard
           *     (https://github.com/solana-labs/wallet-standard)
           *
           * If you wish to support a wallet that supports neither of those standards,
           * instantiate its legacy wallet adapter here. Common legacy adapters can be found
           * in the npm package `@solana/wallet-adapter-wallets`.
           */
          // new UnsafeBurnerWalletAdapter(),
          new PhantomWalletAdapter(),
      ],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [network]
  );

  return (
      <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
              <WalletModalProvider>{children}</WalletModalProvider>
          </WalletProvider>
      </ConnectionProvider>
  );
};


export default App;
