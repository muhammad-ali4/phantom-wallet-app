import { useState, useEffect } from "react";
import { getProvider } from "./utils/getProvider";
import { getBalance } from "./utils/getBalance";
import phantomLogo from "/phantom.svg";
import "./App.css";

function App() {
  const phantom = getProvider();
  const [pubKey, setPubKey] = useState(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!phantom) return;

    phantom.connect({ onlyIfTrusted: true }).catch(() => {
      // fail silently
    });

    phantom.on("connect", (publicKey) => {
      setPubKey(publicKey);
      console.log("Connected to:", publicKey.toString());
      getBalance(publicKey)
        .then(setBalance)
        .catch((err) => {
          console.log(err.message);
        });
    });

    phantom.on("disconnect", () => {
      setPubKey(null);
      setBalance(0);
      console.log("Disconneted");
    });

    phantom.on("accountChanged", (publicKey) => {
      if (publicKey) {
        setPubKey(publicKey);
        getBalance(publicKey)
          .then(setBalance)
          .catch((err) => {
            console.log(err.message);
          });
        console.log("Switched to account:", publicKey.toString());
      }
    });

    return () => {
      phantom.disconnect();
    };
  }, [phantom]);

  const handleConnect = (e) => {
    phantom.connect().catch((err) => {
      console.log(err.message);
    });
  };

  const handleDisconnect = (e) => {
    phantom.disconnect().catch((err) => {
      console.log(err.message);
    });
  };

  return (
    <>
      <div>
        <a href="https://phantom.app" target="_blank">
          <img src={phantomLogo} className="logo" alt="Phantom logo" />
        </a>
      </div>
      <h1 className="heading">Phantom Wallet</h1>
      <div className="card">
        {!phantom?.isPhantom ? (
          <span>
            Couldn't find Phantom. Please install it from{" "}
            <a href="https://phantom.app" target="_blank">
              https://phantom.app
            </a>
            .
          </span>
        ) : !phantom.isConnected ? (
          <button onClick={handleConnect}>Connect</button>
        ) : (
          <>
            <span>
              Wallet: <code>{pubKey?.toString()}</code>
            </span>
            <p>Your current balance is:</p>
            <h2>{balance} SOL</h2>
            <button onClick={handleDisconnect}>Disconnect</button>
          </>
        )}
      </div>
    </>
  );
}

export default App;
