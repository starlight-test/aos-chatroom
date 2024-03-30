import './App.css'
import Arweave from 'arweave';
import {
  results,
} from "@permaweb/aoconnect";
import { useState } from 'react';
import { JWKInterface } from 'arweave/node/lib/wallet';

// Since v1.5.1 you're now able to call the init function for the web version without options. The current URL path will be used by default. This is recommended when running from a gateway.
const arweave = Arweave.init({});

// Or manually specify a host
// const arweave = Arweave.init({
//     host: '127.0.0.1',
//     port: 1984,
//     protocol: 'http'
// });

function App() {
  const [wallet, setWallet] = useState<JWKInterface|null>(null)

  const generateWallet = async () => {
    const wallet = await arweave.wallets.generate();
    console.log(wallet);
    setWallet(wallet);
  }

  const getMessages = async () => {
    const resultsOut = await results({
      process: "qeNpDBVhSdJQwHLK5LYq-rmzifl3UvPJrCoFuo1qx6E",
      sort: "ASC",
      limit: 25,
    });

    console.log(resultsOut);
  }

  return (
    <>
        <h1>Hello World!</h1>
        <button onClick={generateWallet}>Generate Wallet</button>
        <button onClick={getMessages}>Get Messages</button>
    </>
  )
}

export default App
