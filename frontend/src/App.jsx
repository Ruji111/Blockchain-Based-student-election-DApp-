import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Admin from "./Admin";
import Login from "./Login";
import Vote from "./Vote";

function App() {
  const [account, setAccount] = useState("");
  const [connected, setConnected] = useState(false);
  const [voterToken, setVoterToken] = useState(localStorage.getItem("voterToken") || "");

  useEffect(() => {
    if (window.ethereum) {
      checkConnection();
    }
  }, []);

  const checkConnection = async () => {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setConnected(true);
    }
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
    } catch (error) {
      alert(error.message);
    }
  };

  const logout = () => {
    setVoterToken("");
    localStorage.removeItem("voterToken");
  };

  return (
    <div className="app-shell">
      <header>
        <h1>University Election DApp</h1>
        <nav>
          <a href="/admin">Admin</a> | <a href="/login">Login</a> | <a href="/vote">Vote</a>
        </nav>
        <button onClick={connectWallet} className="connect-button">
          {connected ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
        </button>
        {voterToken && <button onClick={logout}>Logout</button>}
      </header>

      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login setVoterToken={setVoterToken} />} />
        <Route path="/vote" element={<Vote voterToken={voterToken} />} />
        <Route path="/" element={<Navigate to="/vote" />} />
      </Routes>
    </div>
  );
}

export default App;
