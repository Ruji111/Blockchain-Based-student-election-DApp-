import { useEffect, useState } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Admin from "./Admin";
import Keys from "./Keys";
import Login from "./Login";
import Register from "./Register";
import Vote from "./Vote";

function App() {
  const [account, setAccount] = useState("");
  const [connected, setConnected] = useState(false);
  const [chainId, setChainId] = useState("");
  const [voterToken, setVoterToken] = useState(localStorage.getItem("voterToken") || "");

  useEffect(() => {
    if (window.ethereum) {
      checkConnection();
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
          window.ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount("");
      setConnected(false);
    } else {
      setAccount(accounts[0]);
      setConnected(true);
    }
  };

  const handleChainChanged = (newChainId) => {
    try {
      const parsed = parseInt(newChainId, 16).toString();
      setChainId(parsed);
    } catch {
      setChainId(newChainId);
    }
  };

  const checkConnection = async () => {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    handleAccountsChanged(accounts);
    const currentChain = await window.ethereum.request({ method: "eth_chainId" });
    handleChainChanged(currentChain);
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is required.");
      return;
    }
    try {
      const [selectedAccount] = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(selectedAccount);
      setConnected(true);
      const currentChain = await window.ethereum.request({ method: "eth_chainId" });
      handleChainChanged(currentChain);
    } catch (error) {
      alert(error.message);
    }
  };

  const logout = () => {
    setVoterToken("");
    localStorage.removeItem("voterToken");
  };

  const disconnectWallet = () => {
    setAccount("");
    setConnected(false);
  };

  const switchToHardhat = async () => {
    if (!window.ethereum) {
      alert("MetaMask required.");
      return;
    }
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7A69' }], // 31337 in hex
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x7A69',
                chainName: 'Hardhat Local',
                rpcUrls: ['http://127.0.0.1:8545'],
                nativeCurrency: {
                  name: 'Ether',
                  symbol: 'ETH',
                  decimals: 18,
                },
              },
            ],
          });
        } catch (addError) {
          alert(addError.message);
        }
      } else {
        alert(switchError.message);
      }
    }
  };


  return (
    <div className="app-shell">
      <header>
        <h1>University Election DApp</h1>
        <nav>
          <Link to="/register">Register</Link> | <Link to="/login">Login</Link> | <Link to="/vote">Vote</Link> | <Link to="/admin">Admin</Link> | <Link to="/keys">Keys</Link>
        </nav>
        {chainId && (
          <span className="network-status">
            Network: {chainId === "31337" ? "Hardhat Local" : chainId}
          </span>
        )}
        {connected ? (
          <button onClick={disconnectWallet} className="connect-button">
            Disconnect Wallet
          </button>
        ) : (
          <button onClick={connectWallet} className="connect-button">
            Connect Wallet
          </button>
        )}
        <button onClick={switchToHardhat} className="hardhat-button">
          Switch to Hardhat
        </button>
        {voterToken && <button onClick={logout}>Logout</button>}
      </header>

      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setVoterToken={setVoterToken} />} />
        <Route path="/vote" element={<Vote voterToken={voterToken} walletAddress={account} chainId={chainId} />} />
        <Route path="/keys" element={<Keys />} />
        <Route path="/" element={<Navigate to="/register" />} />
      </Routes>
    </div>
  );
}

export default App;
