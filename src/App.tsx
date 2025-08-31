import React from 'react';
import { Web3Provider } from './lib/wagmi';
import MintWidget from './components/MintWidget';
import './App.css';

function App() {
  return (
    <Web3Provider>
      <div className="container">
        <header className="header">
          <h1>Declaration of the Daves</h1>
          <p>THE BANKSY STAYS ON THE WALL</p>
        </header>
        <main>
          <MintWidget />
        </main>
        <footer className="footer">
          <a href="https://basescan.org/address/0xB0731E7ea189c169640Fd890E5dcE9811040D0eA" target="_blank" rel="noopener noreferrer">
            View Declaration Contract on BaseScan
          </a>
        </footer>
      </div>
    </Web3Provider>
  );
}

export default App;